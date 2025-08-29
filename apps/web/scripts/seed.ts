import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Clean existing data (only if explicitly requested)
  const shouldClean = process.argv.includes('--clean');
  if (shouldClean) {
    console.log('🧹 Cleaning existing data...');
    await prisma.bookingItem.deleteMany();
    await prisma.booking.deleteMany();
    await prisma.bookingAddress.deleteMany();
    await prisma.propertyDetails.deleteMany();
  } else {
    console.log('♻️  Running in upsert mode (idempotent)');
  }

  // Create sample addresses (use known IDs for upsert)
  const pickupAddress = await prisma.bookingAddress.upsert({
    where: { id: 'seed-pickup-address' },
    update: {
      label: '123 High Street, London, SW1A 1AA',
      postcode: 'SW1A 1AA',
      lat: 51.5074,
      lng: -0.1278,
    },
    create: {
      id: 'seed-pickup-address',
      label: '123 High Street, London, SW1A 1AA',
      postcode: 'SW1A 1AA',
      lat: 51.5074,
      lng: -0.1278,
    },
  });

  const dropoffAddress = await prisma.bookingAddress.upsert({
    where: { id: 'seed-dropoff-address' },
    update: {
      label: '456 Oxford Street, London, W1C 1AP',
      postcode: 'W1C 1AP',
      lat: 51.5154,
      lng: -0.1419,
    },
          create: {
        id: 'seed-dropoff-address',
        label: '456 Oxford Street, London, W1C 1AP',
        postcode: 'W1C 1AP',
        lat: 51.5154,
        lng: -0.1419,
      },
  });

  // Create property details (upsert by unique combination)
  const pickupProperty = await prisma.propertyDetails.upsert({
    where: { 
      id: 'seed-pickup-property' // Use a known ID for upsert
    },
    update: {
      propertyType: 'FLAT',
      accessType: 'WITH_LIFT',
      floors: 3,
    },
    create: {
      id: 'seed-pickup-property',
      propertyType: 'FLAT',
      accessType: 'WITH_LIFT',
      floors: 3,
    },
  });

  const dropoffProperty = await prisma.propertyDetails.upsert({
    where: { 
      id: 'seed-dropoff-property' // Use a known ID for upsert
    },
    update: {
      propertyType: 'DETACHED',
      accessType: 'WITHOUT_LIFT',
      floors: 0,
    },
    create: {
      id: 'seed-dropoff-property',
      propertyType: 'DETACHED',
      accessType: 'WITHOUT_LIFT',
      floors: 0,
    },
  });

  // Create a sample booking (upsert by reference)
  const booking = await prisma.booking.upsert({
    where: { reference: 'SV-123456' },
    update: {
      // Update key fields that might change
      totalGBP: 2800,
      status: 'DRAFT',
      scheduledAt: new Date('2024-09-15T10:00:00Z'),
    },
    create: {
      reference: 'SV-123456',
      pickupAddressId: pickupAddress.id,
      dropoffAddressId: dropoffAddress.id,
      pickupPropertyId: pickupProperty.id,
      dropoffPropertyId: dropoffProperty.id,
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

  // Create or update items for the sample booking
  for (const item of items) {
    await prisma.bookingItem.upsert({
      where: {
        // Use a combination of booking ID and item name for upsert
        id: `seed-${booking.id}-${item.name.toLowerCase().replace(/\s+/g, '-')}`
      },
      update: {
        quantity: item.quantity,
        volumeM3: item.volumeM3,
      },
      create: {
        id: `seed-${booking.id}-${item.name.toLowerCase().replace(/\s+/g, '-')}`,
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

  // Create a confirmed booking for testing (upsert by reference)
  const confirmedBooking = await prisma.booking.upsert({
    where: { reference: 'SV-789012' },
    update: {
      // Update key fields that might change
      totalGBP: 2520,
      status: 'CONFIRMED',
      paidAt: new Date('2024-09-08T10:30:00Z'),
    },
    create: {
      reference: 'SV-789012',
      pickupAddressId: pickupAddress.id,
      dropoffAddressId: dropoffAddress.id,
      pickupPropertyId: pickupProperty.id,
      dropoffPropertyId: dropoffProperty.id,
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
      stripePaymentIntentId: 'pi_test_confirmed_123',
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
    await prisma.bookingItem.upsert({
      where: {
        // Use a combination of booking ID and item name for upsert
        id: `seed-${confirmedBooking.id}-${item.name.toLowerCase().replace(/\s+/g, '-')}`
      },
      update: {
        quantity: item.quantity,
        volumeM3: item.volumeM3,
      },
      create: {
        id: `seed-${confirmedBooking.id}-${item.name.toLowerCase().replace(/\s+/g, '-')}`,
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
  console.log('\n💡 Usage:');
  console.log('   npm run db:seed          # Upsert mode (idempotent)');
  console.log('   npm run db:seed --clean  # Clean and recreate all data');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });


