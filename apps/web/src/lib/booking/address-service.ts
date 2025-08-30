import { Coordinates, Address } from './schemas';

// Mapbox configuration
const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
const MAPBOX_BASE_URL = 'https://api.mapbox.com/geocoding/v5/mapbox.places';

// UK-specific configuration
const UK_BOUNDS = {
  southwest: { lat: 49.959999905, lng: -7.57216793459 },
  northeast: { lat: 58.6350001085, lng: 1.68153079591 },
};

const UK_COUNTRY_CODE = 'gb';

// UK postcode validation regex (comprehensive)
const UK_POSTCODE_REGEX = /^([A-Z]{1,2}[0-9][A-Z0-9]?)\s*([0-9][A-Z]{2})$/i;

// Common UK address abbreviations and their full forms
const UK_ADDRESS_EXPANSIONS = {
  'st': 'street',
  'rd': 'road',
  'ave': 'avenue',
  'dr': 'drive',
  'ln': 'lane',
  'cl': 'close',
  'ct': 'court',
  'pl': 'place',
  'gdns': 'gardens',
  'pk': 'park',
  'sq': 'square',
  'ter': 'terrace',
  'cres': 'crescent',
  'way': 'way',
  'grove': 'grove',
  'hill': 'hill',
  'view': 'view',
  'walk': 'walk',
  'mews': 'mews',
  'row': 'row',
  'green': 'green',
  'common': 'common',
  'rise': 'rise',
  'vale': 'vale',
  'mount': 'mount',
  'heights': 'heights',
  'fields': 'fields',
  'meadows': 'meadows',
  'gardens': 'gardens',
  'park': 'park',
  'wood': 'wood',
  'grove': 'grove',
  'chase': 'chase',
  'end': 'end',
  'side': 'side',
  'gate': 'gate',
  'bridge': 'bridge',
  'cross': 'cross',
  'corner': 'corner',
  'edge': 'edge',
  'point': 'point',
  'wharf': 'wharf',
  'quay': 'quay',
  'strand': 'strand',
  'embankment': 'embankment',
};

// Major UK cities and their coordinates (for fallback and validation)
const UK_MAJOR_CITIES = {
  'london': { lat: 51.5074, lng: -0.1278 },
  'birmingham': { lat: 52.4862, lng: -1.8904 },
  'manchester': { lat: 53.4808, lng: -2.2426 },
  'glasgow': { lat: 55.8642, lng: -4.2518 },
  'liverpool': { lat: 53.4084, lng: -2.9916 },
  'leeds': { lat: 53.8008, lng: -1.5491 },
  'sheffield': { lat: 53.3811, lng: -1.4701 },
  'edinburgh': { lat: 55.9533, lng: -3.1883 },
  'bristol': { lat: 51.4545, lng: -2.5879 },
  'cardiff': { lat: 51.4816, lng: -3.1791 },
  'belfast': { lat: 54.5973, lng: -5.9301 },
  'newcastle': { lat: 54.9783, lng: -1.6178 },
  'nottingham': { lat: 52.9548, lng: -1.1581 },
  'plymouth': { lat: 50.3755, lng: -4.1427 },
  'southampton': { lat: 50.9097, lng: -1.4044 },
  'reading': { lat: 51.4543, lng: -0.9781 },
  'oxford': { lat: 51.7520, lng: -1.2577 },
  'cambridge': { lat: 52.2053, lng: 0.1218 },
  'brighton': { lat: 50.8225, lng: -0.1372 },
  'bournemouth': { lat: 50.7192, lng: -1.8808 },
};

// Interface for address suggestions
export interface AddressSuggestion {
  id: string;
  text: string;
  placeName: string;
  coordinates: Coordinates;
  postcode?: string;
  context: {
    locality?: string;
    place?: string;
    district?: string;
    region?: string;
    country?: string;
  };
  relevance: number;
  addressType: 'address' | 'postcode' | 'street' | 'locality' | 'place';
}

// Interface for distance calculation
export interface DistanceResult {
  distance: number; // in kilometers
  duration: number; // in minutes
  route?: {
    geometry: any;
    legs: any[];
  };
}

// Utility functions
const normalizePostcode = (postcode: string): string => {
  return postcode.replace(/\s+/g, '').toUpperCase();
};

const formatPostcode = (postcode: string): string => {
  const normalized = normalizePostcode(postcode);
  const match = normalized.match(/^([A-Z]{1,2}[0-9][A-Z0-9]?)([0-9][A-Z]{2})$/);
  return match ? `${match[1]} ${match[2]}` : postcode;
};

const isValidUKPostcode = (postcode: string): boolean => {
  return UK_POSTCODE_REGEX.test(postcode.replace(/\s+/g, ''));
};

const expandAddressAbbreviations = (query: string): string => {
  let expanded = query.toLowerCase();
  Object.entries(UK_ADDRESS_EXPANSIONS).forEach(([abbr, full]) => {
    const regex = new RegExp(`\\b${abbr}\\b`, 'gi');
    expanded = expanded.replace(regex, full);
  });
  return expanded;
};

// Debounce utility
const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

// Address service class
export class UKAddressService {
  private cache = new Map<string, AddressSuggestion[]>();
  private cacheExpiry = new Map<string, number>();
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  constructor() {
    if (!MAPBOX_TOKEN) {
      console.warn('Mapbox token not found. Address autocomplete will use fallback service.');
    }
  }

  // Get current location
  async getCurrentLocation(): Promise<{ coordinates: Coordinates; address?: string }> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by this browser'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const coordinates: Coordinates = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };

          try {
            // Reverse geocode to get address
            const address = await this.reverseGeocode(coordinates);
            resolve({ coordinates, address: address?.text });
          } catch (error) {
            // Return coordinates even if reverse geocoding fails
            resolve({ coordinates });
          }
        },
        (error) => {
          reject(new Error(`Geolocation error: ${error.message}`));
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000, // 5 minutes
        }
      );
    });
  }

  // Search addresses with Mapbox
  async searchAddresses(
    query: string,
    options: {
      limit?: number;
      proximity?: Coordinates;
      types?: string[];
      postcode?: boolean;
    } = {}
  ): Promise<AddressSuggestion[]> {
    const {
      limit = 5,
      proximity,
      types = ['address', 'poi'],
      postcode = false,
    } = options;

    // Check cache first
    const cacheKey = `${query}-${JSON.stringify(options)}`;
    if (this.isCacheValid(cacheKey)) {
      return this.cache.get(cacheKey) || [];
    }

    try {
      // If query looks like a postcode, prioritize postcode search
      if (isValidUKPostcode(query)) {
        return await this.searchByPostcode(query, limit);
      }

      // Expand abbreviations for better matching
      const expandedQuery = expandAddressAbbreviations(query);

      if (!MAPBOX_TOKEN) {
        return await this.fallbackAddressSearch(expandedQuery, limit);
      }

      // Build Mapbox query parameters
      const params = new URLSearchParams({
        access_token: MAPBOX_TOKEN,
        country: UK_COUNTRY_CODE,
        limit: limit.toString(),
        types: types.join(','),
        autocomplete: 'true',
        language: 'en',
      });

      // Add proximity if provided
      if (proximity) {
        params.append('proximity', `${proximity.lng},${proximity.lat}`);
      }

      // Add bounding box for UK
      params.append('bbox', `${UK_BOUNDS.southwest.lng},${UK_BOUNDS.southwest.lat},${UK_BOUNDS.northeast.lng},${UK_BOUNDS.northeast.lat}`);

      const url = `${MAPBOX_BASE_URL}/${encodeURIComponent(expandedQuery)}.json?${params}`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Mapbox API error: ${response.status}`);
      }

      const data = await response.json();
      const suggestions = this.parseMapboxResponse(data);

      // Cache the results
      this.cache.set(cacheKey, suggestions);
      this.cacheExpiry.set(cacheKey, Date.now() + this.CACHE_DURATION);

      return suggestions;
    } catch (error) {
      console.error('Address search error:', error);
      // Fallback to basic search
      return await this.fallbackAddressSearch(query, limit);
    }
  }

  // Search by postcode specifically
  async searchByPostcode(postcode: string, limit: number = 5): Promise<AddressSuggestion[]> {
    const formattedPostcode = formatPostcode(postcode);
    
    if (!isValidUKPostcode(formattedPostcode)) {
      return [];
    }

    try {
      if (!MAPBOX_TOKEN) {
        return await this.fallbackPostcodeSearch(formattedPostcode, limit);
      }

      const params = new URLSearchParams({
        access_token: MAPBOX_TOKEN,
        country: UK_COUNTRY_CODE,
        types: 'postcode,address',
        limit: limit.toString(),
      });

      const url = `${MAPBOX_BASE_URL}/${encodeURIComponent(formattedPostcode)}.json?${params}`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Mapbox API error: ${response.status}`);
      }

      const data = await response.json();
      return this.parseMapboxResponse(data);
    } catch (error) {
      console.error('Postcode search error:', error);
      return await this.fallbackPostcodeSearch(formattedPostcode, limit);
    }
  }

  // Reverse geocode coordinates to address
  async reverseGeocode(coordinates: Coordinates): Promise<AddressSuggestion | null> {
    try {
      if (!MAPBOX_TOKEN) {
        return await this.fallbackReverseGeocode(coordinates);
      }

      const params = new URLSearchParams({
        access_token: MAPBOX_TOKEN,
        country: UK_COUNTRY_CODE,
        types: 'address',
        limit: '1',
      });

      const url = `${MAPBOX_BASE_URL}/${coordinates.lng},${coordinates.lat}.json?${params}`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Mapbox API error: ${response.status}`);
      }

      const data = await response.json();
      const suggestions = this.parseMapboxResponse(data);
      return suggestions[0] || null;
    } catch (error) {
      console.error('Reverse geocode error:', error);
      return await this.fallbackReverseGeocode(coordinates);
    }
  }

  // Calculate distance between two addresses
  async calculateDistance(
    origin: Coordinates,
    destination: Coordinates
  ): Promise<DistanceResult> {
    try {
      if (!MAPBOX_TOKEN) {
        return this.fallbackDistanceCalculation(origin, destination);
      }

      const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${origin.lng},${origin.lat};${destination.lng},${destination.lat}`;
      const params = new URLSearchParams({
        access_token: MAPBOX_TOKEN,
        geometries: 'geojson',
        overview: 'simplified',
      });

      const response = await fetch(`${url}?${params}`);

      if (!response.ok) {
        throw new Error(`Mapbox Directions API error: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.routes && data.routes.length > 0) {
        const route = data.routes[0];
        return {
          distance: Math.round(route.distance / 1000 * 10) / 10, // Convert to km, round to 1 decimal
          duration: Math.round(route.duration / 60), // Convert to minutes
          route: {
            geometry: route.geometry,
            legs: route.legs,
          },
        };
      }

      throw new Error('No route found');
    } catch (error) {
      console.error('Distance calculation error:', error);
      return this.fallbackDistanceCalculation(origin, destination);
    }
  }

  // Validate UK address
  async validateAddress(address: Partial<Address>): Promise<{
    isValid: boolean;
    suggestions?: AddressSuggestion[];
    errors: string[];
  }> {
    const errors: string[] = [];

    // Check required fields
    if (!address.line1) {
      errors.push('Address line 1 is required');
    }

    if (!address.city) {
      errors.push('City is required');
    }

    if (!address.postcode) {
      errors.push('Postcode is required');
    } else if (!isValidUKPostcode(address.postcode)) {
      errors.push('Please enter a valid UK postcode');
    }

    if (errors.length > 0) {
      return { isValid: false, errors };
    }

    try {
      // Try to geocode the full address
      const fullAddress = `${address.line1}, ${address.city}, ${address.postcode}`;
      const suggestions = await this.searchAddresses(fullAddress, { limit: 3 });

      if (suggestions.length === 0) {
        return {
          isValid: false,
          errors: ['Address not found. Please check and try again.'],
        };
      }

      // Check if any suggestion closely matches the input
      const closeMatch = suggestions.find(suggestion => {
        const suggestionPostcode = suggestion.postcode || '';
        return normalizePostcode(suggestionPostcode) === normalizePostcode(address.postcode || '');
      });

      if (closeMatch) {
        return { isValid: true, errors: [] };
      }

      return {
        isValid: false,
        suggestions,
        errors: ['Address may not be accurate. Please select from suggestions.'],
      };
    } catch (error) {
      return {
        isValid: false,
        errors: ['Unable to validate address. Please check your internet connection.'],
      };
    }
  }

  // Private helper methods
  private parseMapboxResponse(data: any): AddressSuggestion[] {
    if (!data.features || !Array.isArray(data.features)) {
      return [];
    }

    return data.features.map((feature: any) => {
      const coordinates: Coordinates = {
        lng: feature.center[0],
        lat: feature.center[1],
      };

      // Extract context information
      const context: AddressSuggestion['context'] = {};
      if (feature.context) {
        feature.context.forEach((ctx: any) => {
          if (ctx.id.startsWith('locality')) context.locality = ctx.text;
          else if (ctx.id.startsWith('place')) context.place = ctx.text;
          else if (ctx.id.startsWith('district')) context.district = ctx.text;
          else if (ctx.id.startsWith('region')) context.region = ctx.text;
          else if (ctx.id.startsWith('country')) context.country = ctx.text;
        });
      }

      // Extract postcode
      let postcode: string | undefined;
      if (feature.properties?.postcode) {
        postcode = feature.properties.postcode;
      } else if (feature.place_type?.includes('postcode')) {
        postcode = feature.text;
      }

      // Determine address type
      let addressType: AddressSuggestion['addressType'] = 'address';
      if (feature.place_type?.includes('postcode')) addressType = 'postcode';
      else if (feature.place_type?.includes('address')) addressType = 'address';
      else if (feature.place_type?.includes('street')) addressType = 'street';
      else if (feature.place_type?.includes('locality')) addressType = 'locality';
      else if (feature.place_type?.includes('place')) addressType = 'place';

      return {
        id: feature.id,
        text: feature.text,
        placeName: feature.place_name,
        coordinates,
        postcode,
        context,
        relevance: feature.relevance || 0,
        addressType,
      };
    });
  }

  private isCacheValid(key: string): boolean {
    const expiry = this.cacheExpiry.get(key);
    return expiry ? Date.now() < expiry : false;
  }

  // Fallback methods for when Mapbox is unavailable
  private async fallbackAddressSearch(query: string, limit: number): Promise<AddressSuggestion[]> {
    // Simple fallback using UK major cities
    const results: AddressSuggestion[] = [];
    const lowerQuery = query.toLowerCase();

    Object.entries(UK_MAJOR_CITIES).forEach(([city, coords]) => {
      if (city.includes(lowerQuery) && results.length < limit) {
        results.push({
          id: `fallback-${city}`,
          text: city.charAt(0).toUpperCase() + city.slice(1),
          placeName: `${city.charAt(0).toUpperCase() + city.slice(1)}, UK`,
          coordinates: coords,
          context: { place: city, country: 'United Kingdom' },
          relevance: city.startsWith(lowerQuery) ? 1 : 0.5,
          addressType: 'place',
        });
      }
    });

    return results;
  }

  private async fallbackPostcodeSearch(postcode: string, limit: number): Promise<AddressSuggestion[]> {
    // Very basic postcode fallback - in reality, you'd want a proper postcode database
    return [{
      id: `fallback-postcode-${postcode}`,
      text: postcode,
      placeName: `${postcode}, UK`,
      coordinates: { lat: 51.5074, lng: -0.1278 }, // Default to London
      postcode,
      context: { country: 'United Kingdom' },
      relevance: 1,
      addressType: 'postcode',
    }];
  }

  private async fallbackReverseGeocode(coordinates: Coordinates): Promise<AddressSuggestion | null> {
    // Find nearest major city as fallback
    let nearestCity = 'London';
    let minDistance = Infinity;

    Object.entries(UK_MAJOR_CITIES).forEach(([city, coords]) => {
      const distance = this.calculateHaversineDistance(coordinates, coords);
      if (distance < minDistance) {
        minDistance = distance;
        nearestCity = city;
      }
    });

    return {
      id: `fallback-reverse-${nearestCity}`,
      text: nearestCity.charAt(0).toUpperCase() + nearestCity.slice(1),
      placeName: `Near ${nearestCity.charAt(0).toUpperCase() + nearestCity.slice(1)}, UK`,
      coordinates,
      context: { place: nearestCity, country: 'United Kingdom' },
      relevance: 0.5,
      addressType: 'place',
    };
  }

  private fallbackDistanceCalculation(origin: Coordinates, destination: Coordinates): DistanceResult {
    const distance = this.calculateHaversineDistance(origin, destination);
    const duration = Math.round(distance * 2); // Rough estimate: 2 minutes per km

    return { distance, duration };
  }

  private calculateHaversineDistance(coord1: Coordinates, coord2: Coordinates): number {
    const R = 6371; // Earth's radius in kilometers
    const dLat = this.toRadians(coord2.lat - coord1.lat);
    const dLng = this.toRadians(coord2.lng - coord1.lng);
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRadians(coord1.lat)) * Math.cos(this.toRadians(coord2.lat)) *
      Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Math.round(R * c * 10) / 10; // Round to 1 decimal place
  }

  private toRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
  }
}

// Create singleton instance
export const ukAddressService = new UKAddressService();

// Hook for using address service in React components
export const useUKAddressService = () => {
  return ukAddressService;
};

// Debounced search hook
export const useDebouncedAddressSearch = (delay: number = 300) => {
  const addressService = useUKAddressService();
  
  const debouncedSearch = debounce(
    async (
      query: string,
      callback: (suggestions: AddressSuggestion[]) => void,
      options?: Parameters<typeof addressService.searchAddresses>[1]
    ) => {
      try {
        const suggestions = await addressService.searchAddresses(query, options);
        callback(suggestions);
      } catch (error) {
        console.error('Debounced search error:', error);
        callback([]);
      }
    },
    delay
  );

  return debouncedSearch;
};

export { isValidUKPostcode, formatPostcode, normalizePostcode };

