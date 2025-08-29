import { Role, AdminRole } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// Permission definitions
export enum Permission {
  // User management
  CREATE_USER = 'create_user',
  READ_USER = 'read_user',
  UPDATE_USER = 'update_user',
  DELETE_USER = 'delete_user',
  
  // Booking management
  CREATE_BOOKING = 'create_booking',
  READ_BOOKING = 'read_booking',
  UPDATE_BOOKING = 'update_booking',
  DELETE_BOOKING = 'delete_booking',
  APPROVE_BOOKING = 'approve_booking',
  REJECT_BOOKING = 'reject_booking',
  
  // Driver management
  CREATE_DRIVER = 'create_driver',
  READ_DRIVER = 'read_driver',
  UPDATE_DRIVER = 'update_driver',
  DELETE_DRIVER = 'delete_driver',
  APPROVE_DRIVER = 'approve_driver',
  REJECT_DRIVER = 'reject_driver',
  
  // Financial operations
  READ_PAYMENTS = 'read_payments',
  PROCESS_REFUNDS = 'process_refunds',
  VIEW_INVOICES = 'view_invoices',
  
  // System administration
  MANAGE_SYSTEM = 'manage_system',
  VIEW_LOGS = 'view_logs',
  MANAGE_SETTINGS = 'manage_settings',
  
  // Customer operations
  MANAGE_OWN_BOOKINGS = 'manage_own_bookings',
  VIEW_OWN_PROFILE = 'view_own_profile',
  UPDATE_OWN_PROFILE = 'update_own_profile',
  
  // Driver operations
  MANAGE_OWN_JOBS = 'manage_own_jobs',
  UPDATE_AVAILABILITY = 'update_availability',
  VIEW_EARNINGS = 'view_earnings',
}

// Role-permission mapping
export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  [Role.customer]: [
    Permission.CREATE_BOOKING,
    Permission.READ_BOOKING,
    Permission.UPDATE_BOOKING,
    Permission.DELETE_BOOKING,
    Permission.MANAGE_OWN_BOOKINGS,
    Permission.VIEW_OWN_PROFILE,
    Permission.UPDATE_OWN_PROFILE,
  ],
  
  [Role.driver]: [
    Permission.READ_BOOKING,
    Permission.UPDATE_BOOKING,
    Permission.MANAGE_OWN_JOBS,
    Permission.UPDATE_AVAILABILITY,
    Permission.VIEW_EARNINGS,
    Permission.VIEW_OWN_PROFILE,
    Permission.UPDATE_OWN_PROFILE,
  ],
  
  [Role.admin]: [
    Permission.CREATE_USER,
    Permission.READ_USER,
    Permission.UPDATE_USER,
    Permission.DELETE_USER,
    Permission.CREATE_BOOKING,
    Permission.READ_BOOKING,
    Permission.UPDATE_BOOKING,
    Permission.DELETE_BOOKING,
    Permission.APPROVE_BOOKING,
    Permission.REJECT_BOOKING,
    Permission.CREATE_DRIVER,
    Permission.READ_DRIVER,
    Permission.UPDATE_DRIVER,
    Permission.DELETE_DRIVER,
    Permission.APPROVE_DRIVER,
    Permission.REJECT_DRIVER,
    Permission.READ_PAYMENTS,
    Permission.PROCESS_REFUNDS,
    Permission.VIEW_INVOICES,
    Permission.VIEW_LOGS,
    Permission.MANAGE_SETTINGS,
    Permission.VIEW_OWN_PROFILE,
    Permission.UPDATE_OWN_PROFILE,
  ],
  
  // Super admin permissions (for users with AdminRole.superadmin)
  // Note: This is handled separately in the hasPermission function
};

// Admin role specific permissions
export const ADMIN_ROLE_PERMISSIONS: Record<AdminRole, Permission[]> = {
  [AdminRole.superadmin]: [
    Permission.MANAGE_SYSTEM,
    Permission.VIEW_LOGS,
    Permission.MANAGE_SETTINGS,
    Permission.READ_USER,
    Permission.READ_DRIVER,
    Permission.READ_BOOKING,
    Permission.CREATE_USER,
    Permission.UPDATE_USER,
    Permission.DELETE_USER,
    Permission.CREATE_DRIVER,
    Permission.UPDATE_DRIVER,
    Permission.DELETE_DRIVER,
  ],
  
  [AdminRole.ops]: [
    Permission.READ_BOOKING,
    Permission.UPDATE_BOOKING,
    Permission.APPROVE_BOOKING,
    Permission.REJECT_BOOKING,
    Permission.READ_USER,
    Permission.VIEW_LOGS,
    Permission.READ_DRIVER,
    Permission.UPDATE_DRIVER,
    Permission.APPROVE_DRIVER,
    Permission.REJECT_DRIVER,
  ],
  
  [AdminRole.support]: [
    Permission.READ_BOOKING,
    Permission.READ_USER,
    Permission.READ_DRIVER,
    Permission.VIEW_LOGS,
  ],
  
  [AdminRole.reviewer]: [
    Permission.READ_BOOKING,
    Permission.APPROVE_BOOKING,
    Permission.REJECT_BOOKING,
    Permission.READ_DRIVER,
    Permission.APPROVE_DRIVER,
    Permission.REJECT_DRIVER,
    Permission.VIEW_LOGS,
  ],
  
  [AdminRole.finance]: [
    Permission.READ_PAYMENTS,
    Permission.PROCESS_REFUNDS,
    Permission.VIEW_INVOICES,
    Permission.READ_BOOKING,
    Permission.VIEW_LOGS,
  ],
  
  [AdminRole.read_only]: [
    Permission.READ_BOOKING,
    Permission.READ_USER,
    Permission.READ_DRIVER,
    Permission.VIEW_LOGS,
  ],
};

export interface UserPermissions {
  userId: string;
  role: Role;
  adminRole?: AdminRole;
  permissions: Permission[];
}

export class RBACService {
  /**
   * Get all permissions for a user based on their role and admin role
   */
  static getUserPermissions(userRole: Role, adminRole?: AdminRole): Permission[] {
    const basePermissions = ROLE_PERMISSIONS[userRole] || [];
    
    if (userRole === Role.admin && adminRole) {
      const adminPermissions = ADMIN_ROLE_PERMISSIONS[adminRole] || [];
      return [...new Set([...basePermissions, ...adminPermissions])];
    }
    
    return basePermissions;
  }

  /**
   * Check if a user has a specific permission
   */
  static hasPermission(userPermissions: Permission[], requiredPermission: Permission): boolean {
    return userPermissions.includes(requiredPermission);
  }

  /**
   * Check if a user has any of the required permissions
   */
  static hasAnyPermission(userPermissions: Permission[], requiredPermissions: Permission[]): boolean {
    return requiredPermissions.some(permission => userPermissions.includes(permission));
  }

  /**
   * Check if a user has all required permissions
   */
  static hasAllPermissions(userPermissions: Permission[], requiredPermissions: Permission[]): boolean {
    return requiredPermissions.every(permission => userPermissions.includes(permission));
  }

  /**
   * Get permissions required for a specific resource and action
   */
  static getRequiredPermissions(resource: string, action: string): Permission[] {
    const permissionMap: Record<string, Record<string, Permission[]>> = {
      'user': {
        'create': [Permission.CREATE_USER],
        'read': [Permission.READ_USER],
        'update': [Permission.UPDATE_USER],
        'delete': [Permission.DELETE_USER],
        'read_own': [Permission.VIEW_OWN_PROFILE],
        'update_own': [Permission.UPDATE_OWN_PROFILE],
      },
      'booking': {
        'create': [Permission.CREATE_BOOKING],
        'read': [Permission.READ_BOOKING],
        'update': [Permission.UPDATE_BOOKING],
        'delete': [Permission.DELETE_BOOKING],
        'approve': [Permission.APPROVE_BOOKING],
        'reject': [Permission.REJECT_BOOKING],
        'manage_own': [Permission.MANAGE_OWN_BOOKINGS],
      },
      'driver': {
        'create': [Permission.CREATE_DRIVER],
        'read': [Permission.READ_DRIVER],
        'update': [Permission.UPDATE_DRIVER],
        'delete': [Permission.DELETE_DRIVER],
        'approve': [Permission.APPROVE_DRIVER],
        'reject': [Permission.REJECT_DRIVER],
        'manage_own': [Permission.MANAGE_OWN_JOBS],
      },
      'payment': {
        'read': [Permission.READ_PAYMENTS],
        'process_refund': [Permission.PROCESS_REFUNDS],
        'view_invoice': [Permission.VIEW_INVOICES],
      },
      'system': {
        'manage': [Permission.MANAGE_SYSTEM],
        'view_logs': [Permission.VIEW_LOGS],
        'manage_settings': [Permission.MANAGE_SETTINGS],
      },
    };

    return permissionMap[resource]?.[action] || [];
  }
}

// Middleware for API route protection
export function withPermission(requiredPermission: Permission) {
  return function(handler: Function) {
    return async (req: NextApiRequest, res: NextApiResponse) => {
      try {
        const session = await getServerSession(req, res, authOptions);
        
        if (!session?.user) {
          return res.status(401).json({ error: 'Unauthorized' });
        }

        const userPermissions = RBACService.getUserPermissions(
          session.user.role as Role,
          (session.user as any).adminRole as AdminRole
        );

        if (!RBACService.hasPermission(userPermissions, requiredPermission)) {
          return res.status(403).json({ error: 'Insufficient permissions' });
        }

        return handler(req, res);
      } catch (error) {
        console.error('Permission check failed:', error);
        return res.status(500).json({ error: 'Internal server error' });
      }
    };
  };
}

// Middleware for multiple permission requirements
export function withPermissions(requiredPermissions: Permission[], requireAll: boolean = true) {
  return function(handler: Function) {
    return async (req: NextApiRequest, res: NextApiResponse) => {
      try {
        const session = await getServerSession(req, res, authOptions);
        
        if (!session?.user) {
          return res.status(401).json({ error: 'Unauthorized' });
        }

        const userPermissions = RBACService.getUserPermissions(
          session.user.role as Role,
          (session.user as any).adminRole as AdminRole
        );

        const hasAccess = requireAll 
          ? RBACService.hasAllPermissions(userPermissions, requiredPermissions)
          : RBACService.hasAnyPermission(userPermissions, requiredPermissions);

        if (!hasAccess) {
          return res.status(403).json({ error: 'Insufficient permissions' });
        }

        return handler(req, res);
      } catch (error) {
        console.error('Permission check failed:', error);
        return res.status(500).json({ error: 'Internal server error' });
      }
    };
  };
}

// Middleware for resource-based access control
export function withResourcePermission(resource: string, action: string) {
  return function(handler: Function) {
    return async (req: NextApiRequest, res: NextApiResponse) => {
      try {
        const session = await getServerSession(req, res, authOptions);
        
        if (!session?.user) {
          return res.status(401).json({ error: 'Unauthorized' });
        }

        const requiredPermissions = RBACService.getRequiredPermissions(resource, action);
        const userPermissions = RBACService.getUserPermissions(
          session.user.role as Role,
          (session.user as any).adminRole as AdminRole
        );

        if (!RBACService.hasAllPermissions(userPermissions, requiredPermissions)) {
          return res.status(403).json({ error: 'Insufficient permissions' });
        }

        return handler(req, res);
      } catch (error) {
        console.error('Permission check failed:', error);
        return res.status(500).json({ error: 'Internal server error' });
      }
    };
  };
}

export default RBACService;
