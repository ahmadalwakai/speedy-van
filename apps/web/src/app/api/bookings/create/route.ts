import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createUniqueReference } from '@/lib/ref';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { safeSendAutoSMS } from '@/lib/sms.config';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Mapping function to convert frontend property types to Prisma enum values
const mapPropertyTypeToPrisma = (frontendType: string): string => {
  const mapping: { [key: string]: string } = {
    // Uppercase values from PropertyDetailsStep
    'HOUSE': 'DETACHED',
    'FLAT': 'FLAT',
    'OFFICE': 'FLAT', // Map office to flat for now
    'WAREHOUSE': 'FLAT', // Map warehouse to flat for now
    'SHOP': 'FLAT', // Map shop to flat for now
    'OTHER': 'DETACHED', // Map other to detached for now
    // Lowercase values from EnhancedPropertyDetailsStep
    'house': 'DETACHED',
    'apartment': 'FLAT',
    'office': 'FLAT',
    'warehouse': 'FLAT',
    // Valid Prisma enum values
    'DETACHED': 'DETACHED',
    'SEMI_DETACHED': 'SEMI_DETACHED',
    'TERRACED': 'TERRACED',
    'BUNGALOW': 'BUNGALOW',
    'MAISONETTE': 'MAISONETTE',
    'COTTAGE': 'COTTAGE',
    'STUDIO': 'STUDIO'
  };
  
  return mapping[frontendType] || 'DETACHED';
};

export async function POST(request: NextRequest) {
  try {
    const bookingData = await request.json();
    
    // Check if user is authenticated
    const session = await getServerSession(authOptions);
    const customerId = session?.user?.id || null;
    
    console.log('📝 Creating new booking with data:', {
      customer: bookingData.customer,
      pickupAddress: bookingData.pickupAddress,
      dropoffAddress: bookingData.dropoffAddress,
      items: bookingData.items?.length || 0,
      totalAmount: bookingData.calculatedTotal,
      authenticatedUser: customerId ? 'Yes' : 'No'
    });

    // Validate required fields
    if (!bookingData.customer?.name || !bookingData.customer?.email || !bookingData.customer?.phone) {
      return NextResponse.json(
        { error: 'Missing required customer information' },
        { status: 400 }
      );
    }

    if (!bookingData.pickupAddress || !bookingData.dropoffAddress) {
      return NextResponse.json(
        { error: 'Missing pickup or dropoff address' },
        { status: 400 }
      );
    }

    // Generate unique booking reference
    const reference = await createUniqueReference('SV-');

    // Create pickup address
    const pickupAddress = await prisma.bookingAddress.create({
      data: {
        label: bookingData.pickupAddress.line1 || 'Pickup Address',
        postcode: bookingData.pickupAddress.postcode || '',
        lat: bookingData.pickupAddress.coordinates?.lat || 0,
        lng: bookingData.pickupAddress.coordinates?.lng || 0
      }
    });

    // Create dropoff address
    const dropoffAddress = await prisma.bookingAddress.create({
      data: {
        label: bookingData.dropoffAddress.line1 || 'Dropoff Address',
        postcode: bookingData.dropoffAddress.postcode || '',
        lat: bookingData.dropoffAddress.coordinates?.lat || 0,
        lng: bookingData.dropoffAddress.coordinates?.lng || 0,

      }
    });

    // Create pickup property details
    const pickupPropertyType = mapPropertyTypeToPrisma(bookingData.pickupProperty?.propertyType || 'DETACHED');
    console.log('📝 Mapping pickup property type:', {
      original: bookingData.pickupProperty?.propertyType,
      mapped: pickupPropertyType
    });
    
    const pickupProperty = await prisma.propertyDetails.create({
      data: {
        propertyType: pickupPropertyType as any,
        floors: bookingData.pickupProperty?.floor || 0,
        accessType: bookingData.pickupProperty?.hasLift ? 'WITH_LIFT' : 'WITHOUT_LIFT'
      }
    });

    // Create dropoff property details
    const dropoffPropertyType = mapPropertyTypeToPrisma(bookingData.dropoffProperty?.propertyType || 'DETACHED');
    console.log('📝 Mapping dropoff property type:', {
      original: bookingData.dropoffProperty?.propertyType,
      mapped: dropoffPropertyType
    });
    
    const dropoffProperty = await prisma.propertyDetails.create({
      data: {
        propertyType: dropoffPropertyType as any,
        floors: bookingData.dropoffProperty?.floor || 0,
        accessType: bookingData.dropoffProperty?.hasLift ? 'WITH_LIFT' : 'WITHOUT_LIFT'
      }
    });

    // Create the main booking
    const booking = await prisma.booking.create({
      data: {
        reference,
        status: 'PENDING_PAYMENT',
        scheduledAt: bookingData.date ? new Date(bookingData.date) : new Date(),
        estimatedDurationMinutes: 120, // Default 2 hours
        crewSize: 'TWO', // Default crew size
        baseDistanceMiles: 0, // Will be calculated
        distanceCostGBP: 0, // Will be calculated
        accessSurchargeGBP: 0, // Will be calculated
        weatherSurchargeGBP: 0, // Will be calculated
        itemsSurchargeGBP: 0, // Will be calculated
        crewMultiplierPercent: 0, // Will be calculated
        availabilityMultiplierPercent: 0, // Will be calculated
        totalGBP: bookingData.calculatedTotal || 0,
        
        // Customer information (using new structure)
        customerName: bookingData.customer.name,
        customerEmail: bookingData.customer.email,
        customerPhone: bookingData.customer.phone,
        customerPhoneNormalized: bookingData.customer.phone.replace(/^\+44/, '44').replace(/^0/, '44'),
        
        // Link to customer account if authenticated
        customerId: customerId,
        
        // Address references
        pickupAddressId: pickupAddress.id,
        dropoffAddressId: dropoffAddress.id,
        pickupPropertyId: pickupProperty.id,
        dropoffPropertyId: dropoffProperty.id,
        

        

      }
    });

    // Create booking items if any
    if (bookingData.items && bookingData.items.length > 0) {
      for (const item of bookingData.items) {
        await prisma.bookingItem.create({
          data: {
            bookingId: booking.id,
            name: item.name,
            quantity: item.quantity || 1,
            volumeM3: item.volume || 0,

          }
        });
      }
    }

    // Create audit log entry (only if user is authenticated)
    if (customerId) {
      await prisma.auditLog.create({
        data: {
          actorId: customerId,
          actorRole: 'customer',
          action: 'booking_created',
          targetType: 'booking',
          targetId: booking.id,
          userId: customerId,
          details: {
            reference: booking.reference,
            customerName: bookingData.customer.name,
            customerEmail: bookingData.customer.email,
            totalAmount: bookingData.calculatedTotal,
            itemsCount: bookingData.items?.length || 0,
            createdAt: new Date().toISOString(),
            linkedToAccount: 'Yes'
          }
        }
      });
    }

    console.log('✅ Booking created successfully:', {
      id: booking.id,
      reference: booking.reference,
      customer: bookingData.customer.name,
      total: bookingData.calculatedTotal,
      linkedToAccount: customerId ? 'Yes' : 'No'
    });

    // Send SMS notification for booking creation
    try {
      await safeSendAutoSMS({
        type: "BOOKING_CREATED",
        to: bookingData.customer.phone,
        data: { 
          name: bookingData.customer.name, 
          ref: booking.reference 
        }
      });
    } catch (smsError) {
      console.warn('⚠️ Failed to send booking creation SMS:', smsError);
      // Don't fail the booking creation if SMS fails
    }

    // Return the created booking with all details
    return NextResponse.json({
      success: true,
      booking: {
        id: booking.id,
        reference: booking.reference,
        status: booking.status,
        customer: {
          name: bookingData.customer.name,
          email: bookingData.customer.email,
          phone: bookingData.customer.phone
        },
        addresses: {
          pickup: {
            line1: bookingData.pickupAddress.line1,
            city: bookingData.pickupAddress.city,
            postcode: bookingData.pickupAddress.postcode,
            coordinates: bookingData.pickupAddress.coordinates
          },
          dropoff: {
            line1: bookingData.dropoffAddress.line1,
            city: bookingData.dropoffAddress.city,
            postcode: bookingData.dropoffAddress.postcode,
            coordinates: bookingData.dropoffAddress.coordinates
          }
        },
        properties: {
          pickup: {
            type: bookingData.pickupProperty?.propertyType,
            floor: bookingData.pickupProperty?.floor,
            hasLift: bookingData.pickupProperty?.hasLift
          },
          dropoff: {
            type: bookingData.dropoffProperty?.propertyType,
            floor: bookingData.dropoffProperty?.floor,
            hasLift: bookingData.dropoffProperty?.hasLift
          }
        },
        schedule: {
          date: bookingData.date,
          timeSlot: bookingData.timeSlot
        },
        items: bookingData.items || [],
        pricing: {
          basePrice: bookingData.basePrice || 0,
          extrasCost: bookingData.extrasCost || 0,
          vat: bookingData.vat || 0,
          total: bookingData.calculatedTotal || 0
        },
        createdAt: booking.createdAt,
        linkedToAccount: customerId ? true : false
      }
    });

  } catch (error) {
    console.error('❌ Error creating booking:', error);
    return NextResponse.json(
      { error: 'Failed to create booking', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
