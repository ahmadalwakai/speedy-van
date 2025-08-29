import { NextResponse } from 'next/server';
import { safeSendAutoSMS } from '@/lib/sms.config';
import { issueOtp } from '@/lib/otp';

/**
 * Send OTP endpoint
 * Generates and sends a 6-digit verification code via SMS
 */
export async function POST(request: Request) {
  try {
    const { phone, purpose = 'login' } = await request.json();
    
    if (!phone) {
      return NextResponse.json(
        { ok: false, error: 'Phone number is required' },
        { status: 400 }
      );
    }
    
    // Issue OTP with rate limiting and cooldown enforcement
    const { phoneMasked, expiresInMin, code } = await issueOtp(phone, purpose);
    
    // Send OTP via SMS (DO NOT log the actual code)
    await safeSendAutoSMS({
      type: "OTP",
      to: phone,
      data: { code }
    });
    
    console.log(`OTP sent to ${phoneMasked} for ${purpose}`);
    
    return NextResponse.json({
      ok: true,
      message: 'OTP sent successfully',
      phone: phoneMasked,
      expiresIn: `${expiresInMin} minutes`
    });
    
  } catch (error) {
    console.error('Error sending OTP:', error);
    
    // Handle rate limiting errors
    if (error instanceof Error && error.message.includes('Please wait')) {
      return NextResponse.json(
        { ok: false, error: error.message },
        { status: 429 }
      );
    }
    
    if (error instanceof Error && error.message.includes('Hourly limit exceeded')) {
      return NextResponse.json(
        { ok: false, error: error.message },
        { status: 429 }
      );
    }
    
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : 'Failed to send OTP'
      },
      { status: 500 }
    );
  }
}
