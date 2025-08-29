import { issueOtp, verifyOtp, maskPhoneNumber, cleanupExpiredOtps, getOtpStats } from '../otp';
import { normalizeUK } from '../smsworks';

// Mock Prisma client
jest.mock('../prisma', () => ({
  prisma: {
    otpCode: {
      findFirst: jest.fn(),
      count: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      deleteMany: jest.fn(),
    },
  },
}));

const mockPrisma = require('../prisma').prisma;

describe('OTP System', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset environment variables
    delete process.env.OTP_TTL_MIN;
    delete process.env.OTP_COOLDOWN_SECONDS;
    delete process.env.OTP_MAX_ATTEMPTS;
    delete process.env.OTP_HOURLY_LIMIT;
  });

  describe('Phone Number Masking', () => {
    test('masks UK phone numbers correctly', () => {
      expect(maskPhoneNumber('07901846297')).toBe('079***297');
      expect(maskPhoneNumber('447901846297')).toBe('447***297');
      expect(maskPhoneNumber('0790123456')).toBe('079**456');
    });

    test('handles short numbers gracefully', () => {
      expect(maskPhoneNumber('12345')).toBe('12**5');
      expect(maskPhoneNumber('12')).toBe('12');
    });
  });

  describe('OTP Issuance', () => {
    test('issues OTP successfully with default settings', async () => {
      mockPrisma.findFirst.mockResolvedValue(null); // No cooldown
      mockPrisma.count.mockResolvedValue(0); // No hourly limit
      mockPrisma.create.mockResolvedValue({ id: 'test-id' });

      const result = await issueOtp('07901846297', 'login');

      expect(result.phoneMasked).toBe('079***297');
      expect(result.expiresInMin).toBe(10);
      expect(result.code).toMatch(/^\d{6}$/);
      expect(mockPrisma.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          phoneRaw: '07901846297',
          phoneNormalized: '447901846297',
          purpose: 'login',
          maxAttempts: 5,
        })
      });
    });

    test('enforces cooldown period', async () => {
      const now = new Date();
      mockPrisma.findFirst.mockResolvedValue({
        createdAt: new Date(now.getTime() - 30 * 1000) // 30 seconds ago
      });

      await expect(issueOtp('07901846297', 'login'))
        .rejects.toThrow('Please wait 30 seconds before requesting another code');
    });

    test('enforces hourly limit', async () => {
      mockPrisma.findFirst.mockResolvedValue(null); // No cooldown
      mockPrisma.count.mockResolvedValue(5); // Already at limit

      await expect(issueOtp('07901846297', 'login'))
        .rejects.toThrow('Hourly limit exceeded');
    });

    test('respects custom environment variables', async () => {
      process.env.OTP_TTL_MIN = '15';
      process.env.OTP_COOLDOWN_SECONDS = '120';
      process.env.OTP_MAX_ATTEMPTS = '3';
      process.env.OTP_HOURLY_LIMIT = '10';

      mockPrisma.findFirst.mockResolvedValue(null);
      mockPrisma.count.mockResolvedValue(0);
      mockPrisma.create.mockResolvedValue({ id: 'test-id' });

      const result = await issueOtp('07901846297', 'login');

      expect(result.expiresInMin).toBe(15);
      expect(mockPrisma.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          maxAttempts: 3,
        })
      });
    });
  });

  describe('OTP Verification', () => {
    test('verifies valid OTP successfully', async () => {
      const mockOtpCode = {
        id: 'test-id',
        attempts: 0,
        maxAttempts: 5,
        codeHash: 'valid-hash',
      };

      mockPrisma.findFirst.mockResolvedValue(mockOtpCode);
      mockPrisma.update.mockResolvedValue({});

      const result = await verifyOtp('07901846297', 'login', '123456');

      expect(result).toBe(true);
      expect(mockPrisma.update).toHaveBeenCalledWith({
        where: { id: 'test-id' },
        data: { attempts: 1 }
      });
    });

    test('rejects expired OTP', async () => {
      mockPrisma.findFirst.mockResolvedValue(null);

      const result = await verifyOtp('07901846297', 'login', '123456');

      expect(result).toBe(false);
    });

    test('rejects consumed OTP', async () => {
      const mockOtpCode = {
        id: 'test-id',
        attempts: 0,
        maxAttempts: 5,
        codeHash: 'valid-hash',
        consumedAt: new Date(), // Already consumed
      };

      mockPrisma.findFirst.mockResolvedValue(mockOtpCode);

      const result = await verifyOtp('07901846297', 'login', '123456');

      expect(result).toBe(false);
    });

    test('locks OTP after max attempts', async () => {
      const mockOtpCode = {
        id: 'test-id',
        attempts: 4, // One attempt away from max
        maxAttempts: 5,
        codeHash: 'valid-hash',
      };

      mockPrisma.findFirst.mockResolvedValue(mockOtpCode);
      mockPrisma.update.mockResolvedValue({});

      const result = await verifyOtp('07901846297', 'login', '123456');

      expect(result).toBe(false);
      expect(mockPrisma.update).toHaveBeenCalledWith({
        where: { id: 'test-id' },
        data: { consumedAt: expect.any(Date) }
      });
    });

    test('increments attempts on each verification', async () => {
      const mockOtpCode = {
        id: 'test-id',
        attempts: 1,
        maxAttempts: 5,
        codeHash: 'valid-hash',
      };

      mockPrisma.findFirst.mockResolvedValue(mockOtpCode);
      mockPrisma.update.mockResolvedValue({});

      await verifyOtp('07901846297', 'login', '123456');

      expect(mockPrisma.update).toHaveBeenCalledWith({
        where: { id: 'test-id' },
        data: { attempts: 2 }
      });
    });
  });

  describe('Cleanup and Statistics', () => {
    test('cleanupExpiredOtps removes expired codes', async () => {
      mockPrisma.deleteMany.mockResolvedValue({ count: 5 });

      const result = await cleanupExpiredOtps();

      expect(result).toBe(5);
      expect(mockPrisma.deleteMany).toHaveBeenCalledWith({
        where: {
          expiresAt: { lt: expect.any(Date) }
        }
      });
    });

    test('getOtpStats returns correct statistics', async () => {
      const now = new Date();
      const last24h = new Date(now.getTime() - 24 * 60 * 60 * 1000);

      mockPrisma.count
        .mockResolvedValueOnce(10) // totalIssued
        .mockResolvedValueOnce(7)  // totalVerified
        .mockResolvedValueOnce(2); // totalFailed

      mockPrisma.findFirst
        .mockResolvedValueOnce({ createdAt: new Date('2024-01-01') }) // lastIssued
        .mockResolvedValueOnce({ consumedAt: new Date('2024-01-02') }); // lastVerified

      const stats = await getOtpStats('07901846297', 'login');

      expect(stats.totalIssued).toBe(10);
      expect(stats.totalVerified).toBe(7);
      expect(stats.totalFailed).toBe(2);
      expect(stats.lastIssued).toEqual(new Date('2024-01-01'));
      expect(stats.lastVerified).toEqual(new Date('2024-01-02'));
    });
  });

  describe('Phone Number Normalization', () => {
    test('normalizes UK phone numbers correctly', () => {
      expect(normalizeUK('07901846297')).toBe('447901846297');
      expect(normalizeUK('+447901846297')).toBe('447901846297');
      expect(normalizeUK('447901846297')).toBe('447901846297');
      expect(normalizeUK('0790 184 6297')).toBe('447901846297');
    });
  });
});
