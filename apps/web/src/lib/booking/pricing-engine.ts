import { BookingItem, ServiceType, PricingBreakdown, Coordinates } from './schemas';
import { EnhancedTimeSlot } from './schedule-service';
import { addDays, isWeekend, format } from 'date-fns';

// Pricing configuration
const PRICING_CONFIG = {
  // Base rates
  baseFee: 25.00, // Minimum booking fee
  vatRate: 0.20, // 20% VAT
  
  // Distance-based pricing
  freeDistanceKm: 5, // First 5km free
  pricePerKm: 1.50, // £1.50 per km after free distance
  longDistanceSurcharge: 0.25, // Additional 25p per km for distances > 50km
  longDistanceThreshold: 50,
  
  // Volume-based pricing
  pricePerCubicMeter: 8.00, // £8 per m³
  volumeDiscountThreshold: 10, // Discount for bookings > 10m³
  volumeDiscountRate: 0.10, // 10% discount for large volumes
  
  // Time-based pricing
  minimumDuration: 2, // Minimum 2 hours
  pricePerHour: 35.00, // £35 per hour
  overtimeMultiplier: 1.5, // 50% extra for overtime
  
  // Service-specific multipliers
  serviceMultipliers: {
    'man-and-van': 1.0,
    'van-only': 0.8,
    'large-van': 1.3,
    'multiple-trips': 1.2,
    'premium': 1.5,
  },
  
  // Seasonal multipliers
  seasonalMultipliers: {
    peak: 1.2, // Summer, Christmas
    high: 1.1, // Spring, Autumn
    normal: 1.0, // Winter (except Christmas)
  },
  
  // Demand-based multipliers
  demandMultipliers: {
    low: 0.95,
    medium: 1.0,
    high: 1.15,
    veryHigh: 1.3,
  },
  
  // Special item surcharges
  specialItemSurcharges: {
    piano: 50.00,
    antique: 25.00,
    artwork: 30.00,
    fragile: 15.00,
    valuable: 20.00,
    heavy: 10.00, // Items > 50kg
  },
  
  // Property access surcharges
  accessSurcharges: {
    noLift: 15.00, // Per floor above ground
    narrowAccess: 20.00,
    longCarry: 25.00, // > 50m from parking
    stairs: 10.00, // Per floor
  },
  
  // Promotional discount limits
  maxDiscountPercentage: 30,
  maxDiscountAmount: 100.00,
} as const;

// Service type definitions
export const SERVICE_TYPES: Record<string, ServiceType> = {
  'man-and-van': {
    id: 'man-and-van',
    name: 'Man & Van',
    description: 'Professional driver with helper for loading/unloading',
    basePrice: 45.00,
    pricePerKm: 1.50,
    pricePerHour: 35.00,
    includedServices: ['Loading/unloading', 'Basic packing materials', 'Furniture protection'],
    maxVolume: 15,
    maxWeight: 1000,
    crewSize: 2,
    vehicleType: 'Transit Van',
  },
  'van-only': {
    id: 'van-only',
    name: 'Van Only',
    description: 'Self-drive van rental for DIY moves',
    basePrice: 35.00,
    pricePerKm: 1.20,
    includedServices: ['Van rental', 'Basic insurance', 'Fuel included'],
    maxVolume: 12,
    maxWeight: 800,
    crewSize: 0,
    vehicleType: 'Transit Van',
  },
  'large-van': {
    id: 'large-van',
    name: 'Large Van Service',
    description: 'Larger vehicle for bigger moves with 2-person crew',
    basePrice: 65.00,
    pricePerKm: 2.00,
    pricePerHour: 45.00,
    includedServices: ['2-person crew', 'Loading/unloading', 'Furniture protection', 'Blankets & straps'],
    maxVolume: 25,
    maxWeight: 1500,
    crewSize: 2,
    vehicleType: 'Luton Van',
  },
  'multiple-trips': {
    id: 'multiple-trips',
    name: 'Multiple Trips',
    description: 'Multiple van trips for large moves',
    basePrice: 55.00,
    pricePerKm: 1.75,
    pricePerHour: 40.00,
    includedServices: ['Multiple trips', '2-person crew', 'Coordination', 'Flexible scheduling'],
    maxVolume: 50,
    maxWeight: 3000,
    crewSize: 2,
    vehicleType: 'Multiple Vans',
  },
  'premium': {
    id: 'premium',
    name: 'Premium Service',
    description: 'White-glove service with full packing and insurance',
    basePrice: 85.00,
    pricePerKm: 2.50,
    pricePerHour: 60.00,
    includedServices: ['Full packing service', 'Premium insurance', 'Disassembly/assembly', 'White-glove handling'],
    maxVolume: 30,
    maxWeight: 2000,
    crewSize: 3,
    vehicleType: 'Premium Van',
  },
};

// Promotional codes
export interface PromoCode {
  code: string;
  type: 'percentage' | 'fixed' | 'free_service';
  value: number;
  description: string;
  minOrderValue?: number;
  maxDiscount?: number;
  validUntil?: Date;
  usageLimit?: number;
  usedCount: number;
  conditions?: {
    firstTimeCustomer?: boolean;
    serviceTypes?: string[];
    minimumDistance?: number;
    minimumVolume?: number;
  };
}

const PROMO_CODES: Record<string, PromoCode> = {
  'FIRST20': {
    code: 'FIRST20',
    type: 'percentage',
    value: 20,
    description: '20% off your first booking',
    maxDiscount: 50.00,
    usedCount: 0,
    conditions: { firstTimeCustomer: true },
  },
  'SAVE15': {
    code: 'SAVE15',
    type: 'percentage',
    value: 15,
    description: '15% off any booking',
    minOrderValue: 100.00,
    maxDiscount: 75.00,
    usedCount: 0,
  },
  'FREEPACKING': {
    code: 'FREEPACKING',
    type: 'free_service',
    value: 25.00,
    description: 'Free packing materials',
    minOrderValue: 80.00,
    usedCount: 0,
  },
  'STUDENT10': {
    code: 'STUDENT10',
    type: 'percentage',
    value: 10,
    description: 'Student discount',
    maxDiscount: 30.00,
    usedCount: 0,
  },
};

// Pricing calculation interfaces
export interface PricingInput {
  items: BookingItem[];
  serviceType: string;
  distance: number;
  estimatedDuration: number;
  timeSlot: EnhancedTimeSlot;
  date: Date;
  pickupProperty: {
    floor: number;
    hasLift: boolean;
    narrowAccess: boolean;
    longCarry?: boolean;
  };
  dropoffProperty: {
    floor: number;
    hasLift: boolean;
    narrowAccess: boolean;
    longCarry?: boolean;
  };
  promoCode?: string;
  isFirstTimeCustomer?: boolean;
  coordinates?: {
    pickup: Coordinates;
    dropoff: Coordinates;
  };
}

export interface DetailedPricingBreakdown extends PricingBreakdown {
  breakdown: {
    baseFee: number;
    serviceCharge: number;
    volumeCharge: number;
    distanceCharge: number;
    timeCharge: number;
    timeSlotMultiplier: number;
    seasonalMultiplier: number;
    demandMultiplier: number;
    specialItemSurcharges: Array<{ name: string; amount: number }>;
    accessSurcharges: Array<{ name: string; amount: number }>;
    promoDiscount: number;
    subtotalBeforeVAT: number;
    vatAmount: number;
    finalTotal: number;
  };
  recommendations?: {
    suggestedService?: string;
    potentialSavings?: Array<{ description: string; amount: number }>;
    upgradeOptions?: Array<{ service: string; additionalCost: number; benefits: string[] }>;
  };
}

// Main pricing engine class
export class PricingEngine {
  private cache = new Map<string, DetailedPricingBreakdown>();
  private cacheExpiry = new Map<string, number>();
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  // Calculate comprehensive pricing
  calculatePricing(input: PricingInput): DetailedPricingBreakdown {
    // Check cache first
    const cacheKey = this.generateCacheKey(input);
    if (this.isCacheValid(cacheKey)) {
      return this.cache.get(cacheKey)!;
    }

    const serviceType = SERVICE_TYPES[input.serviceType];
    if (!serviceType) {
      throw new Error(`Invalid service type: ${input.serviceType}`);
    }

    // Calculate base components
    const baseFee = PRICING_CONFIG.baseFee;
    const serviceCharge = serviceType.basePrice;
    
    // Volume-based pricing
    const totalVolume = input.items.reduce((sum, item) => sum + (item.volume * item.quantity), 0);
    let volumeCharge = totalVolume * PRICING_CONFIG.pricePerCubicMeter;
    
    // Apply volume discount for large bookings
    if (totalVolume > PRICING_CONFIG.volumeDiscountThreshold) {
      volumeCharge *= (1 - PRICING_CONFIG.volumeDiscountRate);
    }

    // Distance-based pricing
    let distanceCharge = 0;
    if (input.distance > PRICING_CONFIG.freeDistanceKm) {
      const chargeableDistance = input.distance - PRICING_CONFIG.freeDistanceKm;
      distanceCharge = chargeableDistance * PRICING_CONFIG.pricePerKm;
      
      // Long distance surcharge
      if (input.distance > PRICING_CONFIG.longDistanceThreshold) {
        const longDistance = input.distance - PRICING_CONFIG.longDistanceThreshold;
        distanceCharge += longDistance * PRICING_CONFIG.longDistanceSurcharge;
      }
    }

    // Time-based pricing
    const duration = Math.max(input.estimatedDuration, PRICING_CONFIG.minimumDuration);
    const timeCharge = duration * PRICING_CONFIG.pricePerHour;

    // Apply multipliers
    const timeSlotMultiplier = input.timeSlot.multiplier;
    const seasonalMultiplier = this.getSeasonalMultiplier(input.date);
    const demandMultiplier = this.getDemandMultiplier(input.date, input.timeSlot);
    const serviceMultiplier = PRICING_CONFIG.serviceMultipliers[input.serviceType as keyof typeof PRICING_CONFIG.serviceMultipliers] || 1.0;

    // Calculate special item surcharges
    const specialItemSurcharges = this.calculateSpecialItemSurcharges(input.items);

    // Calculate access surcharges
    const accessSurcharges = this.calculateAccessSurcharges(input.pickupProperty, input.dropoffProperty);

    // Calculate subtotal before discounts
    let subtotal = (baseFee + serviceCharge + volumeCharge + distanceCharge + timeCharge) * 
                   serviceMultiplier * timeSlotMultiplier * seasonalMultiplier * demandMultiplier;
    
    // Add surcharges
    subtotal += specialItemSurcharges.reduce((sum, s) => sum + s.amount, 0);
    subtotal += accessSurcharges.reduce((sum, s) => sum + s.amount, 0);

    // Apply promotional discount
    const promoDiscount = this.calculatePromoDiscount(input.promoCode, subtotal, input);

    // Calculate final amounts
    const subtotalBeforeVAT = Math.max(0, subtotal - promoDiscount);
    const vatAmount = subtotalBeforeVAT * PRICING_CONFIG.vatRate;
    const finalTotal = subtotalBeforeVAT + vatAmount;

    // Generate recommendations
    const recommendations = this.generateRecommendations(input, subtotal);

    const breakdown: DetailedPricingBreakdown = {
      basePrice: baseFee,
      itemsPrice: volumeCharge,
      distancePrice: distanceCharge,
      timePrice: timeCharge,
      servicePrice: serviceCharge,
      surcharges: [
        ...specialItemSurcharges.map(s => ({ name: s.name, amount: s.amount, description: `Special handling for ${s.name}` })),
        ...accessSurcharges.map(s => ({ name: s.name, amount: s.amount, description: `Access difficulty: ${s.name}` })),
      ],
      discounts: promoDiscount > 0 ? [{ name: input.promoCode || 'Discount', amount: promoDiscount, description: 'Promotional discount applied' }] : [],
      subtotal: subtotalBeforeVAT,
      vat: vatAmount,
      total: finalTotal,
      breakdown: {
        baseFee,
        serviceCharge,
        volumeCharge,
        distanceCharge,
        timeCharge,
        timeSlotMultiplier,
        seasonalMultiplier,
        demandMultiplier,
        specialItemSurcharges,
        accessSurcharges,
        promoDiscount,
        subtotalBeforeVAT,
        vatAmount,
        finalTotal,
      },
      recommendations,
    };

    // Cache the result
    this.cache.set(cacheKey, breakdown);
    this.cacheExpiry.set(cacheKey, Date.now() + this.CACHE_DURATION);

    return breakdown;
  }

  // Get service recommendations based on items and requirements
  getServiceRecommendations(
    items: BookingItem[],
    distance: number,
    requirements?: {
      budget?: number;
      timePreference?: 'fast' | 'economical' | 'premium';
      helpNeeded?: boolean;
    }
  ): Array<{
    serviceType: ServiceType;
    score: number;
    reasons: string[];
    estimatedPrice: number;
  }> {
    const totalVolume = items.reduce((sum, item) => sum + (item.volume * item.quantity), 0);
    const totalWeight = items.reduce((sum, item) => sum + ((item.weight || 0) * item.quantity), 0);
    const hasFragileItems = items.some(item => item.fragile);
    const hasValuableItems = items.some(item => item.valuable);

    const recommendations = Object.values(SERVICE_TYPES).map(service => {
      let score = 0;
      const reasons: string[] = [];

      // Volume compatibility
      if (totalVolume <= service.maxVolume) {
        score += 20;
        reasons.push('Suitable for your volume');
      } else {
        score -= 30;
        reasons.push('May require multiple trips');
      }

      // Weight compatibility
      if (totalWeight <= service.maxWeight) {
        score += 15;
      } else {
        score -= 20;
      }

      // Distance suitability
      if (distance > 50 && service.id === 'premium') {
        score += 10;
        reasons.push('Best for long-distance moves');
      }

      // Fragile items
      if (hasFragileItems) {
        if (service.id === 'premium' || service.crewSize >= 2) {
          score += 15;
          reasons.push('Professional handling for fragile items');
        }
      }

      // Valuable items
      if (hasValuableItems && service.id === 'premium') {
        score += 10;
        reasons.push('Premium insurance included');
      }

      // Budget considerations
      if (requirements?.budget) {
        const estimatedPrice = this.estimateServicePrice(service, totalVolume, distance);
        if (estimatedPrice <= requirements.budget) {
          score += 10;
          reasons.push('Within your budget');
        } else {
          score -= 15;
        }
      }

      // Time preference
      if (requirements?.timePreference === 'fast' && service.crewSize >= 2) {
        score += 10;
        reasons.push('Faster with professional crew');
      } else if (requirements?.timePreference === 'economical' && service.id === 'van-only') {
        score += 15;
        reasons.push('Most economical option');
      } else if (requirements?.timePreference === 'premium' && service.id === 'premium') {
        score += 20;
        reasons.push('Premium service quality');
      }

      // Help needed
      if (requirements?.helpNeeded === false && service.id === 'van-only') {
        score += 10;
        reasons.push('Perfect for DIY moves');
      } else if (requirements?.helpNeeded !== false && service.crewSize > 0) {
        score += 10;
        reasons.push('Professional help included');
      }

      const estimatedPrice = this.estimateServicePrice(service, totalVolume, distance);

      return {
        serviceType: service,
        score: Math.max(0, score),
        reasons,
        estimatedPrice,
      };
    });

    return recommendations.sort((a, b) => b.score - a.score);
  }

  // Validate and apply promo code
  validatePromoCode(
    code: string,
    orderValue: number,
    input: Partial<PricingInput>
  ): {
    valid: boolean;
    discount: number;
    error?: string;
    promoCode?: PromoCode;
  } {
    const promoCode = PROMO_CODES[code.toUpperCase()];
    
    if (!promoCode) {
      return { valid: false, discount: 0, error: 'Invalid promo code' };
    }

    // Check minimum order value
    if (promoCode.minOrderValue && orderValue < promoCode.minOrderValue) {
      return {
        valid: false,
        discount: 0,
        error: `Minimum order value £${promoCode.minOrderValue} required`,
      };
    }

    // Check expiry date
    if (promoCode.validUntil && new Date() > promoCode.validUntil) {
      return { valid: false, discount: 0, error: 'Promo code has expired' };
    }

    // Check usage limit
    if (promoCode.usageLimit && promoCode.usedCount >= promoCode.usageLimit) {
      return { valid: false, discount: 0, error: 'Promo code usage limit reached' };
    }

    // Check conditions
    if (promoCode.conditions) {
      const { conditions } = promoCode;
      
      if (conditions.firstTimeCustomer && !input.isFirstTimeCustomer) {
        return { valid: false, discount: 0, error: 'This code is for first-time customers only' };
      }

      if (conditions.serviceTypes && input.serviceType && !conditions.serviceTypes.includes(input.serviceType)) {
        return { valid: false, discount: 0, error: 'This code is not valid for the selected service' };
      }

      if (conditions.minimumDistance && input.distance && input.distance < conditions.minimumDistance) {
        return { valid: false, discount: 0, error: `Minimum distance of ${conditions.minimumDistance}km required` };
      }
    }

    // Calculate discount
    let discount = 0;
    if (promoCode.type === 'percentage') {
      discount = orderValue * (promoCode.value / 100);
      if (promoCode.maxDiscount) {
        discount = Math.min(discount, promoCode.maxDiscount);
      }
    } else if (promoCode.type === 'fixed') {
      discount = promoCode.value;
    } else if (promoCode.type === 'free_service') {
      discount = promoCode.value;
    }

    // Apply maximum discount limits
    discount = Math.min(discount, PRICING_CONFIG.maxDiscountAmount);
    discount = Math.min(discount, orderValue * (PRICING_CONFIG.maxDiscountPercentage / 100));

    return { valid: true, discount, promoCode };
  }

  // Private helper methods
  private generateCacheKey(input: PricingInput): string {
    return JSON.stringify({
      items: input.items.map(item => ({ id: item.id, quantity: item.quantity })),
      serviceType: input.serviceType,
      distance: input.distance,
      duration: input.estimatedDuration,
      timeSlot: input.timeSlot.id,
      date: format(input.date, 'yyyy-MM-dd'),
      promoCode: input.promoCode,
    });
  }

  private isCacheValid(key: string): boolean {
    const expiry = this.cacheExpiry.get(key);
    return expiry ? Date.now() < expiry : false;
  }

  private getSeasonalMultiplier(date: Date): number {
    const month = date.getMonth() + 1;
    
    // Peak season: June-August, December
    if (month >= 6 && month <= 8 || month === 12) {
      return PRICING_CONFIG.seasonalMultipliers.peak;
    }
    
    // High season: March-May, September-November
    if ((month >= 3 && month <= 5) || (month >= 9 && month <= 11)) {
      return PRICING_CONFIG.seasonalMultipliers.high;
    }
    
    // Normal season: January-February
    return PRICING_CONFIG.seasonalMultipliers.normal;
  }

  private getDemandMultiplier(date: Date, timeSlot: EnhancedTimeSlot): number {
    let multiplier = PRICING_CONFIG.demandMultipliers.medium;
    
    // Weekend demand
    if (isWeekend(date)) {
      multiplier = PRICING_CONFIG.demandMultipliers.high;
    }
    
    // Time slot demand
    if (timeSlot.demand === 'high') {
      multiplier = Math.max(multiplier, PRICING_CONFIG.demandMultipliers.high);
    } else if (timeSlot.demand === 'low') {
      multiplier = PRICING_CONFIG.demandMultipliers.low;
    }
    
    return multiplier;
  }

  private calculateSpecialItemSurcharges(items: BookingItem[]): Array<{ name: string; amount: number }> {
    const surcharges: Array<{ name: string; amount: number }> = [];
    
    items.forEach(item => {
      const quantity = item.quantity;
      
      // Check for special items by name
      if (item.name.toLowerCase().includes('piano')) {
        surcharges.push({ name: 'Piano', amount: PRICING_CONFIG.specialItemSurcharges.piano * quantity });
      }
      
      if (item.fragile) {
        surcharges.push({ name: 'Fragile Items', amount: PRICING_CONFIG.specialItemSurcharges.fragile * quantity });
      }
      
      if (item.valuable) {
        surcharges.push({ name: 'Valuable Items', amount: PRICING_CONFIG.specialItemSurcharges.valuable * quantity });
      }
      
      // Heavy items (estimated based on volume)
      if (item.weight && item.weight > 50) {
        surcharges.push({ name: 'Heavy Items', amount: PRICING_CONFIG.specialItemSurcharges.heavy * quantity });
      }
    });
    
    return surcharges;
  }

  private calculateAccessSurcharges(
    pickupProperty: PricingInput['pickupProperty'],
    dropoffProperty: PricingInput['dropoffProperty']
  ): Array<{ name: string; amount: number }> {
    const surcharges: Array<{ name: string; amount: number }> = [];
    
    // Pickup property surcharges
    if (pickupProperty.floor > 0 && !pickupProperty.hasLift) {
      surcharges.push({
        name: 'Pickup - No Lift',
        amount: PRICING_CONFIG.accessSurcharges.noLift * pickupProperty.floor,
      });
    }
    
    if (pickupProperty.narrowAccess) {
      surcharges.push({
        name: 'Pickup - Narrow Access',
        amount: PRICING_CONFIG.accessSurcharges.narrowAccess,
      });
    }
    
    if (pickupProperty.longCarry) {
      surcharges.push({
        name: 'Pickup - Long Carry',
        amount: PRICING_CONFIG.accessSurcharges.longCarry,
      });
    }
    
    // Dropoff property surcharges
    if (dropoffProperty.floor > 0 && !dropoffProperty.hasLift) {
      surcharges.push({
        name: 'Dropoff - No Lift',
        amount: PRICING_CONFIG.accessSurcharges.noLift * dropoffProperty.floor,
      });
    }
    
    if (dropoffProperty.narrowAccess) {
      surcharges.push({
        name: 'Dropoff - Narrow Access',
        amount: PRICING_CONFIG.accessSurcharges.narrowAccess,
      });
    }
    
    if (dropoffProperty.longCarry) {
      surcharges.push({
        name: 'Dropoff - Long Carry',
        amount: PRICING_CONFIG.accessSurcharges.longCarry,
      });
    }
    
    return surcharges;
  }

  private calculatePromoDiscount(
    promoCode: string | undefined,
    orderValue: number,
    input: PricingInput
  ): number {
    if (!promoCode) return 0;
    
    const validation = this.validatePromoCode(promoCode, orderValue, input);
    return validation.valid ? validation.discount : 0;
  }

  private generateRecommendations(
    input: PricingInput,
    currentPrice: number
  ): DetailedPricingBreakdown['recommendations'] {
    const recommendations: DetailedPricingBreakdown['recommendations'] = {
      potentialSavings: [],
      upgradeOptions: [],
    };

    // Suggest service type optimization
    const serviceRecommendations = this.getServiceRecommendations(input.items, input.distance);
    const currentServiceScore = serviceRecommendations.find(r => r.serviceType.id === input.serviceType)?.score || 0;
    const bestService = serviceRecommendations[0];

    if (bestService.serviceType.id !== input.serviceType && bestService.score > currentServiceScore) {
      recommendations.suggestedService = bestService.serviceType.id;
    }

    // Potential savings suggestions
    if (input.timeSlot.savings) {
      recommendations.potentialSavings?.push({
        description: `Choose off-peak time slot`,
        amount: (currentPrice * input.timeSlot.savings) / 100,
      });
    }

    // Upgrade options
    if (input.serviceType !== 'premium') {
      const premiumService = SERVICE_TYPES.premium;
      const additionalCost = premiumService.basePrice - SERVICE_TYPES[input.serviceType].basePrice;
      
      recommendations.upgradeOptions?.push({
        service: 'premium',
        additionalCost,
        benefits: ['Full packing service', 'Premium insurance', 'White-glove handling'],
      });
    }

    return recommendations;
  }

  private estimateServicePrice(service: ServiceType, volume: number, distance: number): number {
    const baseCost = service.basePrice;
    const volumeCost = volume * PRICING_CONFIG.pricePerCubicMeter;
    const distanceCost = Math.max(0, distance - PRICING_CONFIG.freeDistanceKm) * PRICING_CONFIG.pricePerKm;
    
    return baseCost + volumeCost + distanceCost;
  }
}

// Create singleton instance
export const pricingEngine = new PricingEngine();

// React hook for using pricing engine
export const usePricingEngine = () => {
  return pricingEngine;
};

export { PRICING_CONFIG, PROMO_CODES };

