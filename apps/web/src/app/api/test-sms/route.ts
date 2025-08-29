import { NextResponse } from 'next/server';
import { sendAutoSMS } from '../../../lib/auto-sms';

export async function POST() {
  try {
    // Test the automated SMS system with a booking confirmation
    const result = await sendAutoSMS({
      type: "BOOKING_CONFIRMED",
      to: "447901846297", // Test UK number
      data: {
        ref: "SV-TEST-001",
        date: "2024-01-15",
        time: "2:30 PM"
      }
    });

    return NextResponse.json({ 
      ok: true, 
      data: result,
      message: "Test SMS sent successfully using automated system"
    });

  } catch (error) {
    console.error('Automated SMS test failed:', error);
    
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
