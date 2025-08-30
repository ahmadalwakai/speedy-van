import { UKAddressService } from '../address-service';

// Mock fetch for testing
global.fetch = jest.fn();

describe('UKAddressService', () => {
  let addressService: UKAddressService;
  const mockMapboxToken = 'test-token';

  beforeEach(() => {
    addressService = new UKAddressService(mockMapboxToken);
    jest.clearAllMocks();
  });

  describe('Postcode Validation', () => {
    test('validates correct UK postcodes', () => {
      const validPostcodes = [
        'SW1A 1AA',
        'M1 1AA',
        'B33 8TH',
        'W1A 0AX',
        'EC1A 1BB',
        'sw1a 1aa', // lowercase
        'SW1A1AA', // no space
      ];

      validPostcodes.forEach(postcode => {
        expect(addressService.validatePostcode(postcode)).toBe(true);
      });
    });

    test('rejects invalid postcodes', () => {
      const invalidPostcodes = [
        'INVALID',
        '12345',
        'A1A 1A1', // Invalid format
        'SW1A 1AAA', // Too long
        'SW1 1A', // Too short
        '', // Empty
        'US12345', // US zip code
      ];

      invalidPostcodes.forEach(postcode => {
        expect(addressService.validatePostcode(postcode)).toBe(false);
      });
    });

    test('normalizes postcode format', () => {
      expect(addressService.normalizePostcode('sw1a1aa')).toBe('SW1A 1AA');
      expect(addressService.normalizePostcode('SW1A1AA')).toBe('SW1A 1AA');
      expect(addressService.normalizePostcode('SW1A 1AA')).toBe('SW1A 1AA');
      expect(addressService.normalizePostcode('  sw1a  1aa  ')).toBe('SW1A 1AA');
    });
  });

  describe('Address Autocomplete', () => {
    test('searches addresses with Mapbox API', async () => {
      const mockResponse = {
        features: [
          {
            place_name: '123 Test Street, London, UK',
            center: [-0.1278, 51.5074],
            properties: {
              accuracy: 'high',
            },
            context: [
              { id: 'postcode', text: 'SW1A 1AA' },
              { id: 'place', text: 'London' },
              { id: 'country', text: 'United Kingdom' },
            ],
          },
        ],
      };

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const results = await addressService.searchAddresses('123 Test Street');

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('api.mapbox.com/geocoding/v5/mapbox.places/123%20Test%20Street.json'),
        expect.objectContaining({
          method: 'GET',
        })
      );

      expect(results).toHaveLength(1);
      expect(results[0]).toEqual({
        formatted: '123 Test Street, London, UK',
        line1: '123 Test Street',
        city: 'London',
        postcode: 'SW1A 1AA',
        country: 'United Kingdom',
        coordinates: [-0.1278, 51.5074],
        accuracy: 'high',
      });
    });

    test('handles API errors gracefully', async () => {
      (fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

      const results = await addressService.searchAddresses('123 Test Street');

      expect(results).toHaveLength(0);
    });

    test('filters non-UK addresses', async () => {
      const mockResponse = {
        features: [
          {
            place_name: '123 Test Street, London, UK',
            center: [-0.1278, 51.5074],
            properties: { accuracy: 'high' },
            context: [
              { id: 'country', text: 'United Kingdom' },
            ],
          },
          {
            place_name: '123 Test Street, New York, USA',
            center: [-74.0060, 40.7128],
            properties: { accuracy: 'high' },
            context: [
              { id: 'country', text: 'United States' },
            ],
          },
        ],
      };

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const results = await addressService.searchAddresses('123 Test Street');

      expect(results).toHaveLength(1);
      expect(results[0].country).toBe('United Kingdom');
    });

    test('limits results to maximum count', async () => {
      const mockResponse = {
        features: Array.from({ length: 10 }, (_, i) => ({
          place_name: `${i + 1} Test Street, London, UK`,
          center: [-0.1278, 51.5074],
          properties: { accuracy: 'high' },
          context: [
            { id: 'country', text: 'United Kingdom' },
          ],
        })),
      };

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const results = await addressService.searchAddresses('Test Street', 5);

      expect(results).toHaveLength(5);
    });
  });

  describe('Postcode Search', () => {
    test('searches by postcode', async () => {
      const mockResponse = {
        features: [
          {
            place_name: 'SW1A 1AA, Westminster, London, UK',
            center: [-0.1419, 51.5014],
            properties: { accuracy: 'high' },
            context: [
              { id: 'postcode', text: 'SW1A 1AA' },
              { id: 'place', text: 'Westminster' },
              { id: 'region', text: 'London' },
              { id: 'country', text: 'United Kingdom' },
            ],
          },
        ],
      };

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await addressService.searchByPostcode('SW1A 1AA');

      expect(result).toEqual({
        postcode: 'SW1A 1AA',
        area: 'Westminster',
        city: 'London',
        country: 'United Kingdom',
        coordinates: [-0.1419, 51.5014],
        accuracy: 'high',
      });
    });

    test('handles invalid postcode search', async () => {
      const result = await addressService.searchByPostcode('INVALID');
      expect(result).toBeNull();
    });

    test('handles API error in postcode search', async () => {
      (fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

      const result = await addressService.searchByPostcode('SW1A 1AA');
      expect(result).toBeNull();
    });
  });

  describe('Current Location', () => {
    test('gets current location', async () => {
      // Mock geolocation
      const mockGeolocation = {
        getCurrentPosition: jest.fn((success) => {
          success({
            coords: {
              latitude: 51.5074,
              longitude: -0.1278,
              accuracy: 10,
            },
          });
        }),
      };

      Object.defineProperty(global.navigator, 'geolocation', {
        value: mockGeolocation,
        writable: true,
      });

      const mockResponse = {
        features: [
          {
            place_name: 'Current Location, London, UK',
            center: [-0.1278, 51.5074],
            properties: { accuracy: 'high' },
            context: [
              { id: 'postcode', text: 'WC2N 5DU' },
              { id: 'place', text: 'London' },
              { id: 'country', text: 'United Kingdom' },
            ],
          },
        ],
      };

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await addressService.getCurrentLocation();

      expect(result).toEqual({
        formatted: 'Current Location, London, UK',
        line1: 'Current Location',
        city: 'London',
        postcode: 'WC2N 5DU',
        country: 'United Kingdom',
        coordinates: [-0.1278, 51.5074],
        accuracy: 'high',
      });
    });

    test('handles geolocation error', async () => {
      const mockGeolocation = {
        getCurrentPosition: jest.fn((success, error) => {
          error(new Error('Location access denied'));
        }),
      };

      Object.defineProperty(global.navigator, 'geolocation', {
        value: mockGeolocation,
        writable: true,
      });

      const result = await addressService.getCurrentLocation();
      expect(result).toBeNull();
    });

    test('handles reverse geocoding error', async () => {
      const mockGeolocation = {
        getCurrentPosition: jest.fn((success) => {
          success({
            coords: {
              latitude: 51.5074,
              longitude: -0.1278,
              accuracy: 10,
            },
          });
        }),
      };

      Object.defineProperty(global.navigator, 'geolocation', {
        value: mockGeolocation,
        writable: true,
      });

      (fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

      const result = await addressService.getCurrentLocation();
      expect(result).toBeNull();
    });
  });

  describe('Address Validation', () => {
    test('validates complete address', async () => {
      const address = {
        line1: '123 Test Street',
        city: 'London',
        postcode: 'SW1A 1AA',
      };

      const mockResponse = {
        features: [
          {
            place_name: '123 Test Street, London, UK',
            center: [-0.1278, 51.5074],
            properties: { accuracy: 'high' },
            context: [
              { id: 'postcode', text: 'SW1A 1AA' },
              { id: 'place', text: 'London' },
              { id: 'country', text: 'United Kingdom' },
            ],
          },
        ],
      };

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await addressService.validateAddress(address);

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
      expect(result.suggestions).toHaveLength(1);
    });

    test('validates address with missing fields', async () => {
      const address = {
        line1: '',
        city: 'London',
        postcode: 'INVALID',
      };

      const result = await addressService.validateAddress(address);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Address line 1 is required');
      expect(result.errors).toContain('Invalid UK postcode format');
    });

    test('provides suggestions for similar addresses', async () => {
      const address = {
        line1: '123 Test Stret', // Typo
        city: 'London',
        postcode: 'SW1A 1AA',
      };

      const mockResponse = {
        features: [
          {
            place_name: '123 Test Street, London, UK',
            center: [-0.1278, 51.5074],
            properties: { accuracy: 'high' },
            context: [
              { id: 'postcode', text: 'SW1A 1AA' },
              { id: 'place', text: 'London' },
              { id: 'country', text: 'United Kingdom' },
            ],
          },
        ],
      };

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await addressService.validateAddress(address);

      expect(result.suggestions).toHaveLength(1);
      expect(result.suggestions[0].line1).toBe('123 Test Street');
    });
  });

  describe('Distance Calculation', () => {
    test('calculates distance between two points', () => {
      const point1 = { latitude: 51.5074, longitude: -0.1278 }; // London
      const point2 = { latitude: 51.5155, longitude: -0.0922 }; // Tower of London

      const distance = addressService.calculateDistance(point1, point2);

      expect(distance).toBeGreaterThan(0);
      expect(distance).toBeLessThan(10); // Should be less than 10km
    });

    test('calculates zero distance for same point', () => {
      const point = { latitude: 51.5074, longitude: -0.1278 };

      const distance = addressService.calculateDistance(point, point);

      expect(distance).toBe(0);
    });

    test('calculates distance and duration between addresses', async () => {
      const pickup = {
        line1: '123 Test Street',
        city: 'London',
        postcode: 'SW1A 1AA',
        coordinates: [-0.1278, 51.5074],
      };

      const dropoff = {
        line1: '456 Another Street',
        city: 'London',
        postcode: 'EC1A 1BB',
        coordinates: [-0.0922, 51.5155],
      };

      const mockResponse = {
        routes: [
          {
            distance: 5000, // 5km in meters
            duration: 900, // 15 minutes in seconds
          },
        ],
      };

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await addressService.calculateDistanceAndDuration(pickup as any, dropoff as any);

      expect(result).toEqual({
        distance: 5, // km
        duration: 15, // minutes
        route: expect.any(Object),
      });
    });

    test('handles routing API error', async () => {
      const pickup = {
        line1: '123 Test Street',
        city: 'London',
        postcode: 'SW1A 1AA',
        coordinates: [-0.1278, 51.5074],
      };

      const dropoff = {
        line1: '456 Another Street',
        city: 'London',
        postcode: 'EC1A 1BB',
        coordinates: [-0.0922, 51.5155],
      };

      (fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

      const result = await addressService.calculateDistanceAndDuration(pickup as any, dropoff as any);

      expect(result).toBeNull();
    });
  });

  describe('Caching', () => {
    test('caches search results', async () => {
      const mockResponse = {
        features: [
          {
            place_name: '123 Test Street, London, UK',
            center: [-0.1278, 51.5074],
            properties: { accuracy: 'high' },
            context: [
              { id: 'country', text: 'United Kingdom' },
            ],
          },
        ],
      };

      (fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
      });

      // First call
      await addressService.searchAddresses('123 Test Street');
      expect(fetch).toHaveBeenCalledTimes(1);

      // Second call with same query (should use cache)
      await addressService.searchAddresses('123 Test Street');
      expect(fetch).toHaveBeenCalledTimes(1); // Still only 1 call
    });

    test('cache expires after timeout', async () => {
      const mockResponse = {
        features: [
          {
            place_name: '123 Test Street, London, UK',
            center: [-0.1278, 51.5074],
            properties: { accuracy: 'high' },
            context: [
              { id: 'country', text: 'United Kingdom' },
            ],
          },
        ],
      };

      (fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
      });

      // First call
      await addressService.searchAddresses('123 Test Street');
      expect(fetch).toHaveBeenCalledTimes(1);

      // Mock time passing (6 minutes)
      jest.spyOn(Date, 'now').mockReturnValue(Date.now() + 6 * 60 * 1000);

      // Second call after cache expiry
      await addressService.searchAddresses('123 Test Street');
      expect(fetch).toHaveBeenCalledTimes(2);
    });
  });

  describe('Fallback Functionality', () => {
    test('provides fallback cities when API fails', async () => {
      (fetch as jest.Mock).mockRejectedValue(new Error('Network error'));

      const results = await addressService.searchAddresses('London');

      expect(results.length).toBeGreaterThan(0);
      expect(results.some(r => r.city === 'London')).toBe(true);
    });

    test('provides fallback for postcode search', async () => {
      (fetch as jest.Mock).mockRejectedValue(new Error('Network error'));

      const result = await addressService.searchByPostcode('SW1A 1AA');

      // Should return null when API fails and no fallback available
      expect(result).toBeNull();
    });
  });

  describe('Error Handling', () => {
    test('handles malformed API responses', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ invalid: 'response' }),
      });

      const results = await addressService.searchAddresses('123 Test Street');

      expect(results).toHaveLength(0);
    });

    test('handles HTTP errors', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: 'Not Found',
      });

      const results = await addressService.searchAddresses('123 Test Street');

      expect(results).toHaveLength(0);
    });

    test('handles network timeouts', async () => {
      (fetch as jest.Mock).mockImplementationOnce(
        () => new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Timeout')), 100)
        )
      );

      const results = await addressService.searchAddresses('123 Test Street');

      expect(results).toHaveLength(0);
    });
  });
});

