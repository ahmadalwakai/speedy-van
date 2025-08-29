import { describe, it, expect, beforeEach, jest, afterEach } from '@jest/globals';
import bcrypt from 'bcryptjs';
import { PrismaClient, User, Role, AdminRole } from '@prisma/client';
import UserService, { 
  CreateUserSchema, 
  UpdateUserSchema, 
  ChangePasswordSchema, 
  LoginSchema,
  CreateUserInput,
  UpdateUserInput,
  ChangePasswordInput,
  LoginInput
} from '../userService';
import { UserFactory } from '@/lib/testing/factories';

// Mock Prisma
jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn(),
}));

// Mock bcrypt
jest.mock('bcryptjs');

const mockPrisma = {
  user: {
    create: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
  },
};

(PrismaClient as jest.MockedClass<typeof PrismaClient>).mockImplementation(() => mockPrisma as any);

describe('UserService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword123');
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);
    (bcrypt.genSalt as jest.Mock).mockResolvedValue('salt123');
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('Validation Schemas', () => {
    describe('CreateUserSchema', () => {
      it('should validate valid user data', () => {
        const validData: CreateUserInput = {
          email: 'test@example.com',
          password: 'SecurePass123!',
          name: 'John Doe',
          role: Role.customer,
        };

        const result = CreateUserSchema.safeParse(validData);
        expect(result.success).toBe(true);
      });

      it('should reject invalid email', () => {
        const invalidData = {
          email: 'invalid-email',
          password: 'SecurePass123!',
        };

        const result = CreateUserSchema.safeParse(invalidData);
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.issues.some(issue => issue.path.includes('email'))).toBe(true);
        }
      });

      it('should reject weak password', () => {
        const invalidData = {
          email: 'test@example.com',
          password: 'weak',
        };

        const result = CreateUserSchema.safeParse(invalidData);
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.issues.some(issue => issue.path.includes('password'))).toBe(true);
        }
      });

      it('should accept password with all required character types', () => {
        const validData = {
          email: 'test@example.com',
          password: 'SecurePass123!',
        };

        const result = CreateUserSchema.safeParse(validData);
        expect(result.success).toBe(true);
      });
    });

    describe('LoginSchema', () => {
      it('should validate valid login data', () => {
        const validData: LoginInput = {
          email: 'test@example.com',
          password: 'password123',
        };

        const result = LoginSchema.safeParse(validData);
        expect(result.success).toBe(true);
      });

      it('should reject empty password', () => {
        const invalidData = {
          email: 'test@example.com',
          password: '',
        };

        const result = LoginSchema.safeParse(invalidData);
        expect(result.success).toBe(false);
      });
    });

    describe('ChangePasswordSchema', () => {
      it('should validate valid password change data', () => {
        const validData: ChangePasswordInput = {
          currentPassword: 'OldPass123!',
          newPassword: 'NewPass456!',
        };

        const result = ChangePasswordSchema.safeParse(validData);
        expect(result.success).toBe(true);
      });

      it('should reject weak new password', () => {
        const invalidData = {
          currentPassword: 'OldPass123!',
          newPassword: 'weak',
        };

        const result = ChangePasswordSchema.safeParse(invalidData);
        expect(result.success).toBe(false);
      });
    });
  });

  describe('createUser', () => {
    it('should create a user with hashed password', async () => {
      const userData: CreateUserInput = {
        email: 'test@example.com',
        password: 'SecurePass123!',
        name: 'John Doe',
        role: Role.customer,
      };

      const mockUser: User = {
        id: 'user123',
        email: userData.email,
        name: userData.name,
        role: userData.role,
        password: 'hashedPassword123',
        createdAt: new Date(),
        backupCodes: [],
        backupCodesGenerated: false,
        twoFactorSecret: null,
        resetToken: null,
        resetTokenExpiry: null,
        emailVerificationExpiry: null,
        emailVerificationToken: null,
        emailVerified: false,
        isActive: true,
        lastLogin: null,
        twoFactorEnabled: false,
      };

      mockPrisma.user.findUnique.mockResolvedValue(null);
      mockPrisma.user.create.mockResolvedValue(mockUser);

      const result = await UserService.createUser(userData);

      expect(bcrypt.hash).toHaveBeenCalledWith('SecurePass123!', 12);
      expect(mockPrisma.user.create).toHaveBeenCalledWith({
        data: {
          ...userData,
          password: 'hashedPassword123',
        },
      });
      expect(result.password).toBeUndefined();
    });

    it('should throw error if user already exists', async () => {
      const userData: CreateUserInput = {
        email: 'existing@example.com',
        password: 'SecurePass123!',
      };

      mockPrisma.user.findUnique.mockResolvedValue({ id: 'existing' } as User);

      await expect(UserService.createUser(userData)).rejects.toThrow(
        'User with this email already exists'
      );
    });

    it('should throw validation error for invalid data', async () => {
      const invalidData = {
        email: 'invalid-email',
        password: 'weak',
      };

      await expect(UserService.createUser(invalidData as any)).rejects.toThrow(
        'Validation error'
      );
    });
  });

  describe('authenticateUser', () => {
    it('should authenticate valid user credentials', async () => {
      const loginData: LoginInput = {
        email: 'test@example.com',
        password: 'SecurePass123!',
      };

      const mockUser: User = {
        id: 'user123',
        email: loginData.email,
        name: 'John Doe',
        role: Role.customer,
        password: 'hashedPassword123',
        createdAt: new Date(),
        backupCodes: [],
        backupCodesGenerated: false,
        twoFactorSecret: null,
        resetToken: null,
        resetTokenExpiry: null,
        emailVerificationExpiry: null,
        emailVerificationToken: null,
        emailVerified: false,
        isActive: true,
        lastLogin: null,
        twoFactorEnabled: false,
      };

      mockPrisma.user.findUnique.mockResolvedValue(mockUser);
      mockPrisma.user.update.mockResolvedValue(mockUser);

      const result = await UserService.authenticateUser(loginData);

      expect(bcrypt.compare).toHaveBeenCalledWith('SecurePass123!', 'hashedPassword123');
      expect(mockPrisma.user.update).toHaveBeenCalledWith({
        where: { id: 'user123' },
        data: { lastLogin: expect.any(Date) },
      });
      expect(result.isValid).toBe(true);
      expect(result.user.password).toBeUndefined();
    });

    it('should reject invalid credentials', async () => {
      const loginData: LoginInput = {
        email: 'test@example.com',
        password: 'WrongPass123!',
      };

      const mockUser: User = {
        id: 'user123',
        email: loginData.email,
        name: 'John Doe',
        role: Role.customer,
        password: 'hashedPassword123',
        createdAt: new Date(),
        backupCodes: [],
        backupCodesGenerated: false,
        twoFactorSecret: null,
        resetToken: null,
        resetTokenExpiry: null,
        emailVerificationExpiry: null,
        emailVerificationToken: null,
        emailVerified: false,
        isActive: true,
        lastLogin: null,
        twoFactorEnabled: false,
      };

      mockPrisma.user.findUnique.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      const result = await UserService.authenticateUser(loginData);

      expect(result.isValid).toBe(false);
      expect(result.user).toBeNull();
    });

    it('should reject deactivated account', async () => {
      const loginData: LoginInput = {
        email: 'test@example.com',
        password: 'SecurePass123!',
      };

      const mockUser: User = {
        id: 'user123',
        email: loginData.email,
        name: 'John Doe',
        role: Role.customer,
        password: 'hashedPassword123',
        createdAt: new Date(),
        backupCodes: [],
        backupCodesGenerated: false,
        twoFactorSecret: null,
        resetToken: null,
        resetTokenExpiry: null,
        emailVerificationExpiry: null,
        emailVerificationToken: null,
        emailVerified: false,
        isActive: false,
        lastLogin: null,
        twoFactorEnabled: false,
      };

      mockPrisma.user.findUnique.mockResolvedValue(mockUser);

      await expect(UserService.authenticateUser(loginData)).rejects.toThrow(
        'Account is deactivated'
      );
    });

    it('should return false for non-existent user', async () => {
      const loginData: LoginInput = {
        email: 'nonexistent@example.com',
        password: 'SecurePass123!',
      };

      mockPrisma.user.findUnique.mockResolvedValue(null);

      const result = await UserService.authenticateUser(loginData);

      expect(result.isValid).toBe(false);
      expect(result.user).toBeNull();
    });
  });

  describe('changePassword', () => {
    it('should change password successfully', async () => {
      const changeData: ChangePasswordInput = {
        currentPassword: 'OldPass123!',
        newPassword: 'NewPass456!',
      };

      const mockUser: User = {
        id: 'user123',
        email: 'test@example.com',
        name: 'John Doe',
        role: Role.customer,
        password: 'hashedPassword123',
        createdAt: new Date(),
        backupCodes: [],
        backupCodesGenerated: false,
        twoFactorSecret: null,
        resetToken: null,
        resetTokenExpiry: null,
        emailVerificationExpiry: null,
        emailVerificationToken: null,
        emailVerified: false,
        isActive: true,
        lastLogin: null,
        twoFactorEnabled: false,
      };

      mockPrisma.user.findUnique.mockResolvedValue(mockUser);
      mockPrisma.user.update.mockResolvedValue(mockUser);

      await UserService.changePassword('user123', changeData);

      expect(bcrypt.compare).toHaveBeenCalledWith('OldPass123!', 'hashedPassword123');
      expect(bcrypt.hash).toHaveBeenCalledWith('NewPass456!', 12);
      expect(mockPrisma.user.update).toHaveBeenCalledWith({
        where: { id: 'user123' },
        data: { password: 'hashedPassword123' },
      });
    });

    it('should reject incorrect current password', async () => {
      const changeData: ChangePasswordInput = {
        currentPassword: 'WrongPass123!',
        newPassword: 'NewPass456!',
      };

      const mockUser: User = {
        id: 'user123',
        email: 'test@example.com',
        name: 'John Doe',
        role: Role.customer,
        password: 'hashedPassword123',
        createdAt: new Date(),
        backupCodes: [],
        backupCodesGenerated: false,
        twoFactorSecret: null,
        resetToken: null,
        resetTokenExpiry: null,
        emailVerificationExpiry: null,
        emailVerificationToken: null,
        emailVerified: false,
        isActive: true,
        lastLogin: null,
        twoFactorEnabled: false,
      };

      mockPrisma.user.findUnique.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(UserService.changePassword('user123', changeData)).rejects.toThrow(
        'Current password is incorrect'
      );
    });

    it('should throw error for non-existent user', async () => {
      const changeData: ChangePasswordInput = {
        currentPassword: 'OldPass123!',
        newPassword: 'NewPass456!',
      };

      mockPrisma.user.findUnique.mockResolvedValue(null);

      await expect(UserService.changePassword('user123', changeData)).rejects.toThrow(
        'User not found'
      );
    });
  });

  describe('updateUser', () => {
    it('should update user successfully', async () => {
      const updateData: UpdateUserInput = {
        name: 'Jane Doe',
        role: Role.admin,
        adminRole: AdminRole.booking_manager,
      };

      const mockUser: User = {
        id: 'user123',
        email: 'test@example.com',
        name: 'Jane Doe',
        role: Role.admin,
        password: 'hashedPassword123',
        createdAt: new Date(),
        backupCodes: [],
        backupCodesGenerated: false,
        twoFactorSecret: null,
        resetToken: null,
        resetTokenExpiry: null,
        emailVerificationExpiry: null,
        emailVerificationToken: null,
        emailVerified: false,
        isActive: true,
        lastLogin: null,
        twoFactorEnabled: false,
      };

      mockPrisma.user.update.mockResolvedValue(mockUser);

      const result = await UserService.updateUser('user123', updateData);

      expect(mockPrisma.user.update).toHaveBeenCalledWith({
        where: { id: 'user123' },
        data: updateData,
      });
      expect(result.password).toBeUndefined();
      expect(result.name).toBe('Jane Doe');
      expect(result.role).toBe(Role.admin);
    });

    it('should throw validation error for invalid data', async () => {
      const invalidData = {
        email: 'invalid-email',
        name: 'A', // Too short
      };

      await expect(UserService.updateUser('user123', invalidData as any)).rejects.toThrow(
        'Validation error'
      );
    });
  });

  describe('getUserById', () => {
    it('should return user without password', async () => {
      const mockUser: User = {
        id: 'user123',
        email: 'test@example.com',
        name: 'John Doe',
        role: Role.customer,
        password: 'hashedPassword123',
        createdAt: new Date(),
        backupCodes: [],
        backupCodesGenerated: false,
        twoFactorSecret: null,
        resetToken: null,
        resetTokenExpiry: null,
        emailVerificationExpiry: null,
        emailVerificationToken: null,
        emailVerified: false,
        isActive: true,
        lastLogin: null,
        twoFactorEnabled: false,
      };

      mockPrisma.user.findUnique.mockResolvedValue(mockUser);

      const result = await UserService.getUserById('user123');

      expect(result?.password).toBeUndefined();
      expect(result?.email).toBe('test@example.com');
      expect(result?.name).toBe('John Doe');
    });

    it('should return null for non-existent user', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);

      const result = await UserService.getUserById('nonexistent');

      expect(result).toBeNull();
    });
  });

  describe('deactivateUser', () => {
    it('should deactivate user successfully', async () => {
      mockPrisma.user.update.mockResolvedValue({} as User);

      await UserService.deactivateUser('user123');

      expect(mockPrisma.user.update).toHaveBeenCalledWith({
        where: { id: 'user123' },
        data: { isActive: false },
      });
    });
  });

  describe('validatePasswordStrength', () => {
    it('should validate strong password', () => {
      const strongPassword = 'SecurePass123!';
      const result = UserService.validatePasswordStrength(strongPassword);

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should reject short password', () => {
      const shortPassword = 'Short1!';
      const result = UserService.validatePasswordStrength(shortPassword);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Password must be at least 8 characters long');
    });

    it('should reject password without uppercase', () => {
      const weakPassword = 'securepass123!';
      const result = UserService.validatePasswordStrength(weakPassword);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Password must contain at least one uppercase letter');
    });

    it('should reject password without lowercase', () => {
      const weakPassword = 'SECUREPASS123!';
      const result = UserService.validatePasswordStrength(weakPassword);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Password must contain at least one lowercase letter');
    });

    it('should reject password without number', () => {
      const weakPassword = 'SecurePass!';
      const result = UserService.validatePasswordStrength(weakPassword);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Password must contain at least one number');
    });

    it('should reject password without special character', () => {
      const weakPassword = 'SecurePass123';
      const result = UserService.validatePasswordStrength(weakPassword);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Password must contain at least one special character (@$!%*?&)');
    });

    it('should collect all validation errors', () => {
      const veryWeakPassword = 'abc';
      const result = UserService.validatePasswordStrength(veryWeakPassword);

      expect(result.isValid).toBe(false);
      expect(result.errors).toHaveLength(5);
      expect(result.errors).toContain('Password must be at least 8 characters long');
      expect(result.errors).toContain('Password must contain at least one uppercase letter');
      expect(result.errors).toContain('Password must contain at least one number');
      expect(result.errors).toContain('Password must contain at least one special character (@$!%*?&)');
    });
  });
});
