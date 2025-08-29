# CI/CD Test Database Setup Guide

## Overview

The CI/CD pipeline has been updated to use a separate test database instead of the production database. This ensures data isolation, safety, and better test reliability.

## Required GitHub Secrets

You need to add the following secrets to your GitHub repository:

### 1. Test Database URL
- **Secret Name**: `TEST_DATABASE_URL`
- **Value**: A separate PostgreSQL database URL for testing
- **Format**: `postgresql://username:password@host:port/database?sslmode=require`

### 2. Existing Secrets (Already Configured)
The following secrets should already be configured in your repository:
- `DATABASE_URL` (production database)
- `NEXTAUTH_SECRET`
- `JWT_SECRET`
- `STRIPE_SECRET_KEY`
- `PUSHER_APP_ID`
- `THESMSWORKS_KEY`
- `THESMSWORKS_SECRET`
- `OPENAI_API_KEY`
- `NEXT_PUBLIC_MAPBOX_TOKEN`
- `NEXT_PUBLIC_API_URL`
- `NEXT_PUBLIC_PUSHER_KEY`
- `NEXT_PUBLIC_PUSHER_CLUSTER`

## Setting Up the Test Database

### Option 1: Neon Database (Recommended)
1. Create a new Neon database for testing
2. Use the same connection string format as production
3. Example: `postgresql://test_user:test_password@test-host.neon.tech/testdb?sslmode=require`

### Option 2: Local PostgreSQL (Development Only)
1. Create a local PostgreSQL database for testing
2. Use connection string: `postgresql://test:test@localhost:5432/speedy_van_test`

### Option 3: Use Production Database (Not Recommended)
If you must use the production database temporarily:
- Set `TEST_DATABASE_URL` to the same value as `DATABASE_URL`
- **Warning**: This may cause test data to interfere with production

## Adding GitHub Secrets

1. Go to your GitHub repository
2. Navigate to **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Add each secret with the exact names listed above

## Database Schema Setup

The test database should have the same schema as production. The CI/CD pipeline will automatically:
1. Generate Prisma client
2. Run type checking
3. Execute tests with the test database

## Environment Variables in CI/CD

The updated workflow now includes these environment variables for all test jobs:

```yaml
env:
  DATABASE_URL: ${{ secrets.TEST_DATABASE_URL }}
  NEXTAUTH_SECRET: ${{ secrets.NEXTAUTH_SECRET }}
  NEXTAUTH_URL: http://localhost:3000
  JWT_SECRET: ${{ secrets.JWT_SECRET }}
  NODE_ENV: test
  # Additional variables for E2E tests
  STRIPE_SECRET_KEY: ${{ secrets.STRIPE_SECRET_KEY }}
  PUSHER_APP_ID: ${{ secrets.PUSHER_APP_ID }}
  # ... other required secrets
```

## Testing the Setup

1. Push the updated workflow to trigger a CI/CD run
2. Monitor the GitHub Actions tab
3. Check that all jobs pass:
   - Security scan
   - Code quality checks
   - Unit tests
   - E2E tests
   - Build verification

## Troubleshooting

### Common Issues

1. **Missing TEST_DATABASE_URL secret**
   - Error: "DATABASE_URL is not defined"
   - Solution: Add the TEST_DATABASE_URL secret to GitHub

2. **Database connection failures**
   - Check the connection string format
   - Ensure the database is accessible from GitHub Actions
   - Verify SSL settings

3. **Schema mismatches**
   - Ensure the test database has the latest schema
   - Run migrations if needed

### Security Considerations

- Never commit database credentials to the repository
- Use environment-specific secrets
- Regularly rotate database passwords
- Monitor database access logs

## Next Steps

1. Set up the test database
2. Add the TEST_DATABASE_URL secret to GitHub
3. Push the updated workflow
4. Monitor the CI/CD pipeline
5. Verify all tests pass

## Support

If you encounter issues:
1. Check the GitHub Actions logs for specific error messages
2. Verify all required secrets are configured
3. Test database connectivity manually
4. Review the Prisma schema and migrations
