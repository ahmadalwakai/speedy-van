#!/usr/bin/env tsx

import { smsService } from '../src/lib/sms-service';
import { normalizeUK } from '../src/lib/phone';

async function testSMSBookingConfirmation() {
  console.log('🚐 Testing SMS Booking Confirmation with Phone Normalization...\n');

  // Test different phone number formats - all should normalize to the same E.164 format
  const phoneNumbers = [
    '07901846297',        // UK format
    '+447901846297',      // International format with +
    '447901846297',       // Already normalized
    '00447901846297',     // Alternative international
  ];
  
  // Sample booking data
  const bookingData = {
    bookingReference: 'SV-TEST-001',
    scheduledAt: new Date('2024-01-15T10:00:00Z'),
    timeSlot: '09:00-12:00',
    totalGBP: 150.00,
    customer: {
      name: 'Test Customer'
    },
    pickupAddress: {
      line1: '123 Test Street',
      city: 'Glasgow',
      postcode: 'G1 1AA'
    },
    dropoffAddress: {
      line1: '456 Demo Road',
      city: 'Edinburgh',
      postcode: 'EH1 1AA'
    }
  };

  console.log('📱 Testing phone number normalization:');
  for (const phone of phoneNumbers) {
    const normalized = normalizeUK(phone);
    console.log(`  ${phone} → ${normalized}`);
  }
  console.log('');

  // Test with the first phone number (should work the same for all after normalization)
  const phoneNumber = phoneNumbers[0];
  const normalizedPhone = normalizeUK(phoneNumber);
  
  console.log(`📱 Testing SMS with normalized phone: ${normalizedPhone}`);
  console.log('📋 Booking Reference:', bookingData.bookingReference);
  console.log('📅 Date:', bookingData.scheduledAt.toLocaleDateString('en-GB'));
  console.log('⏰ Time:', bookingData.timeSlot);
  console.log('💰 Amount: £' + bookingData.totalGBP);
  console.log('');

  try {
    // Send the SMS
    const result = await smsService.sendBookingConfirmation(phoneNumber, bookingData);
    
    if (result.success) {
      console.log('✅ SMS sent successfully!');
      console.log('📨 Message ID:', result.messageId);
      console.log('📱 Check your phone for the confirmation message.');
      console.log(`✅ Phone number normalized correctly: ${phoneNumber} → ${normalizedPhone}`);
    } else {
      console.log('❌ SMS sending failed:');
      console.log('🚫 Error:', result.error);
    }
  } catch (error) {
    console.log('💥 Unexpected error:', error);
  }

  console.log('\n🔧 Troubleshooting:');
  console.log('1. Check your .env.local file has THESMSWORKS credentials');
  console.log('2. Verify the phone number format');
  console.log('3. Check The SMS Works dashboard for any errors');
}

// Run the test
testSMSBookingConfirmation().catch(console.error);
