import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

/**
 * Custom hook for automatic role-based redirects after authentication
 * Ensures users are redirected to their appropriate portal based on their role
 */
export function useRoleBasedRedirect() {
  const { data: session, status, update } = useSession();
  const router = useRouter();

  useEffect(() => {
    // Only proceed if session is loaded and user is authenticated
    if (status === 'loading' || !session?.user) {
      return;
    }

    const userRole = (session.user as any)?.role;
    const currentPath = window.location.pathname;

    // Don't redirect if user is already on their appropriate portal
    if (userRole === 'driver' && currentPath.startsWith('/driver')) {
      return;
    }
    if (userRole === 'customer' && currentPath.startsWith('/customer-portal')) {
      return;
    }
    if (userRole === 'admin' && currentPath.startsWith('/admin')) {
      return;
    }

    // Perform role-based redirect
    let redirectUrl = '/';
    
    switch (userRole) {
      case 'driver':
        redirectUrl = '/driver/dashboard';
        break;
      case 'customer':
        redirectUrl = '/customer-portal';
        break;
      case 'admin':
        redirectUrl = '/admin';
        break;
      default:
        redirectUrl = '/';
    }

    // Only redirect if the destination is different from current path
    if (redirectUrl !== currentPath) {
      console.log(`🔄 Redirecting ${userRole} user from ${currentPath} to ${redirectUrl}`);
      
      // Add small delay to ensure session is fully updated
      setTimeout(() => {
        // Force session update before redirect to ensure latest data
        update().then(() => {
          router.replace(redirectUrl);
        });
      }, 200); // 200ms delay for better reliability
    }
  }, [session, status, router, update]);

  return {
    session,
    status,
    userRole: (session?.user as any)?.role,
  };
}
