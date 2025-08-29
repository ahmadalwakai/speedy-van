/**
 * SMS Template Names for automated notifications
 */
export type TemplateName = 
  | "BOOKING_CREATED" 
  | "BOOKING_CONFIRMED" 
  | "DRIVER_EN_ROUTE" 
  | "DELIVERY_COMPLETED" 
  | "PAYMENT_REMINDER" 
  | "OTP";

/**
 * SMS Message Templates
 * Each template is a function that takes data and returns a formatted message
 */
export const templates: Record<TemplateName, (d: Record<string, any>) => string> = {
  BOOKING_CREATED: (data) => 
    `Hi ${data.name}, we received your booking (#${data.ref}). We'll confirm soon.`,
  
  BOOKING_CONFIRMED: (data) => 
    `✅ Your booking #${data.ref} is confirmed for ${data.date} at ${data.time}.`,
  
  DRIVER_EN_ROUTE: (data) => 
    `🚚 Driver is en route for booking #${data.ref}. ETA ${data.eta}. Track: ${data.track}`,
  
  DELIVERY_COMPLETED: (data) => 
    `✅ Booking #${data.ref} completed. Invoice: ${data.invoice}`,
  
  PAYMENT_REMINDER: (data) => 
    `💳 Reminder: payment for booking #${data.ref} is due today. Pay here: ${data.payUrl}`,
  
  OTP: (data) => 
    `Your Speedy Van verification code is ${data.code}. It expires in 10 minutes.`
};

/**
 * Renders an SMS template with the provided data
 * @param name - Template name to use
 * @param data - Data object to populate template variables
 * @returns Rendered message string
 */
export function renderTemplate(name: TemplateName, data: Record<string, any>): string {
  const template = templates[name];
  if (!template) {
    throw new Error(`Unknown template: ${name}`);
  }
  
  return template(data);
}
