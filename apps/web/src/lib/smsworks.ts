import jwt from 'jsonwebtoken';

/**
 * Generates a JWT token for The SMS Works API authentication
 * @returns JWT token string
 */
export function getSmsWorksJwt(): string {
  const key = process.env.SMSWORKS_KEY;
  const secret = process.env.SMSWORKS_SECRET;
  
  if (!key || !secret) {
    throw new Error('SMSWORKS_KEY and SMSWORKS_SECRET must be configured');
  }
  
  return jwt.sign(
    { key },
    secret,
    { 
      algorithm: 'HS256',
      expiresIn: '12h'
    }
  );
}

/**
 * Normalizes UK phone numbers to E.164 format without "+"
 * @param msisdn - Phone number to normalize
 * @returns Normalized phone number string
 */
export function normalizeUK(msisdn: string): string {
  // Remove all non-digits
  const digits = msisdn.replace(/\D/g, '');
  
  // If it starts with "44", keep it as-is
  if (digits.startsWith('44')) {
    return digits;
  }
  
  // If it starts with "0", replace leading 0 with "44"
  if (digits.startsWith('0')) {
    return '44' + digits.substring(1);
  }
  
  // Otherwise return digits as-is
  return digits;
}

/**
 * Sends an SMS message using The SMS Works API
 * @param to - Recipient phone number
 * @param message - Message content
 * @param sender - Sender name (defaults to "SpeedyVan")
 * @returns API response data
 */
export async function sendSMS(
  to: string, 
  message: string, 
  sender: string = "SpeedyVan"
): Promise<any> {
  const maxRetries = 3;
  let lastError: Error | null = null;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      // Normalize the phone number
      const normalizedPhone = normalizeUK(to);
      
      // Generate JWT token
      const token = getSmsWorksJwt();
      
      // Prepare payload
      const payload = {
        sender,
        destination: normalizedPhone,
        content: message
      };
      
      // Send POST request to The SMS Works API
      const response = await fetch('https://api.thesmsworks.co.uk/v1/message/send', {
        method: 'POST',
        headers: {
          'Authorization': `JWT ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        
        // Don't retry on 4xx errors (client errors)
        if (response.status >= 400 && response.status < 500) {
          throw new Error(`SMS API error: ${response.status} - ${errorText}`);
        }
        
        // Retry on 5xx errors (server errors)
        if (response.status >= 500) {
          lastError = new Error(`SMS API error: ${response.status} - ${errorText}`);
          
          if (attempt < maxRetries) {
            const delay = Math.pow(2, attempt) * 1000; // Exponential backoff: 2s, 4s, 8s
            console.log(`SMS attempt ${attempt} failed, retrying in ${delay}ms...`);
            await new Promise(resolve => setTimeout(resolve, delay));
            continue;
          }
        }
        
        throw new Error(`SMS API error: ${response.status} - ${errorText}`);
      }
      
      // Success - return response
      const result = await response.json();
      if (attempt > 1) {
        console.log(`SMS sent successfully on attempt ${attempt}`);
      }
      return result;
      
    } catch (error) {
      lastError = error as Error;
      
      if (attempt < maxRetries) {
        console.warn(`SMS attempt ${attempt} failed:`, error);
        continue;
      }
    }
  }
  
  // All retries exhausted
  console.error(`SMS sending failed after ${maxRetries} attempts:`, lastError);
  throw lastError || new Error('SMS sending failed');
}
