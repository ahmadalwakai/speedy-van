import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Define protected routes and their required roles
const protectedRoutes = {
  '/admin': ['admin'],
  '/driver': ['driver'],
  '/customer': ['customer'],
  '/api/admin': ['admin'],
  '/api/driver': ['driver'],
  '/api/customer': ['customer'],
};

// Define public routes that don't require authentication
const publicRoutes = [
  '/',
  '/auth/signin',
  '/auth/signup',
  '/auth/error',
  '/driver-application',
  '/driver-application/success',
  '/track',
  '/api/track',
  '/api/webhooks',
  '/api/driver/applications', // Allow public driver applications
  '/api/test-sms', // Allow SMS testing
  '/api/sms/dlr', // Allow SMS delivery reports
  '/api/auth/send-otp', // Allow OTP sending
  '/api/auth/verify-otp', // Allow OTP verification
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if it's a public route
  if (publicRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  // Check if it's a protected route
  const requiredRole = Object.entries(protectedRoutes).find(([route]) => 
    pathname.startsWith(route)
  )?.[1];

  if (!requiredRole) {
    // Not a protected route, allow access
    return NextResponse.next();
  }

  // For now, allow all API routes to pass through to avoid Edge Runtime issues
  if (pathname.startsWith('/api/')) {
    return NextResponse.next();
  }

  // For protected non-API routes, redirect to signin (simplified for now)
  const signinUrl = new URL('/auth/signin', request.url);
  signinUrl.searchParams.set('callbackUrl', pathname);
  return NextResponse.redirect(signinUrl);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     * - api/test-sms (SMS testing endpoint)
     */
    '/((?!_next/static|_next/image|favicon.ico|public/|api/test-sms).*)',
  ],
};

// Force Node.js runtime instead of Edge Runtime
export const runtime = 'nodejs';


