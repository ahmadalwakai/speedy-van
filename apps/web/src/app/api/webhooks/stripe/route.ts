import { NextRequest, NextResponse } from 'next/server';
import { verifyWebhookSignature } from '@/lib/stripe';
import { prisma } from '@/lib/prisma';
import { sendAdminNotification } from '@/lib/notifications';
import { sendDriverNotification } from '@/lib/driver-notifications';
import { generateUniqueUnifiedBookingId } from '@/lib/booking-id';
import { createInvoiceForBooking } from '@/lib/invoices';
import { safeSendAutoSMS } from '@/lib/sms.config';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get('stripe-signature');

    if (!signature) {
      console.error('❌ Stripe webhook signature missing');
      return NextResponse.json(
        { error: 'Webhook signature missing' },
        { status: 400 }
      );
    }

    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!webhookSecret) {
      console.error('❌ Stripe webhook secret not configured');
      return NextResponse.json(
        { error: 'Webhook secret not configured' },
        { status: 500 }
      );
    }

    let event;
    try {
      event = verifyWebhookSignature(body, signature, webhookSecret);
    } catch (error) {
      console.error('❌ Webhook signature verification failed:', error);
      return NextResponse.json(
        { error: 'Invalid webhook signature' },
        { status: 400 }
      );
    }

    console.log('✅ Stripe webhook received:', event.type);

    // Handle different event types
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutSessionCompleted(event.data.object);
        break;
      
      case 'checkout.session.expired':
        await handleCheckoutSessionExpired(event.data.object);
        break;
      
      case 'payment_intent.succeeded':
        await handlePaymentIntentSucceeded(event.data.object);
        break;
      
      case 'payment_intent.payment_failed':
        await handlePaymentIntentFailed(event.data.object);
        break;
      
      case 'payment_intent.canceled':
        await handlePaymentIntentCanceled(event.data.object);
        break;
      
      case 'charge.refunded':
        await handleChargeRefunded(event.data.object);
        break;
      
      default:
        console.log('ℹ️ Unhandled event type:', event.type);
    }

    return NextResponse.json({ received: true });

  } catch (error) {
    console.error('❌ Webhook handler error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
}

async function handleCheckoutSessionCompleted(session: any) {
  try {
    console.log('💰 Checkout session completed:', session.id);
    
    const bookingId = session.metadata?.bookingId;
    if (!bookingId) {
      console.warn('⚠️ No booking ID in session metadata');
      return;
    }

    // Update booking status to confirmed
    await prisma.booking.update({
      where: { id: bookingId },
      data: {
        status: 'CONFIRMED',
        paidAt: new Date(),
        stripePaymentIntentId: session.payment_intent,
      },
    });

    console.log('✅ Booking confirmed:', { bookingId });
    
    // Send SMS confirmation to customer
    try {
      const booking = await prisma.booking.findUnique({
        where: { id: bookingId },
        select: { customerPhone: true, reference: true, scheduledAt: true }
      });
      
      if (booking?.customerPhone) {
        await safeSendAutoSMS({
          type: "BOOKING_CONFIRMED",
          to: booking.customerPhone,
          data: { 
            ref: booking.reference,
            date: booking.scheduledAt ? new Date(booking.scheduledAt).toLocaleDateString('en-GB') : 'TBD',
            time: booking.scheduledAt ? new Date(booking.scheduledAt).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }) : 'TBD'
          }
        });
      }
    } catch (smsError) {
      console.warn('⚠️ Failed to send booking confirmation SMS:', smsError);
      // Don't fail the webhook if SMS fails
    }
    
    // Get the complete booking data to send admin notification
    const completeBooking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        pickupAddress: true,
        dropoffAddress: true,
        pickupProperty: true,
        dropoffProperty: true,
        items: true,
        Assignment: {
          include: {
            Driver: true
          }
        }
      }
    });

    if (completeBooking) {
      // Send admin notification with complete booking details
      await sendAdminNotification(completeBooking, session);
      
      // Send driver notifications if any drivers are assigned
      if (completeBooking.Assignment?.Driver) {
        await sendDriverNotification(completeBooking, completeBooking.Assignment.Driver.id, 'job_offer');
      }
      
      // Create invoice for the paid booking
      try {
        await createInvoiceForBooking({
          bookingId: completeBooking.id,
          stripePaymentIntentId: session.payment_intent,
          paidAt: new Date()
        });
        console.log('✅ Invoice created for booking:', completeBooking.reference);
      } catch (invoiceError) {
        console.error('❌ Error creating invoice:', invoiceError);
        // Don't fail the webhook if invoice creation fails
      }
    }
    
    // TODO: Send confirmation email to customer
    // TODO: Notify driver
    // TODO: Update availability
    
  } catch (error) {
    console.error('❌ Error handling checkout session completed:', error);
  }
}

async function handleCheckoutSessionExpired(session: any) {
  try {
    console.log('⏰ Checkout session expired:', session.id);
    
    const bookingId = session.metadata?.bookingId;
    if (!bookingId) {
      console.warn('⚠️ No booking ID in session metadata');
      return;
    }

    // Find and update the booking status to cancelled
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
    });

    if (booking && !['CANCELLED', 'COMPLETED'].includes(booking.status)) {
      await prisma.booking.update({
        where: { id: bookingId },
        data: {
          status: 'CANCELLED',
        },
      });

      // Create a cancellation log entry
      await prisma.auditLog.create({
        data: {
          actorId: 'system',
          actorRole: 'system',
          action: 'booking_cancelled',
          targetType: 'booking',
          targetId: booking.id,
          userId: booking.customerId,
          details: {
            reason: 'Checkout session expired',
            cancelledAt: new Date().toISOString(),
            previousStatus: booking.status,
            source: 'stripe_session_expired'
          }
        }
      });

      console.log('🚫 Booking cancelled due to expired session:', bookingId);
    }
  } catch (error) {
    console.error('❌ Error handling checkout session expired:', error);
  }
}

async function handlePaymentIntentSucceeded(paymentIntent: any) {
  try {
    console.log('💰 Payment intent succeeded:', paymentIntent.id);
    
    // Find booking by payment intent ID
    const booking = await prisma.booking.findFirst({
      where: { stripePaymentIntentId: paymentIntent.id },
    });

    if (booking) {
      await prisma.booking.update({
        where: { id: booking.id },
        data: {
          status: 'CONFIRMED',
          paidAt: new Date(),
        },
      });

      console.log('✅ Booking payment confirmed:', booking.id);
    }
    
  } catch (error) {
    console.error('❌ Error handling payment intent succeeded:', error);
  }
}

async function handlePaymentIntentFailed(paymentIntent: any) {
  try {
    console.log('❌ Payment intent failed:', paymentIntent.id);
    
    const booking = await prisma.booking.findFirst({
      where: { stripePaymentIntentId: paymentIntent.id },
    });

    if (booking) {
      await prisma.booking.update({
        where: { id: booking.id },
        data: {
          status: 'CANCELLED',
        },
      });

      console.log('⚠️ Booking payment failed:', booking.id);
      
      // TODO: Send failure notification to customer
      // TODO: Update availability
    }
    
  } catch (error) {
    console.error('❌ Error handling payment intent failed:', error);
  }
}

async function handlePaymentIntentCanceled(paymentIntent: any) {
  try {
    console.log('🚫 Payment intent canceled:', paymentIntent.id);
    
    const booking = await prisma.booking.findFirst({
      where: { stripePaymentIntentId: paymentIntent.id },
    });

    if (booking) {
      await prisma.booking.update({
        where: { id: booking.id },
        data: {
          status: 'CANCELLED',
        },
      });

      console.log('🚫 Booking canceled:', booking.id);
      
      // TODO: Send cancellation notification
      // TODO: Update availability
    }
    
  } catch (error) {
    console.error('❌ Error handling payment intent canceled:', error);
  }
}

async function handleChargeRefunded(charge: any) {
  try {
    console.log('💸 Charge refunded:', charge.id);
    
    // Find booking by payment intent ID
    const booking = await prisma.booking.findFirst({
      where: { stripePaymentIntentId: charge.payment_intent },
    });

    if (booking) {
      await prisma.booking.update({
        where: { id: booking.id },
        data: {
          status: 'CANCELLED',
        },
      });

      console.log('💸 Booking refunded:', booking.id);
      
      // TODO: Send refund notification
      // TODO: Update availability
    }
    
  } catch (error) {
    console.error('❌ Error handling charge refunded:', error);
  }
}
