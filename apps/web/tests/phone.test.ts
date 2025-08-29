import { normalizeUK, formatForDisplay, isValidUKMobile, getCountryCode } from '../src/lib/phone';

describe('Phone Number Utilities', () => {
  describe('normalizeUK', () => {
    it('should normalize UK mobile numbers starting with 07', () => {
      expect(normalizeUK('07901846297')).toBe('447901846297');
      expect(normalizeUK('07123456789')).toBe('447123456789');
    });

    it('should normalize UK mobile numbers starting with +44', () => {
      expect(normalizeUK('+447901846297')).toBe('447901846297');
      expect(normalizeUK('+447123456789')).toBe('447123456789');
    });

    it('should keep already normalized numbers unchanged', () => {
      expect(normalizeUK('447901846297')).toBe('447901846297');
      expect(normalizeUK('447123456789')).toBe('447123456789');
    });

    it('should handle numbers with spaces and special characters', () => {
      expect(normalizeUK('07901 846 297')).toBe('447901846297');
      expect(normalizeUK('+44 7901 846 297')).toBe('447901846297');
      expect(normalizeUK('(07901) 846-297')).toBe('447901846297');
    });

    it('should handle alternative international formats', () => {
      expect(normalizeUK('00447901846297')).toBe('447901846297');
      expect(normalizeUK('00447123456789')).toBe('447123456789');
    });

    it('should return original for non-UK numbers', () => {
      expect(normalizeUK('1234567890')).toBe('1234567890');
      expect(normalizeUK('+1234567890')).toBe('+1234567890');
    });
  });

  describe('formatForDisplay', () => {
    it('should add + prefix to normalized UK numbers', () => {
      expect(formatForDisplay('447901846297')).toBe('+447901846297');
      expect(formatForDisplay('447123456789')).toBe('+447123456789');
    });

    it('should return original for non-UK numbers', () => {
      expect(formatForDisplay('1234567890')).toBe('1234567890');
      expect(formatForDisplay('+1234567890')).toBe('+1234567890');
    });
  });

  describe('isValidUKMobile', () => {
    it('should validate correct UK mobile numbers', () => {
      expect(isValidUKMobile('07901846297')).toBe(true);
      expect(isValidUKMobile('+447901846297')).toBe(true);
      expect(isValidUKMobile('447901846297')).toBe(true);
      expect(isValidUKMobile('07123456789')).toBe(true);
    });

    it('should reject invalid UK mobile numbers', () => {
      expect(isValidUKMobile('0790184629')).toBe(false); // Too short
      expect(isValidUKMobile('079018462970')).toBe(false); // Too long
      expect(isValidUKMobile('08901846297')).toBe(false); // Doesn't start with 07
      expect(isValidUKMobile('1234567890')).toBe(false); // Not UK format
    });

    it('should handle formatted numbers with spaces', () => {
      expect(isValidUKMobile('07901 846 297')).toBe(true);
      expect(isValidUKMobile('+44 7901 846 297')).toBe(true);
    });
  });

  describe('getCountryCode', () => {
    it('should extract UK country code from normalized numbers', () => {
      expect(getCountryCode('447901846297')).toBe('44');
      expect(getCountryCode('447123456789')).toBe('44');
    });

    it('should return empty string for non-UK numbers', () => {
      expect(getCountryCode('1234567890')).toBe('');
      expect(getCountryCode('+1234567890')).toBe('');
    });
  });

  describe('Integration tests', () => {
    it('should handle complete normalization workflow', () => {
      const original = '07901 846 297';
      const normalized = normalizeUK(original);
      const display = formatForDisplay(normalized);
      const isValid = isValidUKMobile(original);
      const countryCode = getCountryCode(normalized);

      expect(normalized).toBe('447901846297');
      expect(display).toBe('+447901846297');
      expect(isValid).toBe(true);
      expect(countryCode).toBe('44');
    });

    it('should normalize various input formats to the same result', () => {
      const inputs = [
        '07901846297',
        '+447901846297',
        '447901846297',
        '00447901846297',
        '07901 846 297',
        '+44 7901 846 297'
      ];

      const normalized = inputs.map(normalizeUK);
      const unique = [...new Set(normalized)];

      expect(unique).toHaveLength(1);
      expect(unique[0]).toBe('447901846297');
    });
  });
});
