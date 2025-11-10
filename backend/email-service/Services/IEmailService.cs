namespace EmailService.API.Services;

public interface IEmailService
{
    Task SendVerificationEmailAsync(string email, string username, string verificationToken, string verificationUrl);
    Task SendPasswordResetEmailAsync(string email, string username, string resetToken, string resetUrl);
}

