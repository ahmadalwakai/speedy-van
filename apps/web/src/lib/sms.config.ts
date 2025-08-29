import { sendAutoSMS } from './auto-sms';

/**
 * SMS Configuration
 */
export const SMS_ENABLED = process.env.SMS_ENABLED !== "false";
export const SMS_SENDER = process.env.SMS_SENDER || "SpeedyVan";

/**
 * Safely sends an automated SMS with error handling and SMS_ENABLED check
 * @param evt - SMS event to send
 * @returns SMS result or { skipped: true } if SMS is disabled
 */
export async function safeSendAutoSMS(evt: Parameters<typeof sendAutoSMS>[0]) {
  if (!SMS_ENABLED) {
    console.log('SMS disabled, skipping notification:', evt.type);
    return { skipped: true };
  }
  
  try {
    const result = await sendAutoSMS(evt);
    console.log('SMS sent successfully:', evt.type, result);
    return result;
  } catch (e) {
    console.error("SMS error:", e);
    throw e;
  }
}
