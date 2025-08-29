# Automated SMS Notification System

This system provides automated SMS notifications using The SMS Works API for the Speedy Van application.

## Overview

The system consists of four main components:
1. **`smsworks.ts`** - Core SMS functionality (JWT generation, phone normalization, API calls)
2. **`sms-templates.ts`** - Predefined message templates for various business events
3. **`auto-sms.ts`** - High-level automation that combines templates with SMS sending
4. **`otp.ts`** - OTP generation, verification, and rate limiting

## Environment Variables

Add these to your `.env.local` file:

```bash
# The SMS Works API credentials
SMSWORKS_KEY=your_api_key_here
SMSWORKS_SECRET=your_api_secret_here

# SMS Configuration
SMS_ENABLED=true
SMS_SENDER=SpeedyVan

# OTP Configuration
OTP_TTL_MIN=10
OTP_COOLDOWN_SECONDS=60
OTP_MAX_ATTEMPTS=5
OTP_HOURLY_LIMIT=5
```

**Important**: Do not store JWT tokens in environment variables. The system generates them dynamically with 12-hour expiration.

**Important**: Do not store JWT tokens in environment variables. The system generates them dynamically with 12-hour expiration.

## Quick Start

### Basic Usage

```typescript
import { sendAutoSMS } from '@/lib/auto-sms';

// Send a booking confirmation
await sendAutoSMS({
  type: "BOOKING_CONFIRMED",
  to: "07901846297",
  data: {
    ref: "SV-2024-001",
    date: "15th January 2024",
    time: "2:30 PM"
  }
});
```

### Available Templates

| Template | Purpose | Required Data |
|----------|---------|---------------|
| `BOOKING_CREATED` | New booking received | `name`, `ref` |
| `BOOKING_CONFIRMED` | Booking confirmed | `ref`, `date`, `time` |
| `DRIVER_EN_ROUTE` | Driver heading to pickup | `ref`, `eta`, `track` |
| `DELIVERY_COMPLETED` | Delivery finished | `ref`, `invoice` |
| `PAYMENT_REMINDER` | Payment due reminder | `ref`, `payUrl` |
| `OTP` | Verification code | `code` |

## Phone Number Handling

The system automatically normalizes UK phone numbers:

- `+447901846297` → `447901846297`
- `07901846297` → `447901846297`
- `447901846297` → `447901846297` (unchanged)

## Examples

### OTP Verification
```typescript
await sendAutoSMS({
  type: "OTP",
  to: "07901846297",
  data: { code: "123456" }
});
```

### Driver En Route
```typescript
await sendAutoSMS({
  type: "DRIVER_EN_ROUTE",
  to: "+447901846297",
  data: {
    ref: "SV-2024-001",
    eta: "2:30 PM",
    track: "https://speedy-van.co.uk/track"
  }
});
```

### Payment Reminder
```typescript
await sendAutoSMS({
  type: "PAYMENT_REMINDER",
  to: "447901846297",
  data: {
    ref: "SV-2024-001",
    payUrl: "https://speedy-van.co.uk/pay"
  }
});
```

## API Endpoints

### SMS Testing
- **`/api/test-sms`** - Test SMS functionality with booking confirmation template

### OTP Authentication
- **`/api/auth/send-otp`** - Send 6-digit verification code via SMS
  - POST body: `{ "phone": "07901846297", "purpose": "login" }`
  - Returns: `{ "ok": true, "phone": "079****297", "expiresIn": "10 minutes" }`
  - Rate limited: 60s cooldown, 5/hour max

- **`/api/auth/verify-otp`** - Verify 6-digit code
  - POST body: `{ "phone": "07901846297", "purpose": "login", "code": "123456" }`
  - Returns: `{ "ok": true, "message": "OTP verified successfully" }`
  - Locked after 5 failed attempts

### Delivery Reports
- **`/api/sms/dlr`** - Webhook endpoint for SMS delivery status updates from The SMS Works
  - Receives: `{ messageid, status, statuscode, deliveredts, errorcode, errormessage }`
  - Always returns: `{ ok: true }` to acknowledge receipt

## Testing

### Unit Tests
```bash
pnpm test:unit
```

### API Testing
Test the system using the `/api/test-sms` endpoint:

```bash
# PowerShell
Invoke-RestMethod -Uri "http://localhost:3000/api/test-sms" -Method POST -ContentType "application/json" -Body "{}"

# cURL (if available)
curl -X POST http://localhost:3000/api/test-sms \
  -H "Content-Type: application/json" \
  -d '{}'
```

## Error Handling

The system includes comprehensive error handling:

- **Missing credentials**: Throws error if `SMSWORKS_KEY` or `SMSWORKS_SECRET` not configured
- **Invalid templates**: Throws error for unknown template names
- **API failures**: Logs errors and re-throws for upstream handling
- **Phone normalization**: Handles various input formats gracefully

## Security Features

- **Dynamic JWT generation**: Tokens expire after 12 hours
- **No credential storage**: API keys never logged or exposed
- **Input validation**: Template data is validated before rendering
- **Error logging**: Failed attempts are logged for monitoring

## Integration Points

### Booking System
```typescript
// When a new booking is created
await sendAutoSMS({
  type: "BOOKING_CREATED",
  to: customer.phone,
  data: { name: customer.name, ref: booking.reference }
});
```

### Driver Portal
```typescript
// When driver starts journey
await sendAutoSMS({
  type: "DRIVER_EN_ROUTE",
  to: customer.phone,
  data: {
    ref: booking.reference,
    eta: booking.estimatedArrival,
    track: `${process.env.NEXT_PUBLIC_BASE_URL}/track`
  }
});
```

### Payment System
```typescript
// When payment is due
await sendAutoSMS({
  type: "PAYMENT_REMINDER",
  to: customer.phone,
  data: {
    ref: booking.reference,
    payUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/pay/${booking.id}`
  }
});
```

## Monitoring

Check the console logs for:
- JWT generation success/failure
- SMS API responses
- Phone number normalization
- Template rendering errors

## Troubleshooting

### Common Issues

1. **401 Unauthorized**: Check `SMSWORKS_KEY` and `SMSWORKS_SECRET`
2. **Template not found**: Verify template name spelling
3. **Phone number issues**: Check input format and normalization
4. **JWT errors**: Ensure environment variables are set correctly
5. **SMS disabled**: Check `SMS_ENABLED` environment variable
6. **Webhook failures**: Verify `/api/sms/dlr` endpoint is accessible and returns 200

### Debug Mode

Enable detailed logging by setting:
```bash
LOG_LEVEL=debug
```

### Toggle SMS Functionality

To disable SMS notifications (useful for development/testing):
```bash
SMS_ENABLED=false
```

To change the sender name:
```bash
SMS_SENDER=YourCompanyName
```

## Performance Considerations

- JWT tokens are generated per request (lightweight operation)
- Phone normalization is synchronous and fast
- Template rendering is string interpolation only
- API calls are async with proper error handling

## Operational Runbook

### Rate Limiting and Security

#### OTP Rate Limits
- **Cooldown**: 60 seconds between OTP requests for same phone/purpose
- **Hourly Limit**: Maximum 5 OTP codes per phone/purpose per hour
- **Max Attempts**: 5 verification attempts before OTP is locked
- **TTL**: OTP codes expire after 10 minutes (configurable)

#### Security Features
- **Code Hashing**: OTP codes are hashed using SHA-256 before storage
- **Timing-Safe Comparison**: Prevents timing attacks during verification
- **Phone Masking**: Phone numbers are masked in logs and responses
- **Attempt Tracking**: Failed verification attempts are logged and limited

### Error Handling

#### 4xx Errors (Client Errors)
- **400 Bad Request**: Missing required fields, invalid phone format
- **429 Too Many Requests**: Rate limit exceeded, cooldown active
- **401 Unauthorized**: Invalid API credentials (check SMSWORKS_KEY/SECRET)

#### 5xx Errors (Server Errors)
- **500 Internal Server Error**: Database connection issues, SMS API failures
- **503 Service Unavailable**: SMS service temporarily unavailable

### Monitoring and Maintenance

#### Database Cleanup
```bash
# Clean up expired OTP codes (run daily)
# This can be automated with a cron job or scheduled task
```

#### SMS Delivery Monitoring
- Check `/api/sms/dlr` endpoint logs for delivery status
- Monitor failed deliveries in `SmsDlr` table
- Set up alerts for high failure rates

#### OTP Statistics
```typescript
import { getOtpStats } from '@/lib/otp';

// Get OTP usage statistics for monitoring
const stats = await getOtpStats('07901846297', 'login');
console.log('OTP Stats:', stats);
```

### Troubleshooting

#### Common Issues

1. **OTP Not Sending**
   - Check `SMS_ENABLED` environment variable
   - Verify `SMSWORKS_KEY` and `SMSWORKS_SECRET`
   - Check rate limiting (cooldown/hourly limits)
   - Review server logs for SMS API errors

2. **OTP Verification Failing**
   - Check if OTP has expired (10-minute TTL)
   - Verify phone number format and normalization
   - Check if OTP is locked (5 failed attempts)
   - Ensure purpose matches between send and verify

3. **High SMS Failure Rate**
   - Check The SMS Works API status
   - Verify webhook URL configuration (`/api/sms/dlr`)
   - Review DLR payloads for error codes
   - Check SMSWORKS account balance and limits

4. **Database Connection Issues**
   - Verify `DATABASE_URL` environment variable
   - Check database connectivity and permissions
   - Run Prisma migrations: `pnpm prisma migrate dev`
   - Verify Prisma client generation: `pnpm prisma generate`

#### Environment Variable Checklist

```bash
# Required for SMS functionality
SMSWORKS_KEY=your_api_key
SMSWORKS_SECRET=your_api_secret
SMS_ENABLED=true
SMS_SENDER=SpeedyVan

# Required for OTP functionality
OTP_TTL_MIN=10
OTP_COOLDOWN_SECONDS=60
OTP_MAX_ATTEMPTS=5
OTP_HOURLY_LIMIT=5

# Database connection
DATABASE_URL=postgresql://...
```

### Production Deployment

#### Render Environment Variables
1. Add all required environment variables in Render dashboard
2. Ensure `SMS_ENABLED=true` for production
3. Set appropriate OTP limits for your use case
4. Configure webhook URL for DLR: `https://your-domain.com/api/sms/dlr`

#### Database Migrations
```bash
# Run migrations in production
pnpm prisma migrate deploy

# Verify schema
pnpm prisma db pull
```

#### Health Checks
- Monitor `/api/test-sms` endpoint for SMS functionality
- Check `/api/health` for overall system health
- Set up uptime monitoring for critical endpoints

## Future Enhancements

- Template versioning and A/B testing
- Delivery status webhooks
- Rate limiting and queuing
- Multi-language support
- Template analytics and optimization
- OTP analytics dashboard
- Advanced rate limiting strategies
- Multi-factor authentication integration
