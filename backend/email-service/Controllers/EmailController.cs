using Microsoft.AspNetCore.Mvc;
using EmailService.API.Models;
using EmailService.API.Services;

namespace EmailService.API.Controllers;

[ApiController]
[Route("api/email")]
public class EmailController : ControllerBase
{
    private readonly IEmailService _emailService;
    private readonly ILogger<EmailController> _logger;

    public EmailController(IEmailService emailService, ILogger<EmailController> logger)
    {
        _emailService = emailService;
        _logger = logger;
    }

    [HttpPost("send-verification")]
    public async Task<IActionResult> SendVerificationEmail([FromBody] SendVerificationEmailRequest request)
    {
        try
        {
            if (string.IsNullOrWhiteSpace(request.Email) || 
                string.IsNullOrWhiteSpace(request.Username) ||
                string.IsNullOrWhiteSpace(request.VerificationToken) ||
                string.IsNullOrWhiteSpace(request.VerificationUrl))
            {
                return BadRequest(new SendEmailResponse
                {
                    Success = false,
                    Message = "All fields are required"
                });
            }

            await _emailService.SendVerificationEmailAsync(
                request.Email,
                request.Username,
                request.VerificationToken,
                request.VerificationUrl);

            return Ok(new SendEmailResponse
            {
                Success = true,
                Message = "Verification email sent successfully"
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error sending verification email to {Email}", request.Email);
            return StatusCode(500, new SendEmailResponse
            {
                Success = false,
                Message = "An error occurred while sending the verification email"
            });
        }
    }

    [HttpPost("send-password-reset")]
    public async Task<IActionResult> SendPasswordResetEmail([FromBody] SendPasswordResetEmailRequest request)
    {
        try
        {
            if (string.IsNullOrWhiteSpace(request.Email) || 
                string.IsNullOrWhiteSpace(request.Username) ||
                string.IsNullOrWhiteSpace(request.ResetToken) ||
                string.IsNullOrWhiteSpace(request.ResetUrl))
            {
                return BadRequest(new SendEmailResponse
                {
                    Success = false,
                    Message = "All fields are required"
                });
            }

            await _emailService.SendPasswordResetEmailAsync(
                request.Email,
                request.Username,
                request.ResetToken,
                request.ResetUrl);

            return Ok(new SendEmailResponse
            {
                Success = true,
                Message = "Password reset email sent successfully"
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error sending password reset email to {Email}", request.Email);
            return StatusCode(500, new SendEmailResponse
            {
                Success = false,
                Message = "An error occurred while sending the password reset email"
            });
        }
    }

    [HttpGet("health")]
    public IActionResult Health()
    {
        return Ok(new { status = "ok", service = "email-service", timestamp = DateTime.UtcNow });
    }
}

