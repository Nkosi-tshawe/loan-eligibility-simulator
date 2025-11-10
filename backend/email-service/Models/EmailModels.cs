namespace EmailService.API.Models;

public class SendVerificationEmailRequest
{
    public string Email { get; set; } = string.Empty;
    public string Username { get; set; } = string.Empty;
    public string VerificationToken { get; set; } = string.Empty;
    public string VerificationUrl { get; set; } = string.Empty;
}

public class SendPasswordResetEmailRequest
{
    public string Email { get; set; } = string.Empty;
    public string Username { get; set; } = string.Empty;
    public string ResetToken { get; set; } = string.Empty;
    public string ResetUrl { get; set; } = string.Empty;
}

public class SendEmailResponse
{
    public bool Success { get; set; }
    public string Message { get; set; } = string.Empty;
}

