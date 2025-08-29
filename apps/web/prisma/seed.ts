import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Clean existing data
  await prisma.bookingItem.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.bookingAddress.deleteMany();
  await prisma.propertyDetails.deleteMany();

  // Create sample addresses
  const pickupAddress = await prisma.bookingAddress.create({
    data: {
      label: '123 High Street, London, SW1A 1AA',
      postcode: 'SW1A 1AA',
      lat: 51.5074,
      lng: -0.1278,
    },
  });

  const dropoffAddress = await prisma.bookingAddress.create({
    data: {
      label: '456 Oxford Street, London, W1C 1AP',
      postcode: 'W1C 1AP',
      lat: 51.5154,
      lng: -0.1419,
    },
  });

  // Create property details
  const pickupProperty = await prisma.propertyDetails.create({
    data: {
      propertyType: 'FLAT',
      accessType: 'WITH_LIFT',
      floors: 3,
    },
  });

  const dropoffProperty = await prisma.propertyDetails.create({
    data: {
      propertyType: 'DETACHED',
      accessType: 'WITHOUT_LIFT',
      floors: 0,
    },
  });

  // Create a sample booking
  const booking = await prisma.booking.create({
    data: {
      reference: 'SV-123456',
      pickupAddress: {
        create: {
          label: '123 Main Street, London, UK',
          postcode: 'SW1A 1AA',
          lat: 51.5074,
          lng: -0.1278,
        }
      },
      dropoffAddress: {
        create: {
          label: '456 Oak Avenue, London, UK',
          postcode: 'SW1A 1AA',
          lat: 51.5074,
          lng: -0.1278,
        }
      },
      pickupProperty: {
        create: {
          propertyType: 'FLAT',
          accessType: 'WITHOUT_LIFT',
          floors: 0,
        }
      },
      dropoffProperty: {
        create: {
          propertyType: 'FLAT',
          accessType: 'WITHOUT_LIFT',
          floors: 0,
        }
      },
      scheduledAt: new Date('2024-09-15T10:00:00Z'),
      estimatedDurationMinutes: 180,
      crewSize: 'TWO',
      baseDistanceMiles: 2.5,
      distanceCostGBP: 1500, // £15.00
      accessSurchargeGBP: 500, // £5.00 (3rd floor + no lift at dropoff)
      weatherSurchargeGBP: 0,
      itemsSurchargeGBP: 800, // £8.00 (based on volume)
      crewMultiplierPercent: 0, // 2 crew is standard
      availabilityMultiplierPercent: 0, // standard availability
      totalGBP: 2800, // £28.00 total
      customerName: 'John Smith',
      customerPhone: '+447700900000',
      customerPhoneNormalized: '447700900000',
      customerEmail: 'john.smith@example.com',
      status: 'DRAFT',
    },
  });

  // Create sample booking items
  const items = [
    {
      name: 'Large Sofa',
      volumeM3: 2.5,
      quantity: 1,
    },
    {
      name: 'Dining Table',
      volumeM3: 1.2,
      quantity: 1,
    },
    {
      name: 'Bed Frame',
      volumeM3: 0.8,
      quantity: 2,
    },
    {
      name: 'Wardrobe',
      volumeM3: 1.5,
      quantity: 1,
    },
    {
      name: 'Books & Boxes',
      volumeM3: 0.5,
      quantity: 8,
    },
  ];

  for (const item of items) {
    await prisma.bookingItem.create({
      data: {
        ...item,
        bookingId: booking.id,
      },
    });
  }

  console.log('✅ Sample booking created:');
  console.log(`   Reference: ${booking.reference}`);
  console.log(`   Customer: ${booking.customerName}`);
  console.log(`   Total: £${(booking.totalGBP / 100).toFixed(2)}`);
  console.log(`   Items: ${items.length} different types`);
  console.log(`   Pickup: ${pickupAddress.label}`);
  console.log(`   Dropoff: ${dropoffAddress.label}`);

  // Create a confirmed booking for testing
  const confirmedBooking = await prisma.booking.create({
    data: {
      reference: 'SV-789012',
      pickupAddress: {
        create: {
          label: '789 High Street, London, UK',
          postcode: 'SW1A 1AA',
          lat: 51.5074,
          lng: -0.1278,
        }
      },
      dropoffAddress: {
        create: {
          label: '321 Park Lane, London, UK',
          postcode: 'SW1A 1AA',
          lat: 51.5074,
          lng: -0.1278,
        }
      },
      pickupProperty: {
        create: {
          propertyType: 'DETACHED',
          accessType: 'WITH_LIFT',
          floors: 0,
        }
      },
      dropoffProperty: {
        create: {
          propertyType: 'DETACHED',
          accessType: 'WITH_LIFT',
          floors: 0,
        }
      },
      scheduledAt: new Date('2024-09-10T14:00:00Z'),
      estimatedDurationMinutes: 120,
      crewSize: 'THREE',
      baseDistanceMiles: 1.8,
      distanceCostGBP: 1200, // £12.00
      accessSurchargeGBP: 300, // £3.00
      weatherSurchargeGBP: 0,
      itemsSurchargeGBP: 600, // £6.00
      crewMultiplierPercent: 20, // +20% for 3 crew
      availabilityMultiplierPercent: 0,
      totalGBP: 2520, // £25.20 total
      customerName: 'Sarah Johnson',
      customerPhone: '+447700900001',
      customerPhoneNormalized: '447700900001',
      customerEmail: 'sarah.johnson@example.com',
      status: 'CONFIRMED',
      stripePaymentIntentId: 'pi_live_confirmed_123',
      paidAt: new Date('2024-09-08T10:30:00Z'),
    },
  });

  // Add items to confirmed booking
  const confirmedItems = [
    { name: 'Office Desk', volumeM3: 1.8, quantity: 1 },
    { name: 'Office Chair', volumeM3: 0.6, quantity: 2 },
    { name: 'Filing Cabinet', volumeM3: 0.9, quantity: 1 },
  ];

  for (const item of confirmedItems) {
    await prisma.bookingItem.create({
      data: {
        ...item,
        bookingId: confirmedBooking.id,
      },
    });
  }

  console.log('✅ Confirmed booking created:');
  console.log(`   Reference: ${confirmedBooking.reference}`);
  console.log(`   Status: ${confirmedBooking.status}`);
  console.log(`   Paid: ${confirmedBooking.paidAt?.toLocaleDateString()}`);

  console.log('\n🎯 Database seeded successfully!');
  console.log('   Run the smoke tests to verify everything works.');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
