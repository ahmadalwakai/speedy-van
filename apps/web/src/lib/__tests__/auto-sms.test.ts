import { renderTemplate, TemplateName } from '../sms-templates';
import { normalizeUK } from '../smsworks';

/**
 * Test file for the automated SMS system
 * Run with: pnpm test:unit
 */

describe('SMS Templates', () => {
  test('BOOKING_CREATED template renders correctly', () => {
    const message = renderTemplate('BOOKING_CREATED', {
      name: 'John Smith',
      ref: 'SV-2024-001'
    });
    
    expect(message).toBe('Hi John Smith, we received your booking (#SV-2024-001). We\'ll confirm soon.');
  });

  test('BOOKING_CONFIRMED template renders correctly', () => {
    const message = renderTemplate('BOOKING_CONFIRMED', {
      ref: 'SV-2024-001',
      date: '15th January 2024',
      time: '2:30 PM'
    });
    
    expect(message).toBe('✅ Your booking #SV-2024-001 is confirmed for 15th January 2024 at 2:30 PM.');
  });

  test('DRIVER_EN_ROUTE template renders correctly', () => {
    const message = renderTemplate('DRIVER_EN_ROUTE', {
      ref: 'SV-2024-001',
      eta: '2:30 PM',
      track: 'https://speedy-van.co.uk/track'
    });
    
    expect(message).toBe('🚚 Driver is en route for booking #SV-2024-001. ETA 2:30 PM. Track: https://speedy-van.co.uk/track');
  });

  test('DELIVERY_COMPLETED template renders correctly', () => {
    const message = renderTemplate('DELIVERY_COMPLETED', {
      ref: 'SV-2024-001',
      invoice: 'INV-2024-001'
    });
    
    expect(message).toBe('✅ Booking #SV-2024-001 completed. Invoice: INV-2024-001');
  });

  test('PAYMENT_REMINDER template renders correctly', () => {
    const message = renderTemplate('PAYMENT_REMINDER', {
      ref: 'SV-2024-001',
      payUrl: 'https://speedy-van.co.uk/pay'
    });
    
    expect(message).toBe('💳 Reminder: payment for booking #SV-2024-001 is due today. Pay here: https://speedy-van.co.uk/pay');
  });

  test('OTP template renders correctly', () => {
    const message = renderTemplate('OTP', {
      code: '123456'
    });
    
    expect(message).toBe('Your Speedy Van verification code is 123456. It expires in 10 minutes.');
  });

  test('throws error for unknown template', () => {
    expect(() => {
      renderTemplate('UNKNOWN' as TemplateName, {});
    }).toThrow('Unknown template: UNKNOWN');
  });
});

describe('Phone Number Normalization', () => {
  test('keeps 44-prefixed numbers as-is', () => {
    expect(normalizeUK('447901846297')).toBe('447901846297');
    expect(normalizeUK('+447901846297')).toBe('447901846297');
    expect(normalizeUK('44 790 184 6297')).toBe('447901846297');
  });

  test('replaces leading 0 with 44', () => {
    expect(normalizeUK('07901846297')).toBe('447901846297');
    expect(normalizeUK('0790 184 6297')).toBe('447901846297');
  });

  test('returns digits as-is for other formats', () => {
    expect(normalizeUK('7901846297')).toBe('7901846297');
    expect(normalizeUK('790 184 6297')).toBe('7901846297');
  });

  test('handles various input formats', () => {
    expect(normalizeUK('+44 (0) 790 184 6297')).toBe('447901846297');
    expect(normalizeUK('44-790-184-6297')).toBe('447901846297');
    expect(normalizeUK('0790-184-6297')).toBe('447901846297');
  });
});

/**
 * Integration Test Examples (uncomment to test with real API)
 * 
 * Note: These tests require valid SMSWORKS_KEY and SMSWORKS_SECRET in .env.local
 * 
describe('SMS Integration Tests', () => {
  test('sends real SMS for OTP', async () => {
    const result = await sendAutoSMS({
      type: 'OTP',
      to: '447901846297',
      data: { code: '123456' }
    });
    
    expect(result.status).toBe('SENT');
    expect(result.messageid).toBeDefined();
  }, 30000); // 30 second timeout
});
*/
