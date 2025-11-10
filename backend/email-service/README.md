# Email Service

A microservice responsible for sending emails using Mailgun.

## Features

- Email verification emails
- Password reset emails
- HTML email templates with plain text fallbacks
- Mailgun integration
- Graceful fallback to logging when Mailgun is not configured

## API Endpoints

### POST /api/email/send-verification

Sends an email verification email.

**Request Body:**
```json
{
  "email": "user@example.com",
  "username": "johndoe",
  "verificationToken": "token123",
  "verificationUrl": "http://localhost:3000/verify-email"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Verification email sent successfully"
}
```

### POST /api/email/send-password-reset

Sends a password reset email.

**Request Body:**
```json
{
  "email": "user@example.com",
  "username": "johndoe",
  "resetToken": "token123",
  "resetUrl": "http://localhost:3000/reset-password"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Password reset email sent successfully"
}
```

### GET /api/email/health

Health check endpoint.

## Configuration

See [MAILGUN_SETUP.md](./MAILGUN_SETUP.md) for Mailgun configuration instructions.

## Environment Variables

- `PORT` - Service port (default: 5004)
- `Email__Mailgun__ApiKey` - Mailgun API key
- `Email__Mailgun__Domain` - Mailgun domain
- `Email__Mailgun__BaseUrl` - Mailgun API base URL (default: https://api.mailgun.net/v3)
- `Email__FromAddress` - From email address
- `Email__FromName` - From name

## Running Locally

```bash
dotnet run
```

The service will start on port 5004 by default.

## Docker

```bash
docker build -t email-service .
docker run -p 5004:5004 email-service
```

## Integration

This service is called by the `auth-service` via HTTP. The auth-service uses the `EmailApiClient` to send requests to this service.

