# SMS Environment Variables Template

Copy these variables to your `.env.local` file:

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

## Important Notes

- **Do not store JWT tokens** in environment variables
- The system generates JWT tokens dynamically with 12-hour expiration
- Set `SMS_ENABLED=false` to disable SMS functionality during development
- Change `SMS_SENDER` to customize the sender name in SMS messages

## Render Environment Variables

For production deployment on Render, add these environment variables:

```bash
SMSWORKS_KEY=your_production_api_key
SMSWORKS_SECRET=your_production_api_secret
SMS_ENABLED=true
SMS_SENDER=SpeedyVan

# OTP Configuration
OTP_TTL_MIN=10
OTP_COOLDOWN_SECONDS=60
OTP_MAX_ATTEMPTS=5
OTP_HOURLY_LIMIT=5
```
