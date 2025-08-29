import { useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';

/**
 * Custom hook to handle automatic session refresh after login
 * Ensures the session is properly updated before any redirects
 */
export function useSessionRefresh() {
  const { data: session, status, update } = useSession();

  const refreshSession = useCallback(async () => {
    try {
      console.log('🔄 Refreshing session...');
      await update();
      console.log('✅ Session refreshed successfully');
      return true;
    } catch (error) {
      console.error('❌ Failed to refresh session:', error);
      return false;
    }
  }, [update]);

  // Auto-refresh session when status changes to authenticated
  useEffect(() => {
    if (status === 'authenticated' && session?.user) {
      // Small delay to ensure all auth data is properly set
      const timer = setTimeout(() => {
        refreshSession();
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [status, session, refreshSession]);

  return {
    refreshSession,
    session,
    status,
  };
}
