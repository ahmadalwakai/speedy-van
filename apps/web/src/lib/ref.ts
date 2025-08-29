import { prisma } from "@/lib/prisma";

/**
 * Generates a unique booking reference with collision handling
 * Uses retry logic to avoid unique constraint violations under load
 */
export async function createUniqueReference(prefix = "SV-", maxTries = 5): Promise<string> {
  for (let i = 0; i < maxTries; i++) {
    // Generate random 6-character alphanumeric reference
    const ref = prefix + Math.random().toString(36).slice(2, 8).toUpperCase();
    
    try {
      // Check if reference already exists
      const existing = await prisma.booking.findUnique({
        where: { reference: ref },
        select: { id: true }
      });
      
      // If no collision, return the reference
      if (!existing) {
        return ref;
      }
      
      // Collision detected, try again
      console.log(`Reference collision detected: ${ref}, retrying...`);
    } catch (error) {
      // Log unexpected errors but continue retrying
      console.error(`Error checking reference uniqueness: ${ref}`, error);
    }
  }
  
  // If we've exhausted all retries, throw an error
  throw new Error(`Could not generate unique reference after ${maxTries} attempts`);
}

/**
 * Alternative approach: Create a temporary booking to reserve the reference
 * Use this when you want to guarantee uniqueness during the creation process
 */
export async function reserveUniqueReference(prefix = "SV-", maxTries = 5): Promise<string> {
  for (let i = 0; i < maxTries; i++) {
    const ref = prefix + Math.random().toString(36).slice(2, 8).toUpperCase();
    
    try {
      // Create a minimal temporary booking to reserve the reference
      await prisma.booking.create({
        data: {
          reference: ref,
          // Minimal required fields for a valid booking
          pickupAddressId: "temp", // Will be updated later
          dropoffAddressId: "temp", // Will be updated later
          pickupPropertyId: "temp", // Will be updated later
          dropoffPropertyId: "temp", // Will be updated later
          scheduledAt: new Date(),
          estimatedDurationMinutes: 0,
          crewSize: "TWO",
          baseDistanceMiles: 0,
          distanceCostGBP: 0,
          accessSurchargeGBP: 0,
          weatherSurchargeGBP: 0,
          itemsSurchargeGBP: 0,
          crewMultiplierPercent: 0,
          availabilityMultiplierPercent: 0,
          totalGBP: 0,
          customerName: "Temporary",
          customerPhone: "+44000000000",
          customerPhoneNormalized: "44000000000",
          customerEmail: "temp@example.com",
          status: "DRAFT"
        },
        select: { id: true }
      });
      
      return ref;
    } catch (error: any) {
      // Check if it's a unique constraint violation
      if (error.message && /Unique constraint/.test(error.message)) {
        console.log(`Reference collision detected: ${ref}, retrying...`);
        continue;
      }
      
      // For other errors, throw immediately
      throw error;
    }
  }
  
  throw new Error(`Could not reserve unique reference after ${maxTries} attempts`);
}

/**
 * Generate a reference for testing/development purposes
 * Does NOT check uniqueness - use only in controlled environments
 */
export function generateTestReference(prefix = "SV-", suffix?: string): string {
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.random().toString(36).slice(2, 4).toUpperCase();
  const testSuffix = suffix ? `-${suffix}` : '';
  
  return `${prefix}${timestamp}${random}${testSuffix}`;
}
