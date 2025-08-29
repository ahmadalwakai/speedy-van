import bcrypt from 'bcryptjs';
import { PrismaClient, User, Role, AdminRole } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

// Input validation schemas
export const CreateUserSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, 
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'),
  name: z.string().min(2, 'Name must be at least 2 characters').optional(),
  role: z.nativeEnum(Role).default(Role.customer),
  adminRole: z.nativeEnum(AdminRole).optional(),
});

export const UpdateUserSchema = z.object({
  email: z.string().email('Invalid email format').optional(),
  name: z.string().min(2, 'Name must be at least 2 characters').optional(),
  role: z.nativeEnum(Role).optional(),
  adminRole: z.nativeEnum(AdminRole).optional(),
  isActive: z.boolean().optional(),
});

export const ChangePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, 
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'),
});

export const LoginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required'),
});

export type CreateUserInput = z.infer<typeof CreateUserSchema>;
export type UpdateUserInput = z.infer<typeof UpdateUserSchema>;
export type ChangePasswordInput = z.infer<typeof ChangePasswordSchema>;
export type LoginInput = z.infer<typeof LoginSchema>;

export class UserService {
  private static readonly SALT_ROUNDS = 12;

  /**
   * Create a new user with encrypted password
   */
  static async createUser(data: CreateUserInput): Promise<User> {
    try {
      // Validate input
      const validatedData = CreateUserSchema.parse(data);
      
      // Check if user already exists
      const existingUser = await prisma.user.findUnique({
        where: { email: validatedData.email }
      });
      
      if (existingUser) {
        throw new Error('User with this email already exists');
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(validatedData.password, this.SALT_ROUNDS);
      
      // Create user
      const user = await prisma.user.create({
        data: {
          ...validatedData,
          password: hashedPassword,
        }
      });

      // Remove password from response
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword as User;
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new Error(`Validation error: ${error.issues.map(e => e.message).join(', ')}`);
      }
      throw error;
    }
  }

  /**
   * Authenticate user login
   */
  static async authenticateUser(data: LoginInput): Promise<{ user: Omit<User, 'password'>, isValid: boolean }> {
    try {
      const validatedData = LoginSchema.parse(data);
      
      const user = await prisma.user.findUnique({
        where: { email: validatedData.email }
      });

      if (!user) {
        return { user: null as any, isValid: false };
      }

      if (!user.isActive) {
        throw new Error('Account is deactivated');
      }

      const isValidPassword = await bcrypt.compare(validatedData.password, user.password);
      
      if (!isValidPassword) {
        return { user: null as any, isValid: false };
      }

      // Update last login
      await prisma.user.update({
        where: { id: user.id },
        data: { lastLogin: new Date() }
      });

      const { password, ...userWithoutPassword } = user;
      return { user: userWithoutPassword, isValid: true };
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new Error(`Validation error: ${error.issues.map(e => e.message).join(', ')}`);
      }
      throw error;
    }
  }

  /**
   * Change user password
   */
  static async changePassword(userId: string, data: ChangePasswordInput): Promise<void> {
    try {
      const validatedData = ChangePasswordSchema.parse(data);
      
      const user = await prisma.user.findUnique({
        where: { id: userId }
      });

      if (!user) {
        throw new Error('User not found');
      }

      // Verify current password
      const isCurrentPasswordValid = await bcrypt.compare(validatedData.currentPassword, user.password);
      if (!isCurrentPasswordValid) {
        throw new Error('Current password is incorrect');
      }

      // Hash new password
      const hashedNewPassword = await bcrypt.hash(validatedData.newPassword, this.SALT_ROUNDS);
      
      // Update password
      await prisma.user.update({
        where: { id: userId },
        data: { password: hashedNewPassword }
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new Error(`Validation error: ${error.issues.map(e => e.message).join(', ')}`);
      }
      throw error;
    }
  }

  /**
   * Update user information
   */
  static async updateUser(userId: string, data: UpdateUserInput): Promise<Omit<User, 'password'>> {
    try {
      const validatedData = UpdateUserSchema.parse(data);
      
      const user = await prisma.user.update({
        where: { id: userId },
        data: validatedData
      });

      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new Error(`Validation error: ${error.issues.map(e => e.message).join(', ')}`);
      }
      throw error;
    }
  }

  /**
   * Get user by ID (without password)
   */
  static async getUserById(userId: string): Promise<Omit<User, 'password'> | null> {
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) return null;

    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  /**
   * Deactivate user account
   */
  static async deactivateUser(userId: string): Promise<void> {
    await prisma.user.update({
      where: { id: userId },
      data: { isActive: false }
    });
  }

  /**
   * Verify password strength
   */
  static validatePasswordStrength(password: string): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (password.length < 8) {
      errors.push('Password must be at least 8 characters long');
    }
    
    if (!/(?=.*[a-z])/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }
    
    if (!/(?=.*[A-Z])/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }
    
    if (!/(?=.*\d)/.test(password)) {
      errors.push('Password must contain at least one number');
    }
    
    if (!/(?=.*[@$!%*?&])/.test(password)) {
      errors.push('Password must contain at least one special character (@$!%*?&)');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }
}

export default UserService;
