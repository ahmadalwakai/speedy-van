import { PricingEngine } from '../pricing-engine';
import { BookingItem, TimeSlot, PropertyDetails } from '../schemas';

describe('PricingEngine', () => {
  let pricingEngine: PricingEngine;

  beforeEach(() => {
    pricingEngine = new PricingEngine();
  });

  describe('Basic Pricing Calculation', () => {
    const mockItems: BookingItem[] = [
      {
        id: '1',
        name: 'Sofa',
        category: 'furniture',
        volume: 2.5,
        weight: 50,
        quantity: 1,
        fragile: false,
        valuable: false,
      },
      {
        id: '2',
        name: 'Box (Small)',
        category: 'boxes',
        volume: 0.1,
        weight: 5,
        quantity: 10,
        fragile: false,
        valuable: false,
      },
    ];

    const mockTimeSlot: TimeSlot = {
      startTime: '10:00',
      endTime: '12:00',
      available: true,
      price: 0,
      demand: 'medium',
    };

    const mockProperty: PropertyDetails = {
      type: 'house',
      floor: 0,
      hasLift: false,
      narrowAccess: false,
    };

    test('calculates basic pricing correctly', () => {
      const result = pricingEngine.calculatePricing({
        items: mockItems,
        serviceType: 'man-and-van',
        distance: 10,
        estimatedDuration: 3,
        timeSlot: mockTimeSlot,
        date: new Date('2024-06-15'),
        pickupProperty: mockProperty,
        dropoffProperty: mockProperty,
        isFirstTimeCustomer: false,
      });

      expect(result.basePrice).toBe(25);
      expect(result.servicePrice).toBe(45);
      expect(result.total).toBeGreaterThan(100);
      expect(result.vat).toBe(result.subtotal * 0.2);
    });

    test('applies volume-based pricing', () => {
      const smallVolumeItems: BookingItem[] = [
        {
          id: '1',
          name: 'Small Box',
          category: 'boxes',
          volume: 0.1,
          weight: 2,
          quantity: 1,
          fragile: false,
          valuable: false,
        },
      ];

      const largeVolumeItems: BookingItem[] = [
        {
          id: '1',
          name: 'Large Furniture',
          category: 'furniture',
          volume: 10,
          weight: 100,
          quantity: 1,
          fragile: false,
          valuable: false,
        },
      ];

      const smallResult = pricingEngine.calculatePricing({
        items: smallVolumeItems,
        serviceType: 'man-and-van',
        distance: 5,
        estimatedDuration: 2,
        timeSlot: mockTimeSlot,
        date: new Date('2024-06-15'),
        pickupProperty: mockProperty,
        dropoffProperty: mockProperty,
        isFirstTimeCustomer: false,
      });

      const largeResult = pricingEngine.calculatePricing({
        items: largeVolumeItems,
        serviceType: 'man-and-van',
        distance: 5,
        estimatedDuration: 2,
        timeSlot: mockTimeSlot,
        date: new Date('2024-06-15'),
        pickupProperty: mockProperty,
        dropoffProperty: mockProperty,
        isFirstTimeCustomer: false,
      });

      expect(largeResult.itemsPrice).toBeGreaterThan(smallResult.itemsPrice);
    });

    test('applies distance-based pricing', () => {
      const shortDistance = pricingEngine.calculatePricing({
        items: mockItems,
        serviceType: 'man-and-van',
        distance: 3,
        estimatedDuration: 2,
        timeSlot: mockTimeSlot,
        date: new Date('2024-06-15'),
        pickupProperty: mockProperty,
        dropoffProperty: mockProperty,
        isFirstTimeCustomer: false,
      });

      const longDistance = pricingEngine.calculatePricing({
        items: mockItems,
        serviceType: 'man-and-van',
        distance: 20,
        estimatedDuration: 2,
        timeSlot: mockTimeSlot,
        date: new Date('2024-06-15'),
        pickupProperty: mockProperty,
        dropoffProperty: mockProperty,
        isFirstTimeCustomer: false,
      });

      expect(longDistance.distancePrice).toBeGreaterThan(shortDistance.distancePrice);
    });

    test('applies time-based pricing', () => {
      const shortDuration = pricingEngine.calculatePricing({
        items: mockItems,
        serviceType: 'man-and-van',
        distance: 5,
        estimatedDuration: 1,
        timeSlot: mockTimeSlot,
        date: new Date('2024-06-15'),
        pickupProperty: mockProperty,
        dropoffProperty: mockProperty,
        isFirstTimeCustomer: false,
      });

      const longDuration = pricingEngine.calculatePricing({
        items: mockItems,
        serviceType: 'man-and-van',
        distance: 5,
        estimatedDuration: 5,
        timeSlot: mockTimeSlot,
        date: new Date('2024-06-15'),
        pickupProperty: mockProperty,
        dropoffProperty: mockProperty,
        isFirstTimeCustomer: false,
      });

      expect(longDuration.timePrice).toBeGreaterThan(shortDuration.timePrice);
    });
  });

  describe('Service Type Pricing', () => {
    const mockItems: BookingItem[] = [
      {
        id: '1',
        name: 'Sofa',
        category: 'furniture',
        volume: 2.5,
        weight: 50,
        quantity: 1,
        fragile: false,
        valuable: false,
      },
    ];

    const mockTimeSlot: TimeSlot = {
      startTime: '10:00',
      endTime: '12:00',
      available: true,
      price: 0,
      demand: 'medium',
    };

    const mockProperty: PropertyDetails = {
      type: 'house',
      floor: 0,
      hasLift: false,
      narrowAccess: false,
    };

    test('applies different service type pricing', () => {
      const vanOnly = pricingEngine.calculatePricing({
        items: mockItems,
        serviceType: 'van-only',
        distance: 5,
        estimatedDuration: 2,
        timeSlot: mockTimeSlot,
        date: new Date('2024-06-15'),
        pickupProperty: mockProperty,
        dropoffProperty: mockProperty,
        isFirstTimeCustomer: false,
      });

      const premium = pricingEngine.calculatePricing({
        items: mockItems,
        serviceType: 'premium-service',
        distance: 5,
        estimatedDuration: 2,
        timeSlot: mockTimeSlot,
        date: new Date('2024-06-15'),
        pickupProperty: mockProperty,
        dropoffProperty: mockProperty,
        isFirstTimeCustomer: false,
      });

      expect(premium.servicePrice).toBeGreaterThan(vanOnly.servicePrice);
    });
  });

  describe('Surcharges and Discounts', () => {
    const mockItems: BookingItem[] = [
      {
        id: '1',
        name: 'Piano',
        category: 'furniture',
        volume: 3,
        weight: 200,
        quantity: 1,
        fragile: true,
        valuable: true,
      },
    ];

    const mockTimeSlot: TimeSlot = {
      startTime: '18:00',
      endTime: '20:00',
      available: true,
      price: 0,
      demand: 'high',
    };

    test('applies fragile item surcharge', () => {
      const fragileProperty: PropertyDetails = {
        type: 'apartment',
        floor: 3,
        hasLift: false,
        narrowAccess: true,
      };

      const result = pricingEngine.calculatePricing({
        items: mockItems,
        serviceType: 'man-and-van',
        distance: 5,
        estimatedDuration: 2,
        timeSlot: mockTimeSlot,
        date: new Date('2024-06-15'),
        pickupProperty: fragileProperty,
        dropoffProperty: fragileProperty,
        isFirstTimeCustomer: false,
      });

      const fragileItemSurcharge = result.surcharges.find(s => s.name.includes('Fragile'));
      const floorSurcharge = result.surcharges.find(s => s.name.includes('Floor'));
      const narrowAccessSurcharge = result.surcharges.find(s => s.name.includes('Narrow'));

      expect(fragileItemSurcharge).toBeDefined();
      expect(floorSurcharge).toBeDefined();
      expect(narrowAccessSurcharge).toBeDefined();
    });

    test('applies peak time surcharge', () => {
      const peakTimeSlot: TimeSlot = {
        startTime: '08:00',
        endTime: '10:00',
        available: true,
        price: 0,
        demand: 'high',
      };

      const result = pricingEngine.calculatePricing({
        items: mockItems,
        serviceType: 'man-and-van',
        distance: 5,
        estimatedDuration: 2,
        timeSlot: peakTimeSlot,
        date: new Date('2024-06-17'), // Monday
        pickupProperty: { type: 'house', floor: 0, hasLift: false, narrowAccess: false },
        dropoffProperty: { type: 'house', floor: 0, hasLift: false, narrowAccess: false },
        isFirstTimeCustomer: false,
      });

      const peakSurcharge = result.surcharges.find(s => s.name.includes('Peak'));
      expect(peakSurcharge).toBeDefined();
    });

    test('applies weekend surcharge', () => {
      const result = pricingEngine.calculatePricing({
        items: mockItems,
        serviceType: 'man-and-van',
        distance: 5,
        estimatedDuration: 2,
        timeSlot: mockTimeSlot,
        date: new Date('2024-06-16'), // Sunday
        pickupProperty: { type: 'house', floor: 0, hasLift: false, narrowAccess: false },
        dropoffProperty: { type: 'house', floor: 0, hasLift: false, narrowAccess: false },
        isFirstTimeCustomer: false,
      });

      const weekendSurcharge = result.surcharges.find(s => s.name.includes('Weekend'));
      expect(weekendSurcharge).toBeDefined();
    });

    test('applies first-time customer discount', () => {
      const result = pricingEngine.calculatePricing({
        items: mockItems,
        serviceType: 'man-and-van',
        distance: 5,
        estimatedDuration: 2,
        timeSlot: mockTimeSlot,
        date: new Date('2024-06-15'),
        pickupProperty: { type: 'house', floor: 0, hasLift: false, narrowAccess: false },
        dropoffProperty: { type: 'house', floor: 0, hasLift: false, narrowAccess: false },
        isFirstTimeCustomer: true,
      });

      const firstTimeDiscount = result.discounts.find(d => d.name.includes('First-time'));
      expect(firstTimeDiscount).toBeDefined();
      expect(firstTimeDiscount?.amount).toBeGreaterThan(0);
    });

    test('applies off-peak discount', () => {
      const offPeakTimeSlot: TimeSlot = {
        startTime: '14:00',
        endTime: '16:00',
        available: true,
        price: 0,
        demand: 'low',
      };

      const result = pricingEngine.calculatePricing({
        items: mockItems,
        serviceType: 'man-and-van',
        distance: 5,
        estimatedDuration: 2,
        timeSlot: offPeakTimeSlot,
        date: new Date('2024-06-15'),
        pickupProperty: { type: 'house', floor: 0, hasLift: false, narrowAccess: false },
        dropoffProperty: { type: 'house', floor: 0, hasLift: false, narrowAccess: false },
        isFirstTimeCustomer: false,
      });

      const offPeakDiscount = result.discounts.find(d => d.name.includes('Off-peak'));
      expect(offPeakDiscount).toBeDefined();
    });
  });

  describe('Promo Code Validation', () => {
    test('validates FIRST20 promo code', () => {
      const result = pricingEngine.validatePromoCode('FIRST20', 100, {
        serviceType: 'man-and-van',
        distance: 5,
        isFirstTimeCustomer: true,
      });

      expect(result.valid).toBe(true);
      expect(result.discount).toBe(20);
      expect(result.discountType).toBe('percentage');
    });

    test('validates SAVE15 promo code', () => {
      const result = pricingEngine.validatePromoCode('SAVE15', 100, {
        serviceType: 'man-and-van',
        distance: 5,
        isFirstTimeCustomer: false,
      });

      expect(result.valid).toBe(true);
      expect(result.discount).toBe(15);
      expect(result.discountType).toBe('percentage');
    });

    test('validates FREEPACKING promo code', () => {
      const result = pricingEngine.validatePromoCode('FREEPACKING', 100, {
        serviceType: 'man-and-van',
        distance: 5,
        isFirstTimeCustomer: false,
      });

      expect(result.valid).toBe(true);
      expect(result.discount).toBe(15);
      expect(result.discountType).toBe('fixed');
    });

    test('rejects invalid promo code', () => {
      const result = pricingEngine.validatePromoCode('INVALID', 100, {
        serviceType: 'man-and-van',
        distance: 5,
        isFirstTimeCustomer: false,
      });

      expect(result.valid).toBe(false);
      expect(result.error).toBeDefined();
    });

    test('rejects FIRST20 for non-first-time customers', () => {
      const result = pricingEngine.validatePromoCode('FIRST20', 100, {
        serviceType: 'man-and-van',
        distance: 5,
        isFirstTimeCustomer: false,
      });

      expect(result.valid).toBe(false);
      expect(result.error).toContain('first-time customers');
    });

    test('rejects promo code below minimum order', () => {
      const result = pricingEngine.validatePromoCode('SAVE15', 30, {
        serviceType: 'man-and-van',
        distance: 5,
        isFirstTimeCustomer: false,
      });

      expect(result.valid).toBe(false);
      expect(result.error).toContain('minimum order');
    });
  });

  describe('Service Recommendations', () => {
    test('recommends appropriate service for small move', () => {
      const smallItems: BookingItem[] = [
        {
          id: '1',
          name: 'Box (Small)',
          category: 'boxes',
          volume: 0.1,
          weight: 5,
          quantity: 5,
          fragile: false,
          valuable: false,
        },
      ];

      const recommendations = pricingEngine.getServiceRecommendations({
        items: smallItems,
        distance: 3,
        estimatedDuration: 1,
      });

      expect(recommendations[0].serviceId).toBe('van-only');
      expect(recommendations[0].score).toBeGreaterThan(4);
    });

    test('recommends appropriate service for large move', () => {
      const largeItems: BookingItem[] = [
        {
          id: '1',
          name: 'Sofa',
          category: 'furniture',
          volume: 2.5,
          weight: 50,
          quantity: 1,
          fragile: false,
          valuable: false,
        },
        {
          id: '2',
          name: 'Dining Table',
          category: 'furniture',
          volume: 1.8,
          weight: 40,
          quantity: 1,
          fragile: false,
          valuable: false,
        },
        {
          id: '3',
          name: 'Wardrobe',
          category: 'furniture',
          volume: 3.2,
          weight: 80,
          quantity: 2,
          fragile: false,
          valuable: false,
        },
      ];

      const recommendations = pricingEngine.getServiceRecommendations({
        items: largeItems,
        distance: 15,
        estimatedDuration: 4,
      });

      expect(recommendations[0].serviceId).toBe('multiple-trips');
      expect(recommendations[0].score).toBeGreaterThan(4);
    });

    test('recommends premium service for valuable items', () => {
      const valuableItems: BookingItem[] = [
        {
          id: '1',
          name: 'Piano',
          category: 'furniture',
          volume: 3,
          weight: 200,
          quantity: 1,
          fragile: true,
          valuable: true,
        },
        {
          id: '2',
          name: 'Artwork',
          category: 'other',
          volume: 0.5,
          weight: 10,
          quantity: 3,
          fragile: true,
          valuable: true,
        },
      ];

      const recommendations = pricingEngine.getServiceRecommendations({
        items: valuableItems,
        distance: 10,
        estimatedDuration: 3,
      });

      expect(recommendations[0].serviceId).toBe('premium-service');
      expect(recommendations[0].score).toBeGreaterThan(4);
    });
  });

  describe('Volume Calculations', () => {
    test('calculates total volume correctly', () => {
      const items: BookingItem[] = [
        {
          id: '1',
          name: 'Sofa',
          category: 'furniture',
          volume: 2.5,
          weight: 50,
          quantity: 1,
          fragile: false,
          valuable: false,
        },
        {
          id: '2',
          name: 'Box (Small)',
          category: 'boxes',
          volume: 0.1,
          weight: 5,
          quantity: 10,
          fragile: false,
          valuable: false,
        },
      ];

      const result = pricingEngine.calculatePricing({
        items,
        serviceType: 'man-and-van',
        distance: 5,
        estimatedDuration: 2,
        timeSlot: {
          startTime: '10:00',
          endTime: '12:00',
          available: true,
          price: 0,
          demand: 'medium',
        },
        date: new Date('2024-06-15'),
        pickupProperty: { type: 'house', floor: 0, hasLift: false, narrowAccess: false },
        dropoffProperty: { type: 'house', floor: 0, hasLift: false, narrowAccess: false },
        isFirstTimeCustomer: false,
      });

      const expectedVolume = 2.5 + (0.1 * 10); // 3.5m³
      expect(result.totalVolume).toBe(expectedVolume);
    });

    test('applies volume discounts for large moves', () => {
      const largeVolumeItems: BookingItem[] = [
        {
          id: '1',
          name: 'Large Furniture',
          category: 'furniture',
          volume: 5,
          weight: 100,
          quantity: 3, // 15m³ total
          fragile: false,
          valuable: false,
        },
      ];

      const result = pricingEngine.calculatePricing({
        items: largeVolumeItems,
        serviceType: 'man-and-van',
        distance: 5,
        estimatedDuration: 2,
        timeSlot: {
          startTime: '10:00',
          endTime: '12:00',
          available: true,
          price: 0,
          demand: 'medium',
        },
        date: new Date('2024-06-15'),
        pickupProperty: { type: 'house', floor: 0, hasLift: false, narrowAccess: false },
        dropoffProperty: { type: 'house', floor: 0, hasLift: false, narrowAccess: false },
        isFirstTimeCustomer: false,
      });

      const volumeDiscount = result.discounts.find(d => d.name.includes('Volume'));
      expect(volumeDiscount).toBeDefined();
    });
  });

  describe('Edge Cases', () => {
    test('handles zero distance', () => {
      const items: BookingItem[] = [
        {
          id: '1',
          name: 'Box',
          category: 'boxes',
          volume: 0.1,
          weight: 5,
          quantity: 1,
          fragile: false,
          valuable: false,
        },
      ];

      const result = pricingEngine.calculatePricing({
        items,
        serviceType: 'man-and-van',
        distance: 0,
        estimatedDuration: 1,
        timeSlot: {
          startTime: '10:00',
          endTime: '11:00',
          available: true,
          price: 0,
          demand: 'medium',
        },
        date: new Date('2024-06-15'),
        pickupProperty: { type: 'house', floor: 0, hasLift: false, narrowAccess: false },
        dropoffProperty: { type: 'house', floor: 0, hasLift: false, narrowAccess: false },
        isFirstTimeCustomer: false,
      });

      expect(result.distancePrice).toBe(0);
      expect(result.total).toBeGreaterThan(0);
    });

    test('handles minimum duration', () => {
      const items: BookingItem[] = [
        {
          id: '1',
          name: 'Box',
          category: 'boxes',
          volume: 0.1,
          weight: 5,
          quantity: 1,
          fragile: false,
          valuable: false,
        },
      ];

      const result = pricingEngine.calculatePricing({
        items,
        serviceType: 'man-and-van',
        distance: 1,
        estimatedDuration: 0.5, // Less than minimum
        timeSlot: {
          startTime: '10:00',
          endTime: '10:30',
          available: true,
          price: 0,
          demand: 'medium',
        },
        date: new Date('2024-06-15'),
        pickupProperty: { type: 'house', floor: 0, hasLift: false, narrowAccess: false },
        dropoffProperty: { type: 'house', floor: 0, hasLift: false, narrowAccess: false },
        isFirstTimeCustomer: false,
      });

      // Should apply minimum 2-hour charge
      expect(result.timePrice).toBe(70); // 2 hours * £35/hour
    });

    test('handles empty items array', () => {
      expect(() => {
        pricingEngine.calculatePricing({
          items: [],
          serviceType: 'man-and-van',
          distance: 5,
          estimatedDuration: 2,
          timeSlot: {
            startTime: '10:00',
            endTime: '12:00',
            available: true,
            price: 0,
            demand: 'medium',
          },
          date: new Date('2024-06-15'),
          pickupProperty: { type: 'house', floor: 0, hasLift: false, narrowAccess: false },
          dropoffProperty: { type: 'house', floor: 0, hasLift: false, narrowAccess: false },
          isFirstTimeCustomer: false,
        });
      }).toThrow('No items provided');
    });

    test('handles invalid service type', () => {
      const items: BookingItem[] = [
        {
          id: '1',
          name: 'Box',
          category: 'boxes',
          volume: 0.1,
          weight: 5,
          quantity: 1,
          fragile: false,
          valuable: false,
        },
      ];

      expect(() => {
        pricingEngine.calculatePricing({
          items,
          serviceType: 'invalid-service' as any,
          distance: 5,
          estimatedDuration: 2,
          timeSlot: {
            startTime: '10:00',
            endTime: '12:00',
            available: true,
            price: 0,
            demand: 'medium',
          },
          date: new Date('2024-06-15'),
          pickupProperty: { type: 'house', floor: 0, hasLift: false, narrowAccess: false },
          dropoffProperty: { type: 'house', floor: 0, hasLift: false, narrowAccess: false },
          isFirstTimeCustomer: false,
        });
      }).toThrow('Invalid service type');
    });
  });

  describe('Price Consistency', () => {
    test('ensures consistent pricing for same inputs', () => {
      const items: BookingItem[] = [
        {
          id: '1',
          name: 'Sofa',
          category: 'furniture',
          volume: 2.5,
          weight: 50,
          quantity: 1,
          fragile: false,
          valuable: false,
        },
      ];

      const params = {
        items,
        serviceType: 'man-and-van' as const,
        distance: 10,
        estimatedDuration: 3,
        timeSlot: {
          startTime: '10:00',
          endTime: '13:00',
          available: true,
          price: 0,
          demand: 'medium' as const,
        },
        date: new Date('2024-06-15'),
        pickupProperty: { type: 'house' as const, floor: 0, hasLift: false, narrowAccess: false },
        dropoffProperty: { type: 'house' as const, floor: 0, hasLift: false, narrowAccess: false },
        isFirstTimeCustomer: false,
      };

      const result1 = pricingEngine.calculatePricing(params);
      const result2 = pricingEngine.calculatePricing(params);

      expect(result1.total).toBe(result2.total);
      expect(result1.subtotal).toBe(result2.subtotal);
      expect(result1.vat).toBe(result2.vat);
    });

    test('ensures VAT calculation is always 20%', () => {
      const items: BookingItem[] = [
        {
          id: '1',
          name: 'Box',
          category: 'boxes',
          volume: 0.1,
          weight: 5,
          quantity: 1,
          fragile: false,
          valuable: false,
        },
      ];

      const result = pricingEngine.calculatePricing({
        items,
        serviceType: 'man-and-van',
        distance: 5,
        estimatedDuration: 2,
        timeSlot: {
          startTime: '10:00',
          endTime: '12:00',
          available: true,
          price: 0,
          demand: 'medium',
        },
        date: new Date('2024-06-15'),
        pickupProperty: { type: 'house', floor: 0, hasLift: false, narrowAccess: false },
        dropoffProperty: { type: 'house', floor: 0, hasLift: false, narrowAccess: false },
        isFirstTimeCustomer: false,
      });

      const expectedVAT = Math.round(result.subtotal * 0.2 * 100) / 100;
      expect(result.vat).toBe(expectedVAT);
      expect(result.total).toBe(result.subtotal + result.vat);
    });
  });
});

