'use client';

import { useState } from 'react';
import { normalizeUK, isValidUKMobile } from '@/lib/phone';

export default function TestSMSPage() {
  const [phoneNumber, setPhoneNumber] = useState('07901846297');
  const [message, setMessage] = useState('Test SMS from Speedy Van');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleSendSMS = async (type: 'confirmation' | 'otp') => {
    setLoading(true);
    setResult(null);

    try {
      if (type === 'confirmation') {
        const response = await fetch('/api/sms/send-confirmation', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            phoneNumber,
            bookingData: {
              bookingReference: 'SV-TEST-001',
              scheduledAt: '2024-01-15T10:00:00Z',
              timeSlot: '09:00-12:00',
              totalGBP: 150.00,
            },
          }),
        });

        const data = await response.json();
        setResult({ type: 'confirmation', data });
      } else {
        const response = await fetch('/api/otp/send', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            bookingId: 'test-booking-123',
            channel: 'sms',
            destination: phoneNumber,
          }),
        });

        const data = await response.json();
        setResult({ type: 'otp', data });
      }
    } catch (error) {
      setResult({ type: type, error: error.message });
    } finally {
      setLoading(false);
    }
  };

  const normalizedPhone = normalizeUK(phoneNumber);
  const isValidPhone = isValidUKMobile(phoneNumber);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            📱 SMS Testing Dashboard
          </h1>

          {/* Phone Number Input */}
          <div className="mb-8 p-6 bg-blue-50 rounded-lg">
            <h3 className="text-lg font-semibold mb-4">📱 Phone Number</h3>
            <div className="space-y-3">
              <input
                type="text"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="Enter UK phone number"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <div className="text-sm text-gray-600">
                <div>Original: <span className="font-mono">{phoneNumber}</span></div>
                <div>Normalized: <span className="font-mono">{normalizedPhone}</span></div>
                <div className={`font-semibold ${isValidPhone ? 'text-green-600' : 'text-red-600'}`}>
                  {isValidPhone ? '✅ Valid UK Mobile' : '❌ Invalid UK Mobile'}
                </div>
              </div>
            </div>
          </div>

          {/* SMS Actions */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {/* Booking Confirmation */}
            <div className="p-6 bg-green-50 rounded-lg">
              <h3 className="text-lg font-semibold mb-4 text-green-800">
                🚐 Booking Confirmation SMS
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Send a booking confirmation message to test the SMS service.
              </p>
              <button
                onClick={() => handleSendSMS('confirmation')}
                disabled={loading || !isValidPhone}
                className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Sending...' : 'Send Confirmation SMS'}
              </button>
            </div>

            {/* OTP SMS */}
            <div className="p-6 bg-blue-50 rounded-lg">
              <h3 className="text-lg font-semibold mb-4 text-blue-800">
                🔐 OTP SMS
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Send a one-time password message to test OTP functionality.
              </p>
              <button
                onClick={() => handleSendSMS('otp')}
                disabled={loading || !isValidPhone}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Sending...' : 'Send OTP SMS'}
              </button>
            </div>
          </div>

          {/* Results */}
          {result && (
            <div className="p-6 bg-gray-50 rounded-lg">
              <h3 className="text-lg font-semibold mb-4">
                📊 Test Results - {result.type === 'confirmation' ? 'Booking Confirmation' : 'OTP'}
              </h3>
              <pre className="bg-white p-4 rounded border overflow-auto text-sm">
                {JSON.stringify(result, null, 2)}
              </pre>
            </div>
          )}

          {/* Instructions */}
          <div className="mt-8 p-6 bg-yellow-50 rounded-lg">
            <h3 className="text-lg font-semibold mb-4 text-yellow-800">
              📋 How to Use
            </h3>
            <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700">
              <li>Enter a UK phone number in any format (07xxx, +44xxx, 44xxx)</li>
              <li>Click either button to test different SMS types</li>
              <li>Check the results and your phone for the actual SMS</li>
              <li>Phone numbers are automatically normalized to UK E.164 format</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
