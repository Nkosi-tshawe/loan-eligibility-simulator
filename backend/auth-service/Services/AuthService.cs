using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using AuthService.API.Data;
using AuthService.API.Data.Entities;
using AuthService.API.Models;
using BCrypt.Net;

namespace AuthService.API.Services;

public class AuthService
{
    private readonly AuthDbContext _context;
    private readonly IConfiguration _configuration;
    private readonly ILogger<AuthService> _logger;
    private readonly IEmailApiClient _emailApiClient;

    public AuthService(
        AuthDbContext context,
        IConfiguration configuration,
        ILogger<AuthService> logger,
        IEmailApiClient emailApiClient)
    {
        _context = context;
        _configuration = configuration;
        _logger = logger;
        _emailApiClient = emailApiClient;
    }

    public async Task<AuthResponse> RegisterAsync(RegisterRequest request)
    {
        // Check if user already exists
        if (await _context.Users.AnyAsync(u => u.Username == request.Username || u.Email == request.Email))
        {
            throw new ArgumentException("Username or email already exists");
        }

        // Hash password
        var passwordHash = BCrypt.Net.BCrypt.HashPassword(request.Password);

        // Generate email verification token
        var verificationToken = GenerateVerificationToken();
        var tokenExpiresAt = DateTime.UtcNow.AddDays(7); // Token valid for 7 days

        // Create user
        var user = new UserEntity
        {
            Username = request.Username,
            Email = request.Email,
            PasswordHash = passwordHash,
            FirstName = request.FirstName,
            LastName = request.LastName,
            IsActive = true,
            EmailVerified = false,
            EmailVerificationToken = verificationToken,
            EmailVerificationTokenExpiresAt = tokenExpiresAt,
            CreatedAt = DateTime.UtcNow
        };

        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        // Send verification email
        var verificationUrl = _configuration["Email:VerificationUrl"] 
            ?? _configuration["App:BaseUrl"] + "/verify-email";
        
        await _emailApiClient.SendVerificationEmailAsync(
            user.Email, 
            user.Username, 
            verificationToken, 
            verificationUrl);

        // Generate tokens
        var (accessToken, expiresAt) = GenerateAccessToken(user);
        var refreshToken = await GenerateRefreshTokenAsync(user.Id);

        return new AuthResponse
        {
            // AccessToken = accessToken,
            // RefreshToken = refreshToken,
            // ExpiresAt = expiresAt,
            User = MapToDto(user)
        };
    }

    public async Task<AuthResponse> LoginAsync(LoginRequest request)
    {
        var user = await _context.Users
            .FirstOrDefaultAsync(u => (u.Username == request.Username || u.Email == request.Username) && u.IsActive);

        if (user == null || !BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
        {
            throw new UnauthorizedAccessException("Invalid username or password");
        }

        if (!user.EmailVerified)
        {
            throw new UnauthorizedAccessException("Email not verified. Please check your email for the verification link.");
        }

        // Update last login
        user.LastLoginAt = DateTime.UtcNow;
        await _context.SaveChangesAsync();

        // Generate tokens
        var (accessToken, expiresAt) = GenerateAccessToken(user);
        var refreshToken = await GenerateRefreshTokenAsync(user.Id);

        return new AuthResponse
        {
            AccessToken = accessToken,
            RefreshToken = refreshToken,
            ExpiresAt = expiresAt,
            User = MapToDto(user)
        };
    }

    public async Task<AuthResponse> RefreshTokenAsync(string refreshToken)
    {
        var tokenEntity = await _context.RefreshTokens
            .Include(t => t.User)
            .FirstOrDefaultAsync(t => t.Token == refreshToken && !t.IsRevoked);

        if (tokenEntity == null || tokenEntity.ExpiresAt < DateTime.UtcNow)
        {
            throw new UnauthorizedAccessException("Invalid or expired refresh token");
        }

        var user = tokenEntity.User;
        if (!user.IsActive)
        {
            throw new UnauthorizedAccessException("User is not active");
        }

        // Revoke old token
        tokenEntity.IsRevoked = true;

        // Generate new tokens
        var (accessToken, expiresAt) = GenerateAccessToken(user);
        var newRefreshToken = await GenerateRefreshTokenAsync(user.Id);

        await _context.SaveChangesAsync();

        return new AuthResponse
        {
            AccessToken = accessToken,
            RefreshToken = newRefreshToken,
            ExpiresAt = expiresAt,
            User = MapToDto(user)
        };
    }

    public async Task<ValidateTokenResponse> ValidateTokenAsync(string token)
    {
        try
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.UTF8.GetBytes(_configuration["Jwt:Secret"] ?? throw new InvalidOperationException("JWT Secret not configured"));

            var validationParameters = new TokenValidationParameters
            {
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = new SymmetricSecurityKey(key),
                ValidateIssuer = true,
                ValidIssuer = _configuration["Jwt:Issuer"],
                ValidateAudience = true,
                ValidAudience = _configuration["Jwt:Audience"],
                ValidateLifetime = true,
                ClockSkew = TimeSpan.Zero
            };

            var principal = tokenHandler.ValidateToken(token, validationParameters, out var validatedToken);

            var userIdClaim = principal.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var usernameClaim = principal.FindFirst(ClaimTypes.Name)?.Value;
            var emailClaim = principal.FindFirst(ClaimTypes.Email)?.Value;

            if (int.TryParse(userIdClaim, out var userId))
            {
                var user = await _context.Users.FindAsync(userId);
                if (user != null && user.IsActive)
                {
                    return new ValidateTokenResponse
                    {
                        IsValid = true,
                        UserId = userId,
                        Username = usernameClaim,
                        Email = emailClaim
                    };
                }
            }

            return new ValidateTokenResponse { IsValid = false };
        }
        catch
        {
            return new ValidateTokenResponse { IsValid = false };
        }
    }

    private (string Token, DateTime ExpiresAt) GenerateAccessToken(UserEntity user)
    {
        var key = Encoding.UTF8.GetBytes(_configuration["Jwt:Secret"] ?? throw new InvalidOperationException("JWT Secret not configured"));
        var expiresAt = DateTime.UtcNow.AddHours(1); // Token valid for 1 hour

        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new Claim(ClaimTypes.Name, user.Username),
            new Claim(ClaimTypes.Email, user.Email),
            new Claim("userId", user.Id.ToString())
        };

        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(claims),
            Expires = expiresAt,
            Issuer = _configuration["Jwt:Issuer"],
            Audience = _configuration["Jwt:Audience"],
            SigningCredentials = new SigningCredentials(
                new SymmetricSecurityKey(key),
                SecurityAlgorithms.HmacSha256Signature)
        };

        var tokenHandler = new JwtSecurityTokenHandler();
        var token = tokenHandler.CreateToken(tokenDescriptor);

        return (tokenHandler.WriteToken(token), expiresAt);
    }

    private async Task<string> GenerateRefreshTokenAsync(int userId)
    {
        var randomBytes = new byte[64];
        using var rng = RandomNumberGenerator.Create();
        rng.GetBytes(randomBytes);
        var token = Convert.ToBase64String(randomBytes);

        var refreshToken = new RefreshTokenEntity
        {
            UserId = userId,
            Token = token,
            ExpiresAt = DateTime.UtcNow.AddDays(7), // Refresh token valid for 7 days
            CreatedAt = DateTime.UtcNow
        };

        _context.RefreshTokens.Add(refreshToken);
        await _context.SaveChangesAsync();

        return token;
    }

    public async Task<UserDto?> GetUserByIdAsync(int userId)
    {
        var user = await _context.Users.FindAsync(userId);
        if (user == null || !user.IsActive)
        {
            return null;
        }

        return MapToDto(user);
    }

    public async Task<bool> VerifyEmailAsync(string token)
    {
        var user = await _context.Users
            .FirstOrDefaultAsync(u => u.EmailVerificationToken == token && !u.EmailVerified);

        if (user == null)
        {
            return false;
        }

        // Check if token is expired
        if (user.EmailVerificationTokenExpiresAt.HasValue && 
            user.EmailVerificationTokenExpiresAt.Value < DateTime.UtcNow)
        {
            return false;
        }

        // Verify email
        user.EmailVerified = true;
        user.EmailVerificationToken = null;
        user.EmailVerificationTokenExpiresAt = null;
        user.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        _logger.LogInformation("Email verified for user {UserId} ({Email})", user.Id, user.Email);

        return true;
    }

    public async Task<bool> ResendVerificationEmailAsync(string email)
    {
        var user = await _context.Users
            .FirstOrDefaultAsync(u => u.Email == email && !u.EmailVerified);

        if (user == null)
        {
            // Don't reveal if email exists or is already verified
            return true;
        }

        // Generate new verification token
        var verificationToken = GenerateVerificationToken();
        var tokenExpiresAt = DateTime.UtcNow.AddDays(7);

        user.EmailVerificationToken = verificationToken;
        user.EmailVerificationTokenExpiresAt = tokenExpiresAt;
        user.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        // Send verification email
        var verificationUrl = _configuration["Email:VerificationUrl"] 
            ?? _configuration["App:BaseUrl"] + "/verify-email";
        
        await _emailApiClient.SendVerificationEmailAsync(
            user.Email, 
            user.Username, 
            verificationToken, 
            verificationUrl);

        _logger.LogInformation("Verification email resent for user {UserId} ({Email})", user.Id, user.Email);

        return true;
    }

    public async Task<bool> RequestPasswordResetAsync(string email)
    {
        var user = await _context.Users
            .FirstOrDefaultAsync(u => u.Email == email && u.IsActive);

        if (user == null)
        {
            // Don't reveal if email exists - always return success to prevent email enumeration
            return true;
        }

        // Generate password reset token
        var resetToken = GenerateVerificationToken();
        var tokenExpiresAt = DateTime.UtcNow.AddHours(1); // Token valid for 1 hour

        user.PasswordResetToken = resetToken;
        user.PasswordResetTokenExpiresAt = tokenExpiresAt;
        user.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        // Send password reset email
        var resetUrl = _configuration["Email:PasswordResetUrl"] 
            ?? _configuration["App:BaseUrl"] + "/reset-password";
        
        await _emailApiClient.SendPasswordResetEmailAsync(
            user.Email, 
            user.Username, 
            resetToken, 
            resetUrl);

        _logger.LogInformation("Password reset email sent for user {UserId} ({Email})", user.Id, user.Email);

        return true;
    }

    public async Task<bool> ResetPasswordAsync(string token, string newPassword)
    {
        var user = await _context.Users
            .FirstOrDefaultAsync(u => u.PasswordResetToken == token && u.IsActive);

        if (user == null)
        {
            return false;
        }

        // Check if token is expired
        if (user.PasswordResetTokenExpiresAt.HasValue && 
            user.PasswordResetTokenExpiresAt.Value < DateTime.UtcNow)
        {
            return false;
        }

        // Reset password
        var passwordHash = BCrypt.Net.BCrypt.HashPassword(newPassword);
        user.PasswordHash = passwordHash;
        user.PasswordResetToken = null;
        user.PasswordResetTokenExpiresAt = null;
        user.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        _logger.LogInformation("Password reset successful for user {UserId} ({Email})", user.Id, user.Email);

        return true;
    }

    private string GenerateVerificationToken()
    {
        var randomBytes = new byte[32];
        using var rng = RandomNumberGenerator.Create();
        rng.GetBytes(randomBytes);
        return Convert.ToBase64String(randomBytes)
            .Replace("+", "-")
            .Replace("/", "_")
            .Replace("=", "");
    }

    private static UserDto MapToDto(UserEntity user)
    {
        return new UserDto
        {
            Id = user.Id,
            Username = user.Username,
            Email = user.Email,
            FirstName = user.FirstName,
            LastName = user.LastName,
            EmailVerified = user.EmailVerified
        };
    }
}

