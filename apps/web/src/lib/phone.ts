/**
 * Phone number utilities for UK E.164 format normalization
 */

/**
 * Normalizes a UK phone number to E.164 format without the "+" sign
 * @param msisdn - The phone number to normalize
 * @returns The normalized phone number in format "447901846297"
 */
export function normalizeUK(msisdn: string): string {
  const digits = msisdn.replace(/\D/g, "");
  if (digits.startsWith("44")) return digits;
  if (digits.startsWith("0")) return `44${digits.slice(1)}`;
  return digits;
}

/**
 * Formats a normalized phone number for display (adds + prefix)
 * @param normalizedPhone - The normalized phone number
 * @returns The formatted phone number with + prefix
 */
export function formatForDisplay(normalizedPhone: string): string {
  if (normalizedPhone.startsWith("44")) {
    return `+${normalizedPhone}`;
  }
  return normalizedPhone;
}

/**
 * Validates if a phone number is a valid UK mobile number
 * @param phone - The phone number to validate
 * @returns True if valid UK mobile number
 */
export function isValidUKMobile(phone: string): boolean {
  const normalized = normalizeUK(phone);
  // UK mobile numbers: 447 followed by 9 digits
  return /^447\d{9}$/.test(normalized);
}

/**
 * Gets the country code from a normalized phone number
 * @param normalizedPhone - The normalized phone number
 * @returns The country code (e.g., "44")
 */
export function getCountryCode(normalizedPhone: string): string {
  if (normalizedPhone.startsWith("44")) {
    return "44";
  }
  return "";
}
