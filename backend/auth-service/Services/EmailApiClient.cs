using System.Text;
using System.Text.Json;
using AuthService.API.Models;

namespace AuthService.API.Services;

public interface IEmailApiClient
{
    Task SendVerificationEmailAsync(string email, string username, string verificationToken, string verificationUrl);
    Task SendPasswordResetEmailAsync(string email, string username, string resetToken, string resetUrl);
}

public class EmailApiClient : IEmailApiClient
{
    private readonly HttpClient _httpClient;
    private readonly ILogger<EmailApiClient> _logger;
    private readonly string _emailServiceBaseUrl;

    public EmailApiClient(
        HttpClient httpClient,
        IConfiguration configuration,
        ILogger<EmailApiClient> logger)
    {
        _httpClient = httpClient;
        _logger = logger;
        _emailServiceBaseUrl = configuration["EmailService:BaseUrl"] 
            ?? "http://localhost:5004";
        
        _httpClient.BaseAddress = new Uri(_emailServiceBaseUrl);
        _httpClient.Timeout = TimeSpan.FromSeconds(30);
    }

    public async Task SendVerificationEmailAsync(string email, string username, string verificationToken, string verificationUrl)
    {
        try
        {
            var request = new
            {
                Email = email,
                Username = username,
                VerificationToken = verificationToken,
                VerificationUrl = verificationUrl
            };

            var json = JsonSerializer.Serialize(request);
            var content = new StringContent(json, Encoding.UTF8, "application/json");

            var response = await _httpClient.PostAsync("/api/email/send-verification", content);

            if (response.IsSuccessStatusCode)
            {
                _logger.LogInformation("Verification email request sent successfully to email-service for {Email}", email);
            }
            else
            {
                var errorContent = await response.Content.ReadAsStringAsync();
                _logger.LogError("Failed to send verification email via email-service. Status: {Status}, Error: {Error}",
                    response.StatusCode, errorContent);
                throw new Exception($"Email service error: {response.StatusCode} - {errorContent}");
            }
        }
        catch (HttpRequestException ex)
        {
            _logger.LogError(ex, "Network error calling email-service for verification email to {Email}", email);
            throw;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error calling email-service for verification email to {Email}", email);
            throw;
        }
    }

    public async Task SendPasswordResetEmailAsync(string email, string username, string resetToken, string resetUrl)
    {
        try
        {
            var request = new
            {
                Email = email,
                Username = username,
                ResetToken = resetToken,
                ResetUrl = resetUrl
            };

            var json = JsonSerializer.Serialize(request);
            var content = new StringContent(json, Encoding.UTF8, "application/json");

            var response = await _httpClient.PostAsync("/api/email/send-password-reset", content);

            if (response.IsSuccessStatusCode)
            {
                _logger.LogInformation("Password reset email request sent successfully to email-service for {Email}", email);
            }
            else
            {
                var errorContent = await response.Content.ReadAsStringAsync();
                _logger.LogError("Failed to send password reset email via email-service. Status: {Status}, Error: {Error}",
                    response.StatusCode, errorContent);
                throw new Exception($"Email service error: {response.StatusCode} - {errorContent}");
            }
        }
        catch (HttpRequestException ex)
        {
            _logger.LogError(ex, "Network error calling email-service for password reset email to {Email}", email);
            throw;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error calling email-service for password reset email to {Email}", email);
            throw;
        }
    }
}

