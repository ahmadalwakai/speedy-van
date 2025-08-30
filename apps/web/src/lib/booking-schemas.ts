import { z } from 'zod';

// UK Postcode validation regex
const UK_POSTCODE_REGEX = /^[A-Z]{1,2}[0-9][A-Z0-9]? ?[0-9][A-Z]{2}$/i;

// Phone number validation (UK format)
const UK_PHONE_REGEX = /^(?:(?:\+44\s?|0)(?:7\d{9}|[1-9]\d{8,9}))$/;

// Address schema for UK addresses
export const addressSchema = z.object({
  line1: z.string().min(1, 'Address line 1 is required').max(100, 'Address too long'),
  line2: z.string().optional(),
  city: z.string().min(1, 'City is required').max(50, 'City name too long'),
  postcode: z.string().regex(UK_POSTCODE_REGEX, 'Please enter a valid UK postcode'),
  coordinates: z.object({
    lat: z.number(),
    lng: z.number(),
  }).optional(),
});

// Property details schema
export const propertySchema = z.object({
  propertyType: z.enum(['house', 'flat', 'office', 'storage', 'other'], {
    required_error: 'Please select a property type',
  }),
  floor: z.number().min(0, 'Floor cannot be negative').max(50, 'Floor too high').optional(),
  hasLift: z.boolean().default(false),
  accessNotes: z.string().max(200, 'Access notes too long').optional(),
});

// Item schema for moving items
export const itemSchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'Item name is required'),
  category: z.string().min(1, 'Category is required'),
  volume: z.number().min(0.01, 'Volume must be greater than 0'),
  weight: z.number().min(0.1, 'Weight must be greater than 0').optional(),
  quantity: z.number().min(1, 'Quantity must be at least 1').max(99, 'Quantity too high'),
  fragile: z.boolean().default(false),
  valuable: z.boolean().default(false),
  imageUrl: z.string().url().optional(),
});

// Service type schema
export const serviceTypeSchema = z.enum([
  'man-and-van',
  'two-men-and-van',
  'house-removal',
  'office-removal',
  'furniture-delivery',
  'student-move',
], {
  required_error: 'Please select a service type',
});

// Time slot schema
export const timeSlotSchema = z.object({
  date: z.string().min(1, 'Date is required'),
  timeSlot: z.enum(['morning', 'afternoon', 'evening', 'anytime'], {
    required_error: 'Please select a time slot',
  }),
  specificTime: z.string().optional(),
  flexible: z.boolean().default(false),
});

// Customer details schema
export const customerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(50, 'Name too long'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().regex(UK_PHONE_REGEX, 'Please enter a valid UK phone number'),
  alternativePhone: z.string().regex(UK_PHONE_REGEX, 'Please enter a valid UK phone number').optional().or(z.literal('')),
  specialInstructions: z.string().max(500, 'Instructions too long').optional(),
});

// Payment schema
export const paymentSchema = z.object({
  method: z.enum(['card', 'bank-transfer', 'cash'], {
    required_error: 'Please select a payment method',
  }),
  termsAccepted: z.boolean().refine(val => val === true, {
    message: 'You must accept the terms and conditions',
  }),
  marketingConsent: z.boolean().default(false),
});

// Main booking schema combining all steps
export const bookingSchema = z.object({
  // Step 1: Where & What
  pickupAddress: addressSchema,
  dropoffAddress: addressSchema,
  pickupProperty: propertySchema,
  dropoffProperty: propertySchema,
  items: z.array(itemSchema).min(1, 'Please select at least one item to move'),
  
  // Step 2: When & How
  serviceType: serviceTypeSchema,
  schedule: timeSlotSchema,
  
  // Step 3: Who & Payment
  customer: customerSchema,
  payment: paymentSchema,
  
  // Additional fields
  estimatedVolume: z.number().min(0.1, 'Estimated volume required'),
  estimatedWeight: z.number().min(1, 'Estimated weight required'),
  distance: z.number().min(0.1, 'Distance required'),
  estimatedPrice: z.number().min(1, 'Price calculation required'),
  promoCode: z.string().optional(),
  notes: z.string().max(1000, 'Notes too long').optional(),
});

// Individual step schemas for progressive validation
export const step1Schema = bookingSchema.pick({
  pickupAddress: true,
  dropoffAddress: true,
  pickupProperty: true,
  dropoffProperty: true,
  items: true,
  estimatedVolume: true,
  estimatedWeight: true,
  distance: true,
});

export const step2Schema = bookingSchema.pick({
  serviceType: true,
  schedule: true,
  estimatedPrice: true,
});

export const step3Schema = bookingSchema.pick({
  customer: true,
  payment: true,
});

// Type exports
export type BookingFormData = z.infer<typeof bookingSchema>;
export type AddressData = z.infer<typeof addressSchema>;
export type PropertyData = z.infer<typeof propertySchema>;
export type ItemData = z.infer<typeof itemSchema>;
export type ServiceType = z.infer<typeof serviceTypeSchema>;
export type TimeSlotData = z.infer<typeof timeSlotSchema>;
export type CustomerData = z.infer<typeof customerSchema>;
export type PaymentData = z.infer<typeof paymentSchema>;

// Step type exports
export type Step1Data = z.infer<typeof step1Schema>;
export type Step2Data = z.infer<typeof step2Schema>;
export type Step3Data = z.infer<typeof step3Schema>;

// Default values for form initialization
export const defaultBookingData: Partial<BookingFormData> = {
  pickupProperty: {
    propertyType: 'house',
    floor: 0,
    hasLift: false,
  },
  dropoffProperty: {
    propertyType: 'house',
    floor: 0,
    hasLift: false,
  },
  items: [],
  serviceType: 'man-and-van',
  schedule: {
    date: '',
    timeSlot: 'anytime',
    flexible: true,
  },
  payment: {
    method: 'card',
    termsAccepted: false,
    marketingConsent: false,
  },
  estimatedVolume: 0,
  estimatedWeight: 0,
  distance: 0,
  estimatedPrice: 0,
};

// Validation helpers
export const validateStep = (step: number, data: Partial<BookingFormData>) => {
  try {
    switch (step) {
      case 1:
        step1Schema.parse(data);
        return { success: true, errors: null };
      case 2:
        step2Schema.parse(data);
        return { success: true, errors: null };
      case 3:
        step3Schema.parse(data);
        return { success: true, errors: null };
      default:
        return { success: false, errors: { general: 'Invalid step' } };
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, errors: error.flatten().fieldErrors };
    }
    return { success: false, errors: { general: 'Validation failed' } };
  }
};

// Form field validation helpers
export const getFieldError = (errors: any, fieldPath: string) => {
  const pathParts = fieldPath.split('.');
  let current = errors;
  
  for (const part of pathParts) {
    if (current?.[part]) {
      current = current[part];
    } else {
      return null;
    }
  }
  
  return Array.isArray(current) ? current[0] : current;
};

// Smart defaults based on context
export const getSmartDefaults = (context?: {
  userLocation?: { lat: number; lng: number };
  previousBookings?: Partial<BookingFormData>[];
  timeOfDay?: 'morning' | 'afternoon' | 'evening';
}): Partial<BookingFormData> => {
  const defaults = { ...defaultBookingData };
  
  // Apply smart defaults based on context
  if (context?.timeOfDay) {
    defaults.schedule = {
      ...defaults.schedule!,
      timeSlot: context.timeOfDay === 'morning' ? 'morning' : 
                context.timeOfDay === 'evening' ? 'evening' : 'afternoon',
    };
  }
  
  // Apply defaults from previous bookings
  if (context?.previousBookings?.length) {
    const lastBooking = context.previousBookings[0];
    if (lastBooking.customer) {
      defaults.customer = lastBooking.customer;
    }
    if (lastBooking.serviceType) {
      defaults.serviceType = lastBooking.serviceType;
    }
  }
  
  return defaults;
};

