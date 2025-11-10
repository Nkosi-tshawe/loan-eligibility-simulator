using System.Text;

namespace EmailService.API.Services;

public class EmailService : IEmailService
{
    private readonly ILogger<EmailService> _logger;
    private readonly IConfiguration _configuration;
    private readonly IHttpClientFactory _httpClientFactory;

    public EmailService(ILogger<EmailService> logger, IConfiguration configuration, IHttpClientFactory httpClientFactory)
    {
        _logger = logger;
        _configuration = configuration;
        _httpClientFactory = httpClientFactory;
    }

    public async Task SendVerificationEmailAsync(string email, string username, string verificationToken, string verificationUrl)
    {
        var fullUrl = $"{verificationUrl}?token={verificationToken}";
        
        var fromAddress = _configuration["Email:FromAddress"] ?? "noreply@loaneligibility.com";
        var fromName = _configuration["Email:FromName"] ?? "Loan Eligibility System";
        var subject = "Verify Your Email Address";
        
        var htmlBody = $@"
<!DOCTYPE html>
<html>
<head>
    <meta charset='utf-8'>
    <style>
        body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
        .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
        .button {{ display: inline-block; padding: 12px 24px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }}
        .button:hover {{ background-color: #0056b3; }}
        .footer {{ margin-top: 30px; font-size: 12px; color: #666; }}
    </style>
</head>
<body>
    <div class='container'>
        <h2>Welcome, {username}!</h2>
        <p>Thank you for registering with Loan Eligibility System. Please verify your email address by clicking the button below:</p>
        <a href='{fullUrl}' class='button'>Verify Email Address</a>
        <p>Or copy and paste this link into your browser:</p>
        <p style='word-break: break-all; color: #007bff;'>{fullUrl}</p>
        <p>This verification link will expire in 7 days.</p>
        <div class='footer'>
            <p>If you did not create an account, please ignore this email.</p>
        </div>
    </div>
</body>
</html>";

        var textBody = $@"
Welcome, {username}!

Thank you for registering with Loan Eligibility System. Please verify your email address by visiting the following link:

{fullUrl}

This verification link will expire in 7 days.

If you did not create an account, please ignore this email.";

        await SendEmailAsync(email, fromAddress, fromName, subject, htmlBody, textBody);
    }

    public async Task SendPasswordResetEmailAsync(string email, string username, string resetToken, string resetUrl)
    {
        var fullUrl = $"{resetUrl}?token={resetToken}";
        
        var fromAddress = _configuration["Email:FromAddress"] ?? "noreply@loaneligibility.com";
        var fromName = _configuration["Email:FromName"] ?? "Loan Eligibility System";
        var subject = "Reset Your Password";
        
        var htmlBody = $@"
<!DOCTYPE html>
<html>
<head>
    <meta charset='utf-8'>
    <style>
        body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
        .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
        .button {{ display: inline-block; padding: 12px 24px; background-color: #dc3545; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }}
        .button:hover {{ background-color: #c82333; }}
        .footer {{ margin-top: 30px; font-size: 12px; color: #666; }}
        .warning {{ background-color: #fff3cd; border-left: 4px solid #ffc107; padding: 12px; margin: 20px 0; }}
    </style>
</head>
<body>
    <div class='container'>
        <h2>Password Reset Request</h2>
        <p>Hello {username},</p>
        <p>We received a request to reset your password. Click the button below to reset it:</p>
        <a href='{fullUrl}' class='button'>Reset Password</a>
        <p>Or copy and paste this link into your browser:</p>
        <p style='word-break: break-all; color: #dc3545;'>{fullUrl}</p>
        <div class='warning'>
            <strong>Important:</strong> This link will expire in 1 hour. If you did not request a password reset, please ignore this email and your password will remain unchanged.
        </div>
        <div class='footer'>
            <p>If you did not request this password reset, please contact support immediately.</p>
        </div>
    </div>
</body>
</html>";

        var textBody = $@"
Password Reset Request

Hello {username},

We received a request to reset your password. Visit the following link to reset it:

{fullUrl}

This link will expire in 1 hour.

If you did not request a password reset, please ignore this email and your password will remain unchanged.";

        await SendEmailAsync(email, fromAddress, fromName, subject, htmlBody, textBody);
    }

    private async Task SendEmailAsync(string toEmail, string fromAddress, string fromName, string subject, string htmlBody, string textBody)
    {
        var apiKey = _configuration["Email:Mailgun:ApiKey"];
        var domain = _configuration["Email:Mailgun:Domain"];
        var baseUrl = _configuration["Email:Mailgun:BaseUrl"] ?? "https://api.mailgun.net/v3";

        // If Mailgun is not configured, fall back to logging
        if (string.IsNullOrWhiteSpace(apiKey) || string.IsNullOrWhiteSpace(domain))
        {
            _logger.LogWarning(
                "Mailgun not configured. Email would be sent to {Email} with subject: {Subject}. " +
                "Configure Email:Mailgun:ApiKey and Email:Mailgun:Domain to enable email sending.",
                toEmail, subject);
            
            // Log the email content for development
            _logger.LogInformation("Email content for {Email}:\nSubject: {Subject}\n\n{Body}",
                toEmail, subject, textBody);
            return;
        }

        try
        {
            using var httpClient = _httpClientFactory.CreateClient();
            var requestUri = $"{baseUrl}/{domain}/messages";
            var authValue = Convert.ToBase64String(Encoding.ASCII.GetBytes($"api:{apiKey}"));
            
            httpClient.DefaultRequestHeaders.Authorization = 
                new System.Net.Http.Headers.AuthenticationHeaderValue("Basic", authValue);

            var formData = new List<KeyValuePair<string, string>>
            {
                new("from", $"{fromName} <{fromAddress}>"),
                new("to", toEmail),
                new("subject", subject),
                new("text", textBody),
                new("html", htmlBody)
            };

            var formContent = new FormUrlEncodedContent(formData);
            var response = await httpClient.PostAsync(requestUri, formContent);

            if (response.IsSuccessStatusCode)
            {
                var responseContent = await response.Content.ReadAsStringAsync();
                _logger.LogInformation("Email sent successfully to {Email} via Mailgun. Response: {Response}",
                    toEmail, responseContent);
            }
            else
            {
                var errorContent = await response.Content.ReadAsStringAsync();
                _logger.LogError("Failed to send email to {Email} via Mailgun. Status: {Status}, Error: {Error}",
                    toEmail, response.StatusCode, errorContent);
                throw new Exception($"Mailgun API error: {response.StatusCode} - {errorContent}");
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error sending email to {Email} via Mailgun", toEmail);
            throw;
        }
    }
}

