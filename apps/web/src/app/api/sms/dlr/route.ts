import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * SMS Delivery Report (DLR) Webhook
 * Receives delivery status updates from The SMS Works API
 */
export async function POST(request: Request) {
  try {
    const payload = await request.json();
    
    // Log the DLR payload for debugging
    console.log('📱 SMS DLR received:', payload);
    
    // Verify minimal payload structure
    if (!payload.messageid || !payload.status) {
      console.warn('Invalid DLR payload received:', payload);
      return NextResponse.json({ ok: true, warning: 'Invalid payload' });
    }
    
    // Extract DLR data
    const dlrData = {
      messageId: payload.messageid,
      status: payload.status,
      statusCode: payload.statuscode,
      deliveredAt: payload.deliveredts,
      errorCode: payload.errorcode,
      errorMessage: payload.errormessage,
      receivedAt: new Date().toISOString()
    };
    
    // Store DLR data to database
    await prisma.smsDlr.upsert({
      where: { messageId: dlrData.messageId },
      update: {
        status: dlrData.status,
        statusCode: dlrData.statusCode,
        errorCode: dlrData.errorCode,
        deliveredTs: dlrData.deliveredAt,
        payload: payload
      },
      create: {
        messageId: dlrData.messageId,
        destination: payload.destination || 'unknown',
        status: dlrData.status,
        statusCode: dlrData.statusCode,
        errorCode: dlrData.errorCode,
        deliveredTs: dlrData.deliveredAt,
        messageParts: payload.messageparts || 1,
        payload: payload
      }
    });
    
    console.log('📱 SMS DLR processed and stored:', dlrData.messageId);
    
    // Always return 200 OK to acknowledge receipt
    return NextResponse.json({ 
      ok: true, 
      message: 'DLR received',
      messageId: dlrData.messageId,
      status: dlrData.status
    });
    
  } catch (error) {
    console.error('Error processing SMS DLR:', error);
    
    // Even on error, return 200 to prevent webhook retries
    return NextResponse.json({ 
      ok: true, 
      error: 'Error processing DLR but acknowledged'
    });
  }
}
