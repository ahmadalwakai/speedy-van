import { sendSMS } from './smsworks';
import { renderTemplate, TemplateName } from './sms-templates';

/**
 * SMS Event types for automated notifications
 */
export type Event = {
  type: TemplateName;
  to: string;
  data: Record<string, any>;
};

/**
 * Sends an automated SMS notification based on event type and data
 * @param evt - Event object containing type, recipient, and data
 * @returns SMS API response
 */
export async function sendAutoSMS(evt: Event): Promise<any> {
  try {
    // Render the message template with the provided data
    const message = renderTemplate(evt.type, evt.data);
    
    // Send the SMS message
    const result = await sendSMS(evt.to, message);
    
    return result;
  } catch (error) {
    console.error(`Failed to send auto SMS for event ${evt.type}:`, error);
    throw error;
  }
}

/**
 * Usage Examples:
 * 
 * // Booking creation notification
 * await sendAutoSMS({ 
 *   type: "BOOKING_CREATED", 
 *   to: "+447901846297", 
 *   data: { name: "John", ref: "SV-2024-001" } 
 * });
 * 
 * // OTP verification
 * await sendAutoSMS({ 
 *   type: "OTP", 
 *   to: "07901846297", 
 *   data: { code: "123456" } 
 * });
 * 
 * // Payment reminder
 * await sendAutoSMS({ 
 *   type: "PAYMENT_REMINDER", 
 *   to: "447901846297", 
 *   data: { ref: "SV-2024-001", payUrl: "https://speedy-van.co.uk/pay" } 
 * });
 * 
 * // Driver en route
 * await sendAutoSMS({ 
 *   type: "DRIVER_EN_ROUTE", 
 *   to: "+447901846297", 
 *   data: { ref: "SV-2024-001", eta: "2:30 PM", track: "https://speedy-van.co.uk/track" } 
 * });
 */
