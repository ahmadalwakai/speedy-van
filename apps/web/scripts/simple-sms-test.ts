import { smsService } from '../src/lib/sms-service';
import { normalizeUK } from '../src/lib/phone';

async function testSMS() {
  console.log('Testing SMS service with phone normalization...');
  
  const testPhone = '07901846297';
  const normalizedPhone = normalizeUK(testPhone);
  
  console.log(`Original phone: ${testPhone}`);
  console.log(`Normalized phone: ${normalizedPhone}`);
  
  try {
    const result = await smsService.sendSMS({
      to: testPhone, // Will be normalized internally
      message: 'Test SMS from Speedy Van - Phone Normalization Working!',
      from: 'SpeedyVan'
    });
    
    console.log('Result:', result);
  } catch (error) {
    console.error('Error:', error);
  }
}

testSMS();
