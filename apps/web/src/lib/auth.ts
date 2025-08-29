import { NextAuthOptions, getServerSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "./prisma";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(creds) {
        if (!creds?.email || !creds?.password) {
          console.log('❌ Missing credentials');
          return null;
        }

        try {
          // Find user by email
          const user = await prisma.user.findUnique({
            where: { email: creds.email },
            include: {
              driver: true,
              driverApplication: true
            }
          });

          if (!user) {
            console.log('❌ User not found');
            return null;
          }

          // Check if user account is active
          if (!user.isActive) {
            console.log('❌ User account is inactive');
            return null;
          }

          // Verify password
          const isValidPassword = await bcrypt.compare(creds.password, user.password);
          if (!isValidPassword) {
            console.log('❌ Invalid password');
            return null;
          }

          // Enforce strict role-based access control
          if (user.role === 'driver') {
            // For drivers, check if they have been approved
            if (!user.driver || user.driver.onboardingStatus !== 'approved') {
              console.log('❌ Driver not approved:', {
                userId: user.id,
                email: user.email,
                hasDriverRecord: !!user.driver,
                onboardingStatus: user.driver?.onboardingStatus
              });
              return null;
            }

            // Check if driver application is approved
            if (user.driverApplication && user.driverApplication.status !== 'approved') {
              console.log('❌ Driver application not approved:', {
                userId: user.id,
                email: user.email,
                applicationStatus: user.driverApplication.status
              });
              return null;
            }
          } else if (user.role === 'customer') {
            // For customers, ensure they don't have pending driver applications
            // that could grant them driver access
            if (user.driverApplication && user.driverApplication.status === 'pending') {
              console.log('❌ Customer has pending driver application:', {
                userId: user.id,
                email: user.email,
                applicationStatus: user.driverApplication.status
              });
              return null;
            }
          }

          console.log('✅ Authentication successful for user:', { 
            id: user.id, 
            email: user.email, 
            role: user.role,
            isActive: user.isActive,
            driverStatus: user.driver?.onboardingStatus,
            applicationStatus: user.driverApplication?.status
          });

          const userData = {
            id: user.id,
            email: user.email,
            name: user.name ?? "",
            role: user.role,
            adminRole: (user as any).adminRole ?? null,
            driverId: user.driver?.id ?? null,
            driverStatus: user.driver?.onboardingStatus ?? null,
            applicationStatus: user.driverApplication?.status ?? null
          };

          console.log('🔐 Returning user data:', userData);
          return userData as any;
        } catch (error) {
          console.error('❌ Authentication error:', error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, account, trigger }) {
      if (account && user) {
        // Initial sign in
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.role = (user as any).role;
        token.adminRole = (user as any).adminRole;
        token.driverId = (user as any).driverId;
        token.driverStatus = (user as any).driverStatus;
        token.applicationStatus = (user as any).applicationStatus;
      }
      
      // Update token on session update
      if (trigger === 'update') {
        // Force token refresh when session is updated
        token.iat = Math.floor(Date.now() / 1000);
      }
      
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.name = token.name as string;
        (session.user as any).role = token.role;
        (session.user as any).adminRole = token.adminRole;
        (session.user as any).driverId = token.driverId;
        (session.user as any).driverStatus = token.driverStatus;
        (session.user as any).applicationStatus = token.applicationStatus;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      // Handle role-based redirects after login
      // If the URL is a callback URL with role information, handle it appropriately
      if (url.includes('callbackUrl')) {
        // Extract the callback URL and check if it's role-specific
        const urlObj = new URL(url);
        const callbackUrl = urlObj.searchParams.get('callbackUrl');
        
        if (callbackUrl) {
          // If there's a specific callback URL, use it
          if (callbackUrl.startsWith('/')) {
            return `${baseUrl}${callbackUrl}`;
          } else if (callbackUrl.startsWith(baseUrl)) {
            return callbackUrl;
          }
        }
      }
      
      // Default behavior for other URLs
      if (url.startsWith(baseUrl)) {
        return url;
      } else if (url.startsWith('/')) {
        return `${baseUrl}${url}`;
      }
      return baseUrl;
    },
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 60 * 60, // 1 hour - update session every hour
  },
  jwt: {
    maxAge: 30 * 24 * 60 * 60, // 30 days - same as session
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export async function requireRole(role: "admin" | "driver" | "customer") {
  const session = await getServerSession(authOptions);
  if (!session?.user || (session.user as any).role !== role) return null;
  
  // Additional role-specific checks
  if (role === 'driver') {
    // Ensure driver is approved and active
    if (!(session.user as any).driverId || (session.user as any).driverStatus !== 'approved') {
      console.log('❌ Driver access denied - not approved:', {
        userId: session.user.id,
        email: session.user.email,
        driverId: (session.user as any).driverId,
        driverStatus: (session.user as any).driverStatus
      });
      return null;
    }
  } else if (role === 'customer') {
    // Ensure customer doesn't have pending driver applications
    if ((session.user as any).applicationStatus === 'pending') {
      console.log('❌ Customer access denied - pending driver application:', {
        userId: session.user.id,
        email: session.user.email,
        applicationStatus: (session.user as any).applicationStatus
      });
      return null;
    }
  }
  
  return session;
}

export async function requireDriver() {
  const session = await getServerSession(authOptions);
  if (!session?.user || (session.user as any).role !== "driver") return null;
  
  // Ensure driver is approved and active
  if (!(session.user as any).driverId || (session.user as any).driverStatus !== 'approved') {
    console.log('❌ Driver access denied - not approved:', {
      userId: session.user.id,
      email: session.user.email,
      driverId: (session.user as any).driverId,
      driverStatus: (session.user as any).driverStatus
    });
    return null;
  }
  
  return session;
}

export async function requireAdmin(allowedAdminRoles?: Array<"superadmin" | "ops" | "support" | "reviewer" | "finance" | "read_only">) {
  const session = await getServerSession(authOptions);
  const isAdmin = !!session?.user && (session.user as any).role === "admin";
  if (!isAdmin) return null;
  if (allowedAdminRoles && allowedAdminRoles.length > 0) {
    const ar = (session.user as any).adminRole as string | null | undefined;
    if (!ar || !allowedAdminRoles.includes(ar as any)) return null;
  }
  return session;
}

export async function requireCustomer() {
  const session = await getServerSession(authOptions);
  if (!session?.user || (session.user as any).role !== "customer") return null;
  
  // Ensure customer doesn't have pending driver applications
  if ((session.user as any).applicationStatus === 'pending') {
    console.log('❌ Customer access denied - pending driver application:', {
      userId: session.user.id,
      email: session.user.email,
      applicationStatus: (session.user as any).applicationStatus
    });
    return null;
  }
  
  return session;
}

// Helper function to check if user can access driver portal
export async function canAccessDriverPortal(userId: string): Promise<boolean> {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        driver: true,
        driverApplication: true
      }
    });

    if (!user || user.role !== 'driver' || !user.isActive) {
      return false;
    }

    // Check if driver is approved
    if (!user.driver || user.driver.onboardingStatus !== 'approved') {
      return false;
    }

    // Check if driver application is approved
    if (user.driverApplication && user.driverApplication.status !== 'approved') {
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error checking driver portal access:', error);
    return false;
  }
}

// Helper function to check if user can access customer portal
export async function canAccessCustomerPortal(userId: string): Promise<boolean> {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        driverApplication: true
      }
    });

    if (!user || user.role !== 'customer' || !user.isActive) {
      return false;
    }

    // Check if customer has pending driver applications
    if (user.driverApplication && user.driverApplication.status === 'pending') {
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error checking customer portal access:', error);
    return false;
  }
}


