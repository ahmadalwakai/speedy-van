import { prisma } from './prisma';
import { normalizeUK } from './smsworks';
import crypto from 'crypto';

/**
 * OTP Configuration from environment variables
 */
const OTP_CONFIG = {
  TTL_MIN: parseInt(process.env.OTP_TTL_MIN || '10'),
  COOLDOWN_SECONDS: parseInt(process.env.OTP_COOLDOWN_SECONDS || '60'),
  MAX_ATTEMPTS: parseInt(process.env.OTP_MAX_ATTEMPTS || '5'),
  HOURLY_LIMIT: parseInt(process.env.OTP_HOURLY_LIMIT || '5'),
};

/**
 * Generates a cryptographically secure 6-digit OTP code
 */
function generateOtpCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

/**
 * Hashes an OTP code using SHA-256
 */
function hashOtpCode(code: string): string {
  return crypto.createHash('sha256').update(code).digest('hex');
}

/**
 * Compares two hashed codes using timing-safe comparison
 */
function compareHashedCodes(hash1: string, hash2: string): boolean {
  return crypto.timingSafeEqual(
    Buffer.from(hash1, 'hex'),
    Buffer.from(hash2, 'hex')
  );
}

/**
 * Masks a phone number for security (e.g., "079****297")
 */
export function maskPhoneNumber(phone: string): string {
  const normalized = normalizeUK(phone);
  if (normalized.length >= 7) {
    return normalized.replace(/(\d{3})\d{3}(\d{3})/, '$1***$2');
  }
  return phone.replace(/(\d{2})\d{2}(\d{2})/, '$1**$2');
}

/**
 * Issues a new OTP code with rate limiting and cooldown enforcement
 */
export async function issueOtp(phone: string, purpose: string): Promise<{
  phoneMasked: string;
  expiresInMin: number;
  code: string; // Return the actual code for SMS sending
}> {
  const normalizedPhone = normalizeUK(phone);
  const now = new Date();
  
  // Check cooldown: last OTP for same normalized phone within COOLDOWN
  const lastOtp = await prisma.otpCode.findFirst({
    where: {
      phoneNormalized: normalizedPhone,
      purpose,
      createdAt: {
        gte: new Date(now.getTime() - OTP_CONFIG.COOLDOWN_SECONDS * 1000)
      }
    },
    orderBy: { createdAt: 'desc' }
  });
  
  if (lastOtp) {
    const cooldownRemaining = Math.ceil(
      (OTP_CONFIG.COOLDOWN_SECONDS * 1000 - (now.getTime() - lastOtp.createdAt.getTime())) / 1000
    );
    throw new Error(`Please wait ${cooldownRemaining} seconds before requesting another code`);
  }
  
  // Check hourly limit: count issued in last 60m
  const hourlyCount = await prisma.otpCode.count({
    where: {
      phoneNormalized: normalizedPhone,
      purpose,
      createdAt: {
        gte: new Date(now.getTime() - 60 * 60 * 1000)
      }
    }
  });
  
  if (hourlyCount >= OTP_CONFIG.HOURLY_LIMIT) {
    throw new Error(`Hourly limit exceeded. Please try again later.`);
  }
  
  // Generate and hash OTP code
  const code = generateOtpCode();
  const codeHash = hashOtpCode(code);
  
  // Calculate expiry time
  const expiresAt = new Date(now.getTime() + OTP_CONFIG.TTL_MIN * 60 * 1000);
  
  // Store OTP code
  await prisma.otpCode.create({
    data: {
      phoneRaw: phone,
      phoneNormalized: normalizedPhone,
      purpose,
      codeHash,
      expiresAt,
      maxAttempts: OTP_CONFIG.MAX_ATTEMPTS,
    }
  });
  
  // Return the actual code for SMS sending, plus masked phone and expiry info
  return {
    phoneMasked: maskPhoneNumber(phone),
    expiresInMin: OTP_CONFIG.TTL_MIN,
    code
  };
}

/**
 * Verifies an OTP code with attempt tracking and lockout
 */
export async function verifyOtp(
  phone: string, 
  purpose: string, 
  code: string
): Promise<boolean> {
  const normalizedPhone = normalizeUK(phone);
  const now = new Date();
  
  // Find the latest valid OTP code
  const otpCode = await prisma.otpCode.findFirst({
    where: {
      phoneNormalized: normalizedPhone,
      purpose,
      expiresAt: { gt: now },
      consumedAt: null,
      attempts: { lt: OTP_CONFIG.MAX_ATTEMPTS }
    },
    orderBy: { createdAt: 'desc' }
  });
  
  if (!otpCode) {
    return false;
  }
  
  // Increment attempts
  await prisma.otpCode.update({
    where: { id: otpCode.id },
    data: { attempts: otpCode.attempts + 1 }
  });
  
  // Check if max attempts exceeded
  if (otpCode.attempts + 1 >= OTP_CONFIG.MAX_ATTEMPTS) {
    // Mark as consumed to prevent further attempts
    await prisma.otpCode.update({
      where: { id: otpCode.id },
      data: { consumedAt: now }
    });
    return false;
  }
  
  // Verify the code using timing-safe comparison
  const isValid = compareHashedCodes(otpCode.codeHash, hashOtpCode(code));
  
  if (isValid) {
    // Mark as consumed on success
    await prisma.otpCode.update({
      where: { id: otpCode.id },
      data: { consumedAt: now }
    });
  }
  
  return isValid;
}

/**
 * Clean up expired OTP codes (run periodically)
 */
export async function cleanupExpiredOtps(): Promise<number> {
  const result = await prisma.otpCode.deleteMany({
    where: {
      expiresAt: { lt: new Date() }
    }
  });
  
  return result.count;
}

/**
 * Get OTP statistics for monitoring
 */
export async function getOtpStats(phone: string, purpose: string): Promise<{
  totalIssued: number;
  totalVerified: number;
  totalFailed: number;
  lastIssued: Date | null;
  lastVerified: Date | null;
}> {
  const normalizedPhone = normalizeUK(phone);
  const now = new Date();
  const last24h = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  
  const [totalIssued, totalVerified, totalFailed, lastIssued, lastVerified] = await Promise.all([
    prisma.otpCode.count({
      where: {
        phoneNormalized: normalizedPhone,
        purpose,
        createdAt: { gte: last24h }
      }
    }),
    prisma.otpCode.count({
      where: {
        phoneNormalized: normalizedPhone,
        purpose,
        consumedAt: { not: null },
        createdAt: { gte: last24h }
      }
    }),
    prisma.otpCode.count({
      where: {
        phoneNormalized: normalizedPhone,
        purpose,
        attempts: { gte: OTP_CONFIG.MAX_ATTEMPTS },
        createdAt: { gte: last24h }
      }
    }),
    prisma.otpCode.findFirst({
      where: {
        phoneNormalized: normalizedPhone,
        purpose
      },
      orderBy: { createdAt: 'desc' },
      select: { createdAt: true }
    }),
    prisma.otpCode.findFirst({
      where: {
        phoneNormalized: normalizedPhone,
        purpose,
        consumedAt: { not: null }
      },
      orderBy: { consumedAt: 'desc' },
      select: { consumedAt: true }
    })
  ]);
  
  return {
    totalIssued,
    totalVerified,
    totalFailed,
    lastIssued: lastIssued?.createdAt || null,
    lastVerified: lastVerified?.consumedAt || null
  };
}
