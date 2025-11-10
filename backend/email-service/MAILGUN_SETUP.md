# Mailgun Email Service Setup

This document explains how to configure Mailgun for sending emails in the email-service.

## Prerequisites

1. Create a Mailgun account at [https://www.mailgun.com](https://www.mailgun.com)
2. Verify your domain or use the sandbox domain for testing
3. Get your API key from the Mailgun dashboard

## Configuration

Update `appsettings.json` or use environment variables with the following settings:

```json
{
  "Email": {
    "Mailgun": {
      "ApiKey": "your-mailgun-api-key",
      "Domain": "your-domain.com",
      "BaseUrl": "https://api.mailgun.net/v3"
    }
  }
}
```

### Mailgun Regions

- **US Region**: `https://api.mailgun.net/v3` (default)
- **EU Region**: `https://api.eu.mailgun.net/v3`

If your Mailgun account is in the EU region, update the `BaseUrl` accordingly.

### Environment Variables

For production, use environment variables instead of storing credentials in `appsettings.json`:

```bash
Email__Mailgun__ApiKey=your-api-key
Email__Mailgun__Domain=your-domain.com
Email__Mailgun__BaseUrl=https://api.mailgun.net/v3
```

## Testing

1. For development/testing, you can use Mailgun's sandbox domain
2. If Mailgun is not configured, the service will log email content instead of sending
3. Check application logs to verify email sending

## Sandbox Domain

When using Mailgun's sandbox domain:
- Domain: `sandbox{random}.mailgun.org`
- You can only send emails to authorized recipients (add them in Mailgun dashboard)
- Perfect for development and testing

## Production Considerations

1. **Domain Verification**: Verify your domain in Mailgun dashboard
2. **SPF/DKIM Records**: Add DNS records as instructed by Mailgun
3. **Rate Limits**: Be aware of Mailgun rate limits based on your plan
4. **Error Handling**: The service logs errors but continues operation. Consider implementing retry logic or a queue for production.

## Email Templates

The service sends HTML emails with:
- Email verification emails (for new user registration)
- Password reset emails (for password recovery)

Both include plain text fallbacks for email clients that don't support HTML.

