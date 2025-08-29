import { NextRequest, NextResponse } from 'next/server';
import { smsService } from '@/lib/sms-service';
import { normalizeUK, isValidUKMobile } from '@/lib/phone';

export async function POST(request: NextRequest) {
  try {
    const { bookingData, phoneNumber } = await request.json();

    if (!bookingData || !phoneNumber) {
      return NextResponse.json(
        { error: 'Booking data and phone number are required' },
        { status: 400 }
      );
    }

    // Validate phone number format using the utility function
    if (!isValidUKMobile(phoneNumber)) {
      return NextResponse.json(
        { error: 'Invalid UK mobile number format. Use +447901846297 or 07901846297' },
        { status: 400 }
      );
    }

    // Normalize phone number to UK E.164 format
    const normalizedPhone = normalizeUK(phoneNumber);
    console.log('📱 Original phone:', phoneNumber);
    console.log('📱 Normalized phone:', normalizedPhone);
    console.log('📋 Booking data:', JSON.stringify(bookingData, null, 2));

    // Send SMS via The SMS Works (will use normalized phone internally)
    const smsResult = await smsService.sendBookingConfirmation(phoneNumber, bookingData);

    if (smsResult.success) {
      console.log('✅ SMS sent successfully:', smsResult.messageId);
      
      return NextResponse.json({
        success: true,
        messageId: smsResult.messageId,
        message: 'SMS confirmation sent successfully',
        sentTo: normalizedPhone,
        originalPhone: phoneNumber,
        timestamp: new Date().toISOString(),
      });
    } else {
      console.error('❌ SMS sending failed:', smsResult.error);
      
      return NextResponse.json({
        success: false,
        error: smsResult.error || 'Failed to send SMS',
        timestamp: new Date().toISOString(),
      }, { status: 500 });
    }

  } catch (error) {
    console.error('❌ Error in SMS confirmation API:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      timestamp: new Date().toISOString(),
    }, { status: 500 });
  }
}

// Test endpoint for development
export async function GET() {
  return NextResponse.json({
    message: 'SMS Confirmation API is running',
    endpoints: {
      POST: '/api/sms/send-confirmation',
      'Required Body': {
        bookingData: 'object - booking information',
        phoneNumber: 'string - UK phone number (+447901846297 or 07901846297)'
      }
    },
    example: {
      bookingData: {
        bookingReference: 'SV-12345',
        scheduledAt: '2024-01-15T10:00:00Z',
        timeSlot: '09:00-12:00',
        totalGBP: 150.00
      },
      phoneNumber: '07901846297'
    },
    note: 'Phone numbers are automatically normalized to UK E.164 format (447901846297) for SMS delivery'
  });
}
