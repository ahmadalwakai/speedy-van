import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { Role, AdminRole } from '@prisma/client';
import RBACService, { 
  Permission, 
  ROLE_PERMISSIONS, 
  ADMIN_ROLE_PERMISSIONS,
  UserPermissions 
} from '../rbac';

describe('RBACService', () => {
  describe('Permission Definitions', () => {
    it('should have all required permission types defined', () => {
      const expectedPermissions = [
        // User management
        'create_user', 'read_user', 'update_user', 'delete_user',
        // Booking management
        'create_booking', 'read_booking', 'update_booking', 'delete_booking',
        'approve_booking', 'reject_booking',
        // Driver management
        'create_driver', 'read_driver', 'update_driver', 'delete_driver',
        'approve_driver', 'reject_driver',
        // Financial operations
        'read_payments', 'process_refunds', 'view_invoices',
        // System administration
        'manage_system', 'view_logs', 'manage_settings',
        // Customer operations
        'manage_own_bookings', 'view_own_profile', 'update_own_profile',
        // Driver operations
        'manage_own_jobs', 'update_availability', 'view_earnings',
      ];

      expectedPermissions.forEach(permission => {
        expect(Object.values(Permission)).toContain(permission);
      });
    });

    it('should have unique permission values', () => {
      const permissionValues = Object.values(Permission);
      const uniqueValues = new Set(permissionValues);
      expect(permissionValues.length).toBe(uniqueValues.size);
    });
  });

  describe('Role-Permission Mapping', () => {
    it('should have permissions defined for all roles', () => {
      Object.values(Role).forEach(role => {
        expect(ROLE_PERMISSIONS[role]).toBeDefined();
        expect(Array.isArray(ROLE_PERMISSIONS[role])).toBe(true);
        expect(ROLE_PERMISSIONS[role].length).toBeGreaterThan(0);
      });
    });

    it('should have admin role permissions defined for all admin roles', () => {
      Object.values(AdminRole).forEach(adminRole => {
        expect(ADMIN_ROLE_PERMISSIONS[adminRole]).toBeDefined();
        expect(Array.isArray(ADMIN_ROLE_PERMISSIONS[adminRole])).toBe(true);
        expect(ADMIN_ROLE_PERMISSIONS[adminRole].length).toBeGreaterThan(0);
      });
    });

    it('should have customer role with appropriate permissions', () => {
      const customerPermissions = ROLE_PERMISSIONS[Role.customer];
      
      expect(customerPermissions).toContain(Permission.CREATE_BOOKING);
      expect(customerPermissions).toContain(Permission.READ_BOOKING);
      expect(customerPermissions).toContain(Permission.UPDATE_BOOKING);
      expect(customerPermissions).toContain(Permission.DELETE_BOOKING);
      expect(customerPermissions).toContain(Permission.MANAGE_OWN_BOOKINGS);
      expect(customerPermissions).toContain(Permission.VIEW_OWN_PROFILE);
      expect(customerPermissions).toContain(Permission.UPDATE_OWN_PROFILE);
      
      // Customers should not have admin permissions
      expect(customerPermissions).not.toContain(Permission.CREATE_USER);
      expect(customerPermissions).not.toContain(Permission.MANAGE_SYSTEM);
    });

    it('should have driver role with appropriate permissions', () => {
      const driverPermissions = ROLE_PERMISSIONS[Role.driver];
      
      expect(driverPermissions).toContain(Permission.READ_BOOKING);
      expect(driverPermissions).toContain(Permission.UPDATE_BOOKING);
      expect(driverPermissions).toContain(Permission.MANAGE_OWN_JOBS);
      expect(driverPermissions).toContain(Permission.UPDATE_AVAILABILITY);
      expect(driverPermissions).toContain(Permission.VIEW_EARNINGS);
      expect(driverPermissions).toContain(Permission.VIEW_OWN_PROFILE);
      expect(driverPermissions).toContain(Permission.UPDATE_OWN_PROFILE);
      
      // Drivers should not have customer or admin permissions
      expect(driverPermissions).not.toContain(Permission.CREATE_BOOKING);
      expect(driverPermissions).not.toContain(Permission.DELETE_BOOKING);
      expect(driverPermissions).not.toContain(Permission.CREATE_USER);
    });

    it('should have admin role with comprehensive permissions', () => {
      const adminPermissions = ROLE_PERMISSIONS[Role.admin];
      
      // Should have all basic permissions
      expect(adminPermissions).toContain(Permission.CREATE_USER);
      expect(adminPermissions).toContain(Permission.READ_USER);
      expect(adminPermissions).toContain(Permission.UPDATE_USER);
      expect(adminPermissions).toContain(Permission.DELETE_USER);
      expect(adminPermissions).toContain(Permission.CREATE_BOOKING);
      expect(adminPermissions).toContain(Permission.READ_BOOKING);
      expect(adminPermissions).toContain(Permission.UPDATE_BOOKING);
      expect(adminPermissions).toContain(Permission.DELETE_BOOKING);
      expect(adminPermissions).toContain(Permission.APPROVE_BOOKING);
      expect(adminPermissions).toContain(Permission.REJECT_BOOKING);
      expect(adminPermissions).toContain(Permission.CREATE_DRIVER);
      expect(adminPermissions).toContain(Permission.READ_DRIVER);
      expect(adminPermissions).toContain(Permission.UPDATE_DRIVER);
      expect(adminPermissions).toContain(Permission.DELETE_DRIVER);
      expect(adminPermissions).toContain(Permission.APPROVE_DRIVER);
      expect(adminPermissions).toContain(Permission.REJECT_DRIVER);
      expect(adminPermissions).toContain(Permission.READ_PAYMENTS);
      expect(adminPermissions).toContain(Permission.PROCESS_REFUNDS);
      expect(adminPermissions).toContain(Permission.VIEW_INVOICES);
      expect(adminPermissions).toContain(Permission.VIEW_LOGS);
      expect(adminPermissions).toContain(Permission.MANAGE_SETTINGS);
      
      // Should not have super admin permissions
      expect(adminPermissions).not.toContain(Permission.MANAGE_SYSTEM);
    });

    it('should have super admin role with all permissions', () => {
      const superAdminPermissions = ROLE_PERMISSIONS[Role.super_admin];
      
      // Should have all admin permissions plus system management
      expect(superAdminPermissions).toContain(Permission.MANAGE_SYSTEM);
      expect(superAdminPermissions).toContain(Permission.CREATE_USER);
      expect(superAdminPermissions).toContain(Permission.READ_USER);
      expect(superAdminPermissions).toContain(Permission.UPDATE_USER);
      expect(superAdminPermissions).toContain(Permission.DELETE_USER);
    });
  });

  describe('Admin Role Specific Permissions', () => {
    it('should have booking manager with appropriate permissions', () => {
      const bookingManagerPermissions = ADMIN_ROLE_PERMISSIONS[AdminRole.booking_manager];
      
      expect(bookingManagerPermissions).toContain(Permission.READ_BOOKING);
      expect(bookingManagerPermissions).toContain(Permission.UPDATE_BOOKING);
      expect(bookingManagerPermissions).toContain(Permission.APPROVE_BOOKING);
      expect(bookingManagerPermissions).toContain(Permission.REJECT_BOOKING);
      expect(bookingManagerPermissions).toContain(Permission.READ_USER);
      expect(bookingManagerPermissions).toContain(Permission.VIEW_LOGS);
      
      // Should not have driver or financial permissions
      expect(bookingManagerPermissions).not.toContain(Permission.APPROVE_DRIVER);
      expect(bookingManagerPermissions).not.toContain(Permission.PROCESS_REFUNDS);
    });

    it('should have driver manager with appropriate permissions', () => {
      const driverManagerPermissions = ADMIN_ROLE_PERMISSIONS[AdminRole.driver_manager];
      
      expect(driverManagerPermissions).toContain(Permission.READ_DRIVER);
      expect(driverManagerPermissions).toContain(Permission.UPDATE_DRIVER);
      expect(driverManagerPermissions).toContain(Permission.APPROVE_DRIVER);
      expect(driverManagerPermissions).toContain(Permission.REJECT_DRIVER);
      expect(driverManagerPermissions).toContain(Permission.READ_BOOKING);
      expect(driverManagerPermissions).toContain(Permission.VIEW_LOGS);
      
      // Should not have booking approval or financial permissions
      expect(driverManagerPermissions).not.toContain(Permission.APPROVE_BOOKING);
      expect(driverManagerPermissions).not.toContain(Permission.PROCESS_REFUNDS);
    });

    it('should have finance manager with appropriate permissions', () => {
      const financeManagerPermissions = ADMIN_ROLE_PERMISSIONS[AdminRole.finance_manager];
      
      expect(financeManagerPermissions).toContain(Permission.READ_PAYMENTS);
      expect(financeManagerPermissions).toContain(Permission.PROCESS_REFUNDS);
      expect(financeManagerPermissions).toContain(Permission.VIEW_INVOICES);
      expect(financeManagerPermissions).toContain(Permission.READ_BOOKING);
      expect(financeManagerPermissions).toContain(Permission.VIEW_LOGS);
      
      // Should not have user or driver management permissions
      expect(financeManagerPermissions).not.toContain(Permission.CREATE_USER);
      expect(financeManagerPermissions).not.toContain(Permission.APPROVE_DRIVER);
    });

    it('should have system admin with appropriate permissions', () => {
      const systemAdminPermissions = ADMIN_ROLE_PERMISSIONS[AdminRole.system_admin];
      
      expect(systemAdminPermissions).toContain(Permission.MANAGE_SYSTEM);
      expect(systemAdminPermissions).toContain(Permission.VIEW_LOGS);
      expect(systemAdminPermissions).toContain(Permission.MANAGE_SETTINGS);
      expect(systemAdminPermissions).toContain(Permission.READ_USER);
      expect(systemAdminPermissions).toContain(Permission.READ_DRIVER);
      expect(systemAdminPermissions).toContain(Permission.READ_BOOKING);
      
      // Should not have specific business permissions
      expect(systemAdminPermissions).not.toContain(Permission.APPROVE_BOOKING);
      expect(systemAdminPermissions).not.toContain(Permission.PROCESS_REFUNDS);
    });
  });

  describe('getUserPermissions', () => {
    it('should return base role permissions for customer', () => {
      const permissions = RBACService.getUserPermissions(Role.customer);
      
      expect(permissions).toEqual(ROLE_PERMISSIONS[Role.customer]);
      expect(permissions).toContain(Permission.CREATE_BOOKING);
      expect(permissions).toContain(Permission.MANAGE_OWN_BOOKINGS);
    });

    it('should return base role permissions for driver', () => {
      const permissions = RBACService.getUserPermissions(Role.driver);
      
      expect(permissions).toEqual(ROLE_PERMISSIONS[Role.driver]);
      expect(permissions).toContain(Permission.MANAGE_OWN_JOBS);
      expect(permissions).toContain(Permission.UPDATE_AVAILABILITY);
    });

    it('should return base role permissions for admin without admin role', () => {
      const permissions = RBACService.getUserPermissions(Role.admin);
      
      expect(permissions).toEqual(ROLE_PERMISSIONS[Role.admin]);
      expect(permissions).toContain(Permission.CREATE_USER);
      expect(permissions).toContain(Permission.READ_USER);
    });

    it('should combine base and admin role permissions for admin with admin role', () => {
      const permissions = RBACService.getUserPermissions(Role.admin, AdminRole.booking_manager);
      
      const basePermissions = ROLE_PERMISSIONS[Role.admin];
      const adminPermissions = ADMIN_ROLE_PERMISSIONS[AdminRole.booking_manager];
      const expectedPermissions = [...new Set([...basePermissions, ...adminPermissions])];
      
      expect(permissions).toEqual(expectedPermissions);
      expect(permissions).toContain(Permission.CREATE_USER); // From base admin role
      expect(permissions).toContain(Permission.APPROVE_BOOKING); // From booking manager role
    });

    it('should return super admin permissions', () => {
      const permissions = RBACService.getUserPermissions(Role.super_admin);
      
      expect(permissions).toEqual(ROLE_PERMISSIONS[Role.super_admin]);
      expect(permissions).toContain(Permission.MANAGE_SYSTEM);
      expect(permissions).toContain(Permission.CREATE_USER);
    });
  });

  describe('Permission Checking Methods', () => {
    const testPermissions = [
      Permission.CREATE_BOOKING,
      Permission.READ_BOOKING,
      Permission.UPDATE_BOOKING,
    ];

    describe('hasPermission', () => {
      it('should return true for existing permission', () => {
        const result = RBACService.hasPermission(testPermissions, Permission.CREATE_BOOKING);
        expect(result).toBe(true);
      });

      it('should return false for non-existing permission', () => {
        const result = RBACService.hasPermission(testPermissions, Permission.DELETE_USER);
        expect(result).toBe(false);
      });
    });

    describe('hasAnyPermission', () => {
      it('should return true if user has any of the required permissions', () => {
        const requiredPermissions = [Permission.CREATE_BOOKING, Permission.DELETE_USER];
        const result = RBACService.hasAnyPermission(testPermissions, requiredPermissions);
        expect(result).toBe(true);
      });

      it('should return false if user has none of the required permissions', () => {
        const requiredPermissions = [Permission.DELETE_USER, Permission.MANAGE_SYSTEM];
        const result = RBACService.hasAnyPermission(testPermissions, requiredPermissions);
        expect(result).toBe(false);
      });
    });

    describe('hasAllPermissions', () => {
      it('should return true if user has all required permissions', () => {
        const requiredPermissions = [Permission.CREATE_BOOKING, Permission.READ_BOOKING];
        const result = RBACService.hasAllPermissions(testPermissions, requiredPermissions);
        expect(result).toBe(true);
      });

      it('should return false if user is missing any required permission', () => {
        const requiredPermissions = [Permission.CREATE_BOOKING, Permission.DELETE_USER];
        const result = RBACService.hasAllPermissions(testPermissions, requiredPermissions);
        expect(result).toBe(false);
      });
    });
  });

  describe('getRequiredPermissions', () => {
    it('should return correct permissions for user operations', () => {
      expect(RBACService.getRequiredPermissions('user', 'create')).toEqual([Permission.CREATE_USER]);
      expect(RBACService.getRequiredPermissions('user', 'read')).toEqual([Permission.READ_USER]);
      expect(RBACService.getRequiredPermissions('user', 'update')).toEqual([Permission.UPDATE_USER]);
      expect(RBACService.getRequiredPermissions('user', 'delete')).toEqual([Permission.DELETE_USER]);
      expect(RBACService.getRequiredPermissions('user', 'read_own')).toEqual([Permission.VIEW_OWN_PROFILE]);
      expect(RBACService.getRequiredPermissions('user', 'update_own')).toEqual([Permission.UPDATE_OWN_PROFILE]);
    });

    it('should return correct permissions for booking operations', () => {
      expect(RBACService.getRequiredPermissions('booking', 'create')).toEqual([Permission.CREATE_BOOKING]);
      expect(RBACService.getRequiredPermissions('booking', 'read')).toEqual([Permission.READ_BOOKING]);
      expect(RBACService.getRequiredPermissions('booking', 'update')).toEqual([Permission.UPDATE_BOOKING]);
      expect(RBACService.getRequiredPermissions('booking', 'delete')).toEqual([Permission.DELETE_BOOKING]);
      expect(RBACService.getRequiredPermissions('booking', 'approve')).toEqual([Permission.APPROVE_BOOKING]);
      expect(RBACService.getRequiredPermissions('booking', 'reject')).toEqual([Permission.REJECT_BOOKING]);
      expect(RBACService.getRequiredPermissions('booking', 'manage_own')).toEqual([Permission.MANAGE_OWN_BOOKINGS]);
    });

    it('should return correct permissions for driver operations', () => {
      expect(RBACService.getRequiredPermissions('driver', 'create')).toEqual([Permission.CREATE_DRIVER]);
      expect(RBACService.getRequiredPermissions('driver', 'read')).toEqual([Permission.READ_DRIVER]);
      expect(RBACService.getRequiredPermissions('driver', 'update')).toEqual([Permission.UPDATE_DRIVER]);
      expect(RBACService.getRequiredPermissions('driver', 'delete')).toEqual([Permission.DELETE_DRIVER]);
      expect(RBACService.getRequiredPermissions('driver', 'approve')).toEqual([Permission.APPROVE_DRIVER]);
      expect(RBACService.getRequiredPermissions('driver', 'reject')).toEqual([Permission.REJECT_DRIVER]);
      expect(RBACService.getRequiredPermissions('driver', 'manage_own')).toEqual([Permission.MANAGE_OWN_JOBS]);
    });

    it('should return correct permissions for payment operations', () => {
      expect(RBACService.getRequiredPermissions('payment', 'read')).toEqual([Permission.READ_PAYMENTS]);
      expect(RBACService.getRequiredPermissions('payment', 'process_refund')).toEqual([Permission.PROCESS_REFUNDS]);
      expect(RBACService.getRequiredPermissions('payment', 'view_invoice')).toEqual([Permission.VIEW_INVOICES]);
    });

    it('should return correct permissions for system operations', () => {
      expect(RBACService.getRequiredPermissions('system', 'manage')).toEqual([Permission.MANAGE_SYSTEM]);
      expect(RBACService.getRequiredPermissions('system', 'view_logs')).toEqual([Permission.VIEW_LOGS]);
      expect(RBACService.getRequiredPermissions('system', 'manage_settings')).toEqual([Permission.MANAGE_SETTINGS]);
    });

    it('should return empty array for unknown resource or action', () => {
      expect(RBACService.getRequiredPermissions('unknown', 'action')).toEqual([]);
      expect(RBACService.getRequiredPermissions('user', 'unknown')).toEqual([]);
    });
  });

  describe('Permission Scenarios', () => {
    it('should allow customer to manage their own bookings', () => {
      const customerPermissions = RBACService.getUserPermissions(Role.customer);
      
      expect(RBACService.hasPermission(customerPermissions, Permission.CREATE_BOOKING)).toBe(true);
      expect(RBACService.hasPermission(customerPermissions, Permission.MANAGE_OWN_BOOKINGS)).toBe(true);
      expect(RBACService.hasPermission(customerPermissions, Permission.VIEW_OWN_PROFILE)).toBe(true);
    });

    it('should allow driver to manage their own jobs', () => {
      const driverPermissions = RBACService.getUserPermissions(Role.driver);
      
      expect(RBACService.hasPermission(driverPermissions, Permission.MANAGE_OWN_JOBS)).toBe(true);
      expect(RBACService.hasPermission(driverPermissions, Permission.UPDATE_AVAILABILITY)).toBe(true);
      expect(RBACService.hasPermission(driverPermissions, Permission.VIEW_EARNINGS)).toBe(true);
    });

    it('should allow admin to manage users and bookings', () => {
      const adminPermissions = RBACService.getUserPermissions(Role.admin);
      
      expect(RBACService.hasPermission(adminPermissions, Permission.CREATE_USER)).toBe(true);
      expect(RBACService.hasPermission(adminPermissions, Permission.READ_USER)).toBe(true);
      expect(RBACService.hasPermission(adminPermissions, Permission.APPROVE_BOOKING)).toBe(true);
      expect(RBACService.hasPermission(adminPermissions, Permission.APPROVE_DRIVER)).toBe(true);
    });

    it('should allow super admin to manage system', () => {
      const superAdminPermissions = RBACService.getUserPermissions(Role.super_admin);
      
      expect(RBACService.hasPermission(superAdminPermissions, Permission.MANAGE_SYSTEM)).toBe(true);
      expect(RBACService.hasPermission(superAdminPermissions, Permission.CREATE_USER)).toBe(true);
      expect(RBACService.hasPermission(superAdminPermissions, Permission.APPROVE_BOOKING)).toBe(true);
    });

    it('should allow booking manager to approve/reject bookings', () => {
      const bookingManagerPermissions = RBACService.getUserPermissions(Role.admin, AdminRole.booking_manager);
      
      expect(RBACService.hasPermission(bookingManagerPermissions, Permission.APPROVE_BOOKING)).toBe(true);
      expect(RBACService.hasPermission(bookingManagerPermissions, Permission.REJECT_BOOKING)).toBe(true);
      expect(RBACService.hasPermission(bookingManagerPermissions, Permission.READ_USER)).toBe(true);
    });

    it('should allow finance manager to process refunds', () => {
      const financeManagerPermissions = RBACService.getUserPermissions(Role.admin, AdminRole.finance_manager);
      
      expect(RBACService.hasPermission(financeManagerPermissions, Permission.PROCESS_REFUNDS)).toBe(true);
      expect(RBACService.hasPermission(financeManagerPermissions, Permission.VIEW_INVOICES)).toBe(true);
      expect(RBACService.hasPermission(financeManagerPermissions, Permission.READ_PAYMENTS)).toBe(true);
    });
  });
});
