// Location services for accurate UK address handling and current location detection

export interface LocationCoordinates {
  lat: number;
  lng: number;
  accuracy?: number;
}

export interface AddressSuggestion {
  id: string;
  text: string;
  place_name: string;
  center: [number, number]; // [lng, lat]
  context: Array<{
    id: string;
    text: string;
    short_code?: string;
  }>;
  properties?: {
    accuracy?: string;
    address?: string;
  };
  bbox?: [number, number, number, number];
}

export interface GeolocationResult {
  coordinates: LocationCoordinates;
  address?: string;
  accuracy: 'high' | 'medium' | 'low';
  source: 'gps' | 'ip' | 'manual';
}

// Mapbox configuration
const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
const MAPBOX_GEOCODING_URL = 'https://api.mapbox.com/geocoding/v5/mapbox.places';

// UK bounds for restricting search results
const UK_BOUNDS = {
  southwest: { lat: 49.9, lng: -8.2 },
  northeast: { lat: 60.9, lng: 1.8 },
};

// Current location detection with multiple fallbacks
export class LocationService {
  private static instance: LocationService;
  private watchId: number | null = null;
  private lastKnownLocation: LocationCoordinates | null = null;

  static getInstance(): LocationService {
    if (!LocationService.instance) {
      LocationService.instance = new LocationService();
    }
    return LocationService.instance;
  }

  // Get current location with high accuracy
  async getCurrentLocation(options?: {
    enableHighAccuracy?: boolean;
    timeout?: number;
    maximumAge?: number;
  }): Promise<GeolocationResult> {
    const defaultOptions = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 300000, // 5 minutes
      ...options,
    };

    try {
      // Try GPS first
      const position = await this.getGPSLocation(defaultOptions);
      const coordinates = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
        accuracy: position.coords.accuracy,
      };

      // Verify it's within UK bounds
      if (this.isWithinUKBounds(coordinates)) {
        this.lastKnownLocation = coordinates;
        
        // Get address for the coordinates
        const address = await this.reverseGeocode(coordinates);
        
        return {
          coordinates,
          address,
          accuracy: coordinates.accuracy && coordinates.accuracy < 100 ? 'high' : 'medium',
          source: 'gps',
        };
      } else {
        throw new Error('Location is outside UK bounds');
      }
    } catch (gpsError) {
      console.warn('GPS location failed, trying IP-based location:', gpsError);
      
      try {
        // Fallback to IP-based location
        const ipLocation = await this.getIPLocation();
        return {
          coordinates: ipLocation.coordinates,
          address: ipLocation.address,
          accuracy: 'low',
          source: 'ip',
        };
      } catch (ipError) {
        console.error('All location methods failed:', ipError);
        throw new Error('Unable to determine current location');
      }
    }
  }

  // GPS-based location
  private getGPSLocation(options: PositionOptions): Promise<GeolocationPosition> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by this browser'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        resolve,
        reject,
        options
      );
    });
  }

  // IP-based location fallback
  private async getIPLocation(): Promise<GeolocationResult> {
    try {
      // Using ipapi.co for IP-based location (free tier)
      const response = await fetch('https://ipapi.co/json/');
      const data = await response.json();
      
      if (data.country_code !== 'GB') {
        throw new Error('IP location is not in UK');
      }

      const coordinates = {
        lat: parseFloat(data.latitude),
        lng: parseFloat(data.longitude),
      };

      return {
        coordinates,
        address: `${data.city}, ${data.region}, ${data.postal}`,
        accuracy: 'low',
        source: 'ip',
      };
    } catch (error) {
      throw new Error('IP-based location failed');
    }
  }

  // Check if coordinates are within UK bounds
  private isWithinUKBounds(coordinates: LocationCoordinates): boolean {
    return (
      coordinates.lat >= UK_BOUNDS.southwest.lat &&
      coordinates.lat <= UK_BOUNDS.northeast.lat &&
      coordinates.lng >= UK_BOUNDS.southwest.lng &&
      coordinates.lng <= UK_BOUNDS.northeast.lng
    );
  }

  // Reverse geocoding to get address from coordinates
  async reverseGeocode(coordinates: LocationCoordinates): Promise<string | undefined> {
    if (!MAPBOX_TOKEN) {
      console.error('Mapbox token not configured');
      return undefined;
    }

    try {
      const url = `${MAPBOX_GEOCODING_URL}/${coordinates.lng},${coordinates.lat}.json?access_token=${MAPBOX_TOKEN}&types=address&country=GB`;
      const response = await fetch(url);
      const data = await response.json();

      if (data.features && data.features.length > 0) {
        return data.features[0].place_name;
      }
    } catch (error) {
      console.error('Reverse geocoding failed:', error);
    }

    return undefined;
  }

  // Watch position for continuous tracking
  watchPosition(
    callback: (result: GeolocationResult) => void,
    errorCallback?: (error: GeolocationPositionError) => void
  ): number | null {
    if (!navigator.geolocation) {
      return null;
    }

    this.watchId = navigator.geolocation.watchPosition(
      async (position) => {
        const coordinates = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          accuracy: position.coords.accuracy,
        };

        if (this.isWithinUKBounds(coordinates)) {
          this.lastKnownLocation = coordinates;
          const address = await this.reverseGeocode(coordinates);
          
          callback({
            coordinates,
            address,
            accuracy: coordinates.accuracy && coordinates.accuracy < 100 ? 'high' : 'medium',
            source: 'gps',
          });
        }
      },
      errorCallback,
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 60000, // 1 minute
      }
    );

    return this.watchId;
  }

  // Stop watching position
  clearWatch(): void {
    if (this.watchId !== null) {
      navigator.geolocation.clearWatch(this.watchId);
      this.watchId = null;
    }
  }

  // Get last known location
  getLastKnownLocation(): LocationCoordinates | null {
    return this.lastKnownLocation;
  }
}

// Address autocomplete service
export class AddressAutocompleteService {
  private static instance: AddressAutocompleteService;
  private debounceTimer: NodeJS.Timeout | null = null;
  private cache = new Map<string, AddressSuggestion[]>();
  private readonly DEBOUNCE_DELAY = 300; // ms
  private readonly CACHE_DURATION = 300000; // 5 minutes

  static getInstance(): AddressAutocompleteService {
    if (!AddressAutocompleteService.instance) {
      AddressAutocompleteService.instance = new AddressAutocompleteService();
    }
    return AddressAutocompleteService.instance;
  }

  // Debounced address search
  async searchAddresses(
    query: string,
    options?: {
      proximity?: LocationCoordinates;
      types?: string[];
      limit?: number;
    }
  ): Promise<AddressSuggestion[]> {
    return new Promise((resolve, reject) => {
      // Clear previous debounce timer
      if (this.debounceTimer) {
        clearTimeout(this.debounceTimer);
      }

      // Set new debounce timer
      this.debounceTimer = setTimeout(async () => {
        try {
          const results = await this.performSearch(query, options);
          resolve(results);
        } catch (error) {
          reject(error);
        }
      }, this.DEBOUNCE_DELAY);
    });
  }

  // Perform the actual search
  private async performSearch(
    query: string,
    options?: {
      proximity?: LocationCoordinates;
      types?: string[];
      limit?: number;
    }
  ): Promise<AddressSuggestion[]> {
    if (!MAPBOX_TOKEN) {
      throw new Error('Mapbox token not configured');
    }

    if (query.length < 3) {
      return [];
    }

    // Check cache first
    const cacheKey = this.getCacheKey(query, options);
    const cached = this.cache.get(cacheKey);
    if (cached) {
      return cached;
    }

    try {
      const params = new URLSearchParams({
        access_token: MAPBOX_TOKEN,
        country: 'GB', // Restrict to UK only
        limit: (options?.limit || 5).toString(),
        types: (options?.types || ['address', 'poi']).join(','),
      });

      // Add proximity if provided (bias results towards user's location)
      if (options?.proximity) {
        params.append('proximity', `${options.proximity.lng},${options.proximity.lat}`);
      }

      // Add bbox to restrict to UK bounds
      params.append('bbox', `${UK_BOUNDS.southwest.lng},${UK_BOUNDS.southwest.lat},${UK_BOUNDS.northeast.lng},${UK_BOUNDS.northeast.lat}`);

      const url = `${MAPBOX_GEOCODING_URL}/${encodeURIComponent(query)}.json?${params}`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Geocoding API error: ${response.status}`);
      }

      const data = await response.json();
      const suggestions: AddressSuggestion[] = data.features.map((feature: any) => ({
        id: feature.id,
        text: feature.text,
        place_name: feature.place_name,
        center: feature.center,
        context: feature.context || [],
        properties: feature.properties,
        bbox: feature.bbox,
      }));

      // Cache the results
      this.cache.set(cacheKey, suggestions);
      
      // Clear cache after duration
      setTimeout(() => {
        this.cache.delete(cacheKey);
      }, this.CACHE_DURATION);

      return suggestions;
    } catch (error) {
      console.error('Address search failed:', error);
      throw error;
    }
  }

  // Generate cache key
  private getCacheKey(query: string, options?: any): string {
    return `${query.toLowerCase()}-${JSON.stringify(options || {})}`;
  }

  // Get detailed address information
  async getAddressDetails(suggestion: AddressSuggestion): Promise<{
    formatted: string;
    components: {
      houseNumber?: string;
      street?: string;
      city?: string;
      district?: string;
      postcode?: string;
      county?: string;
    };
    coordinates: LocationCoordinates;
  }> {
    const coordinates = {
      lat: suggestion.center[1],
      lng: suggestion.center[0],
    };

    // Parse address components from context
    const components: any = {};
    
    if (suggestion.context) {
      suggestion.context.forEach(ctx => {
        if (ctx.id.startsWith('postcode')) {
          components.postcode = ctx.text;
        } else if (ctx.id.startsWith('place')) {
          components.city = ctx.text;
        } else if (ctx.id.startsWith('district')) {
          components.district = ctx.text;
        } else if (ctx.id.startsWith('region')) {
          components.county = ctx.text;
        }
      });
    }

    // Extract house number and street from the main text
    const addressParts = suggestion.text.split(' ');
    if (addressParts.length > 1 && /^\d+/.test(addressParts[0])) {
      components.houseNumber = addressParts[0];
      components.street = addressParts.slice(1).join(' ');
    } else {
      components.street = suggestion.text;
    }

    return {
      formatted: suggestion.place_name,
      components,
      coordinates,
    };
  }

  // Validate UK postcode
  validatePostcode(postcode: string): boolean {
    const ukPostcodeRegex = /^[A-Z]{1,2}[0-9][A-Z0-9]? ?[0-9][A-Z]{2}$/i;
    return ukPostcodeRegex.test(postcode.trim());
  }

  // Format postcode
  formatPostcode(postcode: string): string {
    const cleaned = postcode.replace(/\s+/g, '').toUpperCase();
    if (cleaned.length >= 5) {
      return `${cleaned.slice(0, -3)} ${cleaned.slice(-3)}`;
    }
    return cleaned;
  }

  // Clear cache
  clearCache(): void {
    this.cache.clear();
  }
}

// Distance calculation utilities
export const calculateDistance = (
  point1: LocationCoordinates,
  point2: LocationCoordinates
): number => {
  const R = 6371; // Earth's radius in kilometers
  const dLat = toRadians(point2.lat - point1.lat);
  const dLng = toRadians(point2.lng - point1.lng);
  
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(point1.lat)) * Math.cos(toRadians(point2.lat)) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  
  return R * c; // Distance in kilometers
};

const toRadians = (degrees: number): number => {
  return degrees * (Math.PI / 180);
};

// Get route information using Mapbox Directions API
export const getRouteInfo = async (
  origin: LocationCoordinates,
  destination: LocationCoordinates
): Promise<{
  distance: number; // in kilometers
  duration: number; // in minutes
  geometry?: string;
}> => {
  if (!MAPBOX_TOKEN) {
    throw new Error('Mapbox token not configured');
  }

  try {
    const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${origin.lng},${origin.lat};${destination.lng},${destination.lat}?access_token=${MAPBOX_TOKEN}&geometries=geojson&overview=simplified`;
    
    const response = await fetch(url);
    const data = await response.json();
    
    if (data.routes && data.routes.length > 0) {
      const route = data.routes[0];
      return {
        distance: route.distance / 1000, // Convert to kilometers
        duration: route.duration / 60, // Convert to minutes
        geometry: JSON.stringify(route.geometry),
      };
    } else {
      // Fallback to straight-line distance
      const distance = calculateDistance(origin, destination);
      return {
        distance,
        duration: distance * 2, // Rough estimate: 2 minutes per km in city
      };
    }
  } catch (error) {
    console.error('Route calculation failed:', error);
    // Fallback to straight-line distance
    const distance = calculateDistance(origin, destination);
    return {
      distance,
      duration: distance * 2,
    };
  }
};

// Export singleton instances
export const locationService = LocationService.getInstance();
export const addressAutocompleteService = AddressAutocompleteService.getInstance();

