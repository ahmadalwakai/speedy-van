import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { smsService } from "@/lib/sms-service";
import { normalizeUK } from "@/lib/phone";

function generateCode(): string { return (Math.floor(100000 + Math.random() * 900000)).toString(); }

export async function POST(req: Request) {
  const { bookingId, channel, destination } = await req.json();
  if (!bookingId || !channel || !destination) return NextResponse.json({ error: 'missing parameters' }, { status: 400 });

  const code = generateCode();
  const now = new Date();
  const expiry = new Date(now.getTime() + 10 * 60 * 1000);

  await prisma.booking.update({
    where: { id: bookingId },
    data: { otpCode: code, otpChannel: channel, otpExpiresAt: expiry, otpLastSentAt: now, otpSendCount: { increment: 1 } as any },
  } as any);

  // Send OTP via appropriate channel
  if (channel === 'sms') {
    try {
      console.log('📱 Sending SMS OTP to:', destination);
      
      // Normalize phone number to UK E.164 format
      const normalizedPhone = normalizeUK(destination);
      console.log('📱 Normalized phone for SMS:', normalizedPhone);
      
      const smsResult = await smsService.sendOTP(destination, code); // SMS service will normalize internally
      
      if (smsResult.success) {
        console.log('✅ SMS OTP sent successfully:', smsResult.messageId);
        const masked = destination.replace(/.(?=.{2})/g, '*');
        return NextResponse.json({ 
          sent: true, 
          channel, 
          destination: masked,
          messageId: smsResult.messageId 
        });
      } else {
        console.error('❌ SMS OTP sending failed:', smsResult.error);
        return NextResponse.json({ 
          error: 'Failed to send SMS OTP: ' + smsResult.error 
        }, { status: 500 });
      }
    } catch (error) {
      console.error('❌ Error sending SMS OTP:', error);
      return NextResponse.json({ 
        error: 'Failed to send SMS OTP' 
      }, { status: 500 });
    }
  } else if (channel === 'email') {
    // TODO: Implement email OTP sending
    console.log('📧 Email OTP sending not yet implemented');
    const masked = destination.replace(/.(?=.{2})/g, '*');
    return NextResponse.json({ sent: true, channel, destination: masked });
  }

  // Fallback for unsupported channels
  const masked = destination.replace(/.(?=.{2})/g, '*');
  return NextResponse.json({ sent: true, channel, destination: masked });
}


