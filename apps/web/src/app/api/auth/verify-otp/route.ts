import { NextResponse } from 'next/server';
import { verifyOtp } from '@/lib/otp';

/**
 * Verify OTP endpoint
 * Validates a 6-digit verification code with attempt tracking
 */
export async function POST(request: Request) {
  try {
    const { phone, purpose = 'login', code } = await request.json();
    
    if (!phone || !code) {
      return NextResponse.json(
        { ok: false, error: 'Phone number and code are required' },
        { status: 400 }
      );
    }
    
    // Verify the OTP code
    const isValid = await verifyOtp(phone, purpose, code);
    
    if (isValid) {
      // TODO: Create session / mark user verified
      // Example: await createUserSession(userId, phone)
      
      return NextResponse.json({
        ok: true,
        message: 'OTP verified successfully'
      });
    } else {
      return NextResponse.json(
        {
          ok: false,
          reason: 'Invalid or expired code'
        },
        { status: 400 }
      );
    }
    
  } catch (error) {
    console.error('Error verifying OTP:', error);
    
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : 'Failed to verify OTP'
      },
      { status: 500 }
    );
  }
}
