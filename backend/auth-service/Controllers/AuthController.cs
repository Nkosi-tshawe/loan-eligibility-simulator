using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using AuthService.API.Models;
using AuthServiceClass = AuthService.API.Services.AuthService;

namespace AuthService.API.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    private readonly AuthServiceClass _authService;
    private readonly ILogger<AuthController> _logger;

    public AuthController(AuthServiceClass authService, ILogger<AuthController> logger)
    {
        _authService = authService;
        _logger = logger;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterRequest request)
    {
        try
        {
            var response = await _authService.RegisterAsync(request);
            return Ok(response);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { error = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error during registration");
            return StatusCode(500, new { error = "An error occurred during registration" });
        }
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest request)
    {
        try
        {
            var response = await _authService.LoginAsync(request);
            return Ok(response);
        }
        catch (UnauthorizedAccessException ex)
        {
            return Unauthorized(new { error = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error during login");
            return StatusCode(500, new { error = "An error occurred during login" });
        }
    }

    [HttpPost("refresh")]
    public async Task<IActionResult> RefreshToken([FromBody] RefreshTokenRequest request)
    {
        try
        {
            var response = await _authService.RefreshTokenAsync(request.RefreshToken);
            return Ok(response);
        }
        catch (UnauthorizedAccessException ex)
        {
            return Unauthorized(new { error = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error during token refresh");
            return StatusCode(500, new { error = "An error occurred during token refresh" });
        }
    }

    [HttpPost("validate")]
    public async Task<IActionResult> ValidateToken([FromBody] ValidateTokenRequest request)
    {
        try
        {
            var response = await _authService.ValidateTokenAsync(request.Token);
            return Ok(response);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error during token validation");
            return StatusCode(500, new { error = "An error occurred during token validation" });
        }
    }

    [HttpGet("me")]
    [Authorize]
    public async Task<IActionResult> GetCurrentUser()
    {
        try
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out var userId))
            {
                return Unauthorized(new { error = "Invalid user token" });
            }

            var user = await _authService.GetUserByIdAsync(userId);
            if (user == null)
            {
                return NotFound(new { error = "User not found" });
            }

            return Ok(user);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving current user");
            return StatusCode(500, new { error = "An error occurred while retrieving user details" });
        }
    }

    [HttpPost("verify-email")]
    public async Task<IActionResult> VerifyEmail([FromBody] VerifyEmailRequest request)
    {
        try
        {
            if (string.IsNullOrWhiteSpace(request.Token))
            {
                return BadRequest(new VerifyEmailResponse
                {
                    Success = false,
                    Message = "Verification token is required"
                });
            }

            var success = await _authService.VerifyEmailAsync(request.Token);
            
            if (success)
            {
                return Ok(new VerifyEmailResponse
                {
                    Success = true,
                    Message = "Email verified successfully"
                });
            }

            return BadRequest(new VerifyEmailResponse
            {
                Success = false,
                Message = "Invalid or expired verification token"
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error during email verification");
            return StatusCode(500, new VerifyEmailResponse
            {
                Success = false,
                Message = "An error occurred during email verification"
            });
        }
    }

    [HttpGet("verify-email")]
    public async Task<IActionResult> VerifyEmailGet([FromQuery] string token)
    {
        try
        {
            if (string.IsNullOrWhiteSpace(token))
            {
                return BadRequest(new VerifyEmailResponse
                {
                    Success = false,
                    Message = "Verification token is required"
                });
            }

            var success = await _authService.VerifyEmailAsync(token);
            
            if (success)
            {
                return Ok(new VerifyEmailResponse
                {
                    Success = true,
                    Message = "Email verified successfully"
                });
            }

            return BadRequest(new VerifyEmailResponse
            {
                Success = false,
                Message = "Invalid or expired verification token"
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error during email verification");
            return StatusCode(500, new VerifyEmailResponse
            {
                Success = false,
                Message = "An error occurred during email verification"
            });
        }
    }

    [HttpPost("resend-verification")]
    public async Task<IActionResult> ResendVerificationEmail([FromBody] ResendVerificationEmailRequest request)
    {
        try
        {
            if (string.IsNullOrWhiteSpace(request.Email))
            {
                return BadRequest(new ResendVerificationEmailResponse
                {
                    Success = false,
                    Message = "Email address is required"
                });
            }

            // Always return success to prevent email enumeration
            await _authService.ResendVerificationEmailAsync(request.Email);
            
            return Ok(new ResendVerificationEmailResponse
            {
                Success = true,
                Message = "If the email address is registered and not yet verified, a verification email has been sent"
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error resending verification email");
            return StatusCode(500, new ResendVerificationEmailResponse
            {
                Success = false,
                Message = "An error occurred while resending the verification email"
            });
        }
    }

    [HttpPost("forgot-password")]
    public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordRequest request)
    {
        try
        {
            if (string.IsNullOrWhiteSpace(request.Email))
            {
                return BadRequest(new ForgotPasswordResponse
                {
                    Success = false,
                    Message = "Email address is required"
                });
            }

            // Always return success to prevent email enumeration
            await _authService.RequestPasswordResetAsync(request.Email);
            
            return Ok(new ForgotPasswordResponse
            {
                Success = true,
                Message = "If an account exists with that email, a password reset link has been sent"
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error processing forgot password request");
            return StatusCode(500, new ForgotPasswordResponse
            {
                Success = false,
                Message = "An error occurred while processing your request"
            });
        }
    }

    [HttpPost("reset-password")]
    public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordRequest request)
    {
        try
        {
            if (string.IsNullOrWhiteSpace(request.Token))
            {
                return BadRequest(new ResetPasswordResponse
                {
                    Success = false,
                    Message = "Reset token is required"
                });
            }

            if (string.IsNullOrWhiteSpace(request.NewPassword))
            {
                return BadRequest(new ResetPasswordResponse
                {
                    Success = false,
                    Message = "New password is required"
                });
            }

            if (request.NewPassword.Length < 8)
            {
                return BadRequest(new ResetPasswordResponse
                {
                    Success = false,
                    Message = "Password must be at least 8 characters long"
                });
            }

            var success = await _authService.ResetPasswordAsync(request.Token, request.NewPassword);
            
            if (success)
            {
                return Ok(new ResetPasswordResponse
                {
                    Success = true,
                    Message = "Password reset successfully"
                });
            }

            return BadRequest(new ResetPasswordResponse
            {
                Success = false,
                Message = "Invalid or expired reset token"
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error during password reset");
            return StatusCode(500, new ResetPasswordResponse
            {
                Success = false,
                Message = "An error occurred during password reset"
            });
        }
    }

    [HttpGet("health")]
    public IActionResult Health()
    {
        return Ok(new { status = "ok", service = "auth-service", timestamp = DateTime.UtcNow });
    }
}

