import { normalizeUK } from './phone';

interface SMSMessage {
  to: string;
  message: string;
  from?: string;
}

interface SMSResponse {
  success: boolean;
  messageId?: string;
  error?: string;
}

class SMSService {
  private apiKey: string;
  private secret: string;
  private jwt: string;
  private baseUrl = 'https://api.thesmsworks.co.uk';

  constructor() {
    this.apiKey = process.env.THESMSWORKS_KEY || '';
    this.secret = process.env.THESMSWORKS_SECRET || '';
    this.jwt = process.env.THESMSWORKS_JWT || '';
    
    if (!this.apiKey || !this.secret) {
      console.warn('SMS service not properly configured. Missing API key or secret.');
    }
  }

  async sendSMS(smsData: SMSMessage): Promise<SMSResponse> {
    try {
      if (!this.apiKey || !this.secret) {
        throw new Error('SMS service not configured - missing API key or secret');
      }

      // Normalize phone number to UK E.164 format without "+" sign
      const normalizedPhone = normalizeUK(smsData.to);
      
      console.log('🔑 Using API Key:', this.apiKey.substring(0, 8) + '...');
      console.log('📤 Original phone:', smsData.to);
      console.log('📤 Normalized phone:', normalizedPhone);
      console.log('📝 Message:', smsData.message.substring(0, 50) + '...');

      // Use the correct JWT authentication method for The SMS Works
      let response: Response;
      let method = 'unknown';

      // Method 1: JWT token in header (CORRECT METHOD)
      if (this.jwt) {
        console.log('🔐 Using JWT authentication with correct header format...');
        try {
          response = await fetch(`${this.baseUrl}/v1/message/send`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `JWT ${this.jwt}`, // CORRECT: JWT prefix, not Bearer
            },
            body: JSON.stringify({
              to: normalizedPhone,
              content: smsData.message,
              from: smsData.from || 'SpeedyVan',
            }),
          });
          method = 'JWT with JWT prefix';
        } catch (e) {
          console.log('❌ JWT authentication failed:', e);
        }
      }

      // Method 2: API key + secret in headers (fallback)
      if (!response || response.status === 401) {
        console.log('🔑 Trying API key + secret authentication...');
        try {
          response = await fetch(`${this.baseUrl}/v1/message/send`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'X-API-KEY': this.apiKey,
              'X-API-SECRET': this.secret,
            },
            body: JSON.stringify({
              to: normalizedPhone,
              content: smsData.message,
              from: smsData.from || 'SpeedyVan',
            }),
          });
          method = 'API Key + Secret';
        } catch (e) {
          console.log('❌ API key authentication failed:', e);
        }
      }

      if (!response) {
        throw new Error('All authentication methods failed');
      }

      console.log(`📡 Response status: ${response.status} (Method: ${method})`);
      console.log('📡 Response headers:', Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        let errorMessage = `HTTP ${response.status} (${method})`;
        
        try {
          const errorText = await response.text();
          console.log('📡 Error response body:', errorText);
          
          // Try to parse as JSON
          try {
            const errorData = JSON.parse(errorText);
            errorMessage = errorData.message || errorData.error || errorText;
          } catch {
            // If not JSON, use the text directly
            errorMessage = errorText;
          }
        } catch (e) {
          errorMessage = `HTTP ${response.status} - Could not read error response`;
        }
        
        throw new Error(errorMessage);
      }

      const result = await response.json();
      console.log('✅ SMS API response:', result);
      
      return {
        success: true,
        messageId: result.messageId || result.id,
      };
    } catch (error) {
      console.error('❌ SMS sending failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  async sendBookingConfirmation(phoneNumber: string, bookingData: any): Promise<SMSResponse> {
    const message = this.generateBookingConfirmationMessage(bookingData);
    
    return this.sendSMS({
      to: phoneNumber,
      message,
      from: 'SpeedyVan',
    });
  }

  private generateBookingConfirmationMessage(bookingData: any): string {
    const reference = bookingData.bookingReference || bookingData.reference || 'SV-DEMO';
    const date = new Date(bookingData.scheduledAt || bookingData.date).toLocaleDateString('en-GB');
    const time = bookingData.timeSlot || bookingData.time || 'TBD';
    const amount = bookingData.totalGBP || bookingData.amount || 'TBD';
    
    return `🚐 Speedy Van - Booking Confirmed!

Ref: ${reference}
Date: ${date}
Time: ${time}
Amount: £${amount}

Your move is confirmed! We'll send updates via SMS. Track your booking at: https://speedy-van.co.uk/track

Need help? Call 07901846297`;
  }

  async sendOTP(phoneNumber: string, code: string): Promise<SMSResponse> {
    const message = `Your Speedy Van verification code is: ${code}

This code expires in 10 minutes.

If you didn't request this code, please ignore this message.`;
    
    return this.sendSMS({
      to: phoneNumber,
      message,
      from: 'SpeedyVan',
    });
  }

  async sendBookingUpdate(phoneNumber: string, updateType: string, details: string): Promise<SMSResponse> {
    const message = `🚐 Speedy Van Update

${updateType}: ${details}

Track your booking: https://speedy-van.co.uk/track
Support: 07901846297`;
    
    return this.sendSMS({
      to: phoneNumber,
      message,
      from: 'SpeedyVan',
    });
  }
}

// Export singleton instance
export const smsService = new SMSService();
export default smsService;
