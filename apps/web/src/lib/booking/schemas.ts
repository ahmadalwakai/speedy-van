import { z } from 'zod';

// UK Postcode validation regex
const UK_POSTCODE_REGEX = /^[A-Z]{1,2}[0-9][A-Z0-9]? ?[0-9][A-Z]{2}$/i;

// Phone number validation (UK format)
const UK_PHONE_REGEX = /^(\+44\s?7\d{3}|\(?07\d{3}\)?)\s?\d{3}\s?\d{3}$/;

// Email validation
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Base schemas
export const coordinatesSchema = z.object({
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
});

export const addressSchema = z.object({
  line1: z.string().min(1, 'Address line 1 is required').max(100),
  line2: z.string().optional(),
  city: z.string().min(1, 'City is required').max(50),
  postcode: z.string().regex(UK_POSTCODE_REGEX, 'Please enter a valid UK postcode'),
  coordinates: coordinatesSchema.optional(),
  verified: z.boolean().default(false),
});

export const propertyDetailsSchema = z.object({
  type: z.enum(['house', 'flat', 'office', 'storage', 'other'], {
    errorMap: () => ({ message: 'Please select a property type' }),
  }),
  floor: z.number().int().min(0).max(50).default(0),
  hasLift: z.boolean().default(false),
  accessNotes: z.string().max(200).optional(),
  parkingAvailable: z.boolean().default(false),
  narrowAccess: z.boolean().default(false),
});

export const itemSchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'Item name is required'),
  category: z.string().min(1, 'Category is required'),
  quantity: z.number().int().min(1, 'Quantity must be at least 1').max(20, 'Maximum 20 items per type'),
  volume: z.number().positive('Volume must be positive'),
  weight: z.number().positive('Weight must be positive').optional(),
  fragile: z.boolean().default(false),
  valuable: z.boolean().default(false),
  description: z.string().optional(),
  imageUrl: z.string().url().optional(),
});

export const timeSlotSchema = z.object({
  id: z.string(),
  startTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format'),
  endTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format'),
  available: z.boolean(),
  price: z.number().nonnegative(),
  popular: z.boolean().default(false),
  recommended: z.boolean().default(false),
});

export const serviceTypeSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  basePrice: z.number().nonnegative(),
  pricePerKm: z.number().nonnegative(),
  pricePerHour: z.number().nonnegative().optional(),
  includedServices: z.array(z.string()),
  maxVolume: z.number().positive(),
  maxWeight: z.number().positive(),
  crewSize: z.number().int().min(1).max(4),
  vehicleType: z.string(),
});

export const customerDetailsSchema = z.object({
  firstName: z.string().min(1, 'First name is required').max(50),
  lastName: z.string().min(1, 'Last name is required').max(50),
  email: z.string().regex(EMAIL_REGEX, 'Please enter a valid email address'),
  phone: z.string().regex(UK_PHONE_REGEX, 'Please enter a valid UK mobile number'),
  alternativePhone: z.string().regex(UK_PHONE_REGEX, 'Please enter a valid UK phone number').optional(),
  specialRequirements: z.string().max(500).optional(),
  marketingConsent: z.boolean().default(false),
});

export const pricingBreakdownSchema = z.object({
  basePrice: z.number().nonnegative(),
  itemsPrice: z.number().nonnegative(),
  distancePrice: z.number().nonnegative(),
  timePrice: z.number().nonnegative(),
  servicePrice: z.number().nonnegative(),
  surcharges: z.array(z.object({
    name: z.string(),
    amount: z.number(),
    description: z.string().optional(),
  })),
  discounts: z.array(z.object({
    name: z.string(),
    amount: z.number(),
    description: z.string().optional(),
  })),
  subtotal: z.number().nonnegative(),
  vat: z.number().nonnegative(),
  total: z.number().nonnegative(),
});

// Step-specific schemas
export const step1Schema = z.object({
  items: z.array(itemSchema).min(1, 'Please select at least one item to move'),
  totalVolume: z.number().positive('Total volume must be positive'),
  totalWeight: z.number().positive('Total weight must be positive'),
  estimatedPrice: z.number().nonnegative(),
});

export const step2Schema = z.object({
  pickupAddress: addressSchema,
  dropoffAddress: addressSchema,
  pickupProperty: propertyDetailsSchema,
  dropoffProperty: propertyDetailsSchema,
  distance: z.number().nonnegative(),
  estimatedDuration: z.number().nonnegative(),
});

export const step3Schema = z.object({
  date: z.string().refine((date) => {
    const selectedDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return selectedDate >= today;
  }, 'Please select a future date'),
  timeSlot: timeSlotSchema,
  serviceType: serviceTypeSchema,
  flexibility: z.enum(['exact', 'flexible', 'asap']).default('exact'),
  specialInstructions: z.string().max(500).optional(),
});

export const step4Schema = z.object({
  customer: customerDetailsSchema,
  pricing: pricingBreakdownSchema,
  promoCode: z.string().optional(),
  paymentMethod: z.enum(['card', 'bank_transfer', 'cash']),
  termsAccepted: z.boolean().refine((val) => val === true, 'Please accept the terms and conditions'),
  privacyAccepted: z.boolean().refine((val) => val === true, 'Please accept the privacy policy'),
});

// Complete booking schema
export const completeBookingSchema = z.object({
  step1: step1Schema,
  step2: step2Schema,
  step3: step3Schema,
  step4: step4Schema,
  metadata: z.object({
    sessionId: z.string(),
    userAgent: z.string().optional(),
    referrer: z.string().optional(),
    timestamp: z.number(),
    version: z.string().default('1.0'),
  }),
});

// Form data types
export type Coordinates = z.infer<typeof coordinatesSchema>;
export type Address = z.infer<typeof addressSchema>;
export type PropertyDetails = z.infer<typeof propertyDetailsSchema>;
export type BookingItem = z.infer<typeof itemSchema>;
export type TimeSlot = z.infer<typeof timeSlotSchema>;
export type ServiceType = z.infer<typeof serviceTypeSchema>;
export type CustomerDetails = z.infer<typeof customerDetailsSchema>;
export type PricingBreakdown = z.infer<typeof pricingBreakdownSchema>;

// Step data types
export type Step1Data = z.infer<typeof step1Schema>;
export type Step2Data = z.infer<typeof step2Schema>;
export type Step3Data = z.infer<typeof step3Schema>;
export type Step4Data = z.infer<typeof step4Schema>;

// Complete booking type
export type CompleteBooking = z.infer<typeof completeBookingSchema>;

// Validation error type
export interface ValidationError {
  field: string;
  message: string;
  code?: string;
}

// Form state type
export interface BookingFormState {
  currentStep: number;
  totalSteps: number;
  isValid: boolean;
  isDirty: boolean;
  isSubmitting: boolean;
  errors: Record<string, ValidationError[]>;
  data: {
    step1?: Partial<Step1Data>;
    step2?: Partial<Step2Data>;
    step3?: Partial<Step3Data>;
    step4?: Partial<Step4Data>;
  };
  metadata: {
    sessionId: string;
    startedAt: number;
    lastSavedAt?: number;
    completedSteps: number[];
  };
}

// Validation utilities
export const validateStep = (step: number, data: any): ValidationError[] => {
  const errors: ValidationError[] = [];
  
  try {
    switch (step) {
      case 1:
        step1Schema.parse(data);
        break;
      case 2:
        step2Schema.parse(data);
        break;
      case 3:
        step3Schema.parse(data);
        break;
      case 4:
        step4Schema.parse(data);
        break;
      default:
        throw new Error(`Invalid step: ${step}`);
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      error.errors.forEach((err) => {
        errors.push({
          field: err.path.join('.'),
          message: err.message,
          code: err.code,
        });
      });
    }
  }
  
  return errors;
};

export const validateCompleteBooking = (data: any): ValidationError[] => {
  const errors: ValidationError[] = [];
  
  try {
    completeBookingSchema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      error.errors.forEach((err) => {
        errors.push({
          field: err.path.join('.'),
          message: err.message,
          code: err.code,
        });
      });
    }
  }
  
  return errors;
};

// Default values
export const defaultStep1Data: Partial<Step1Data> = {
  items: [],
  totalVolume: 0,
  totalWeight: 0,
  estimatedPrice: 0,
};

export const defaultStep2Data: Partial<Step2Data> = {
  pickupAddress: {
    line1: '',
    city: '',
    postcode: '',
    verified: false,
  },
  dropoffAddress: {
    line1: '',
    city: '',
    postcode: '',
    verified: false,
  },
  pickupProperty: {
    type: 'house',
    floor: 0,
    hasLift: false,
    parkingAvailable: false,
    narrowAccess: false,
  },
  dropoffProperty: {
    type: 'house',
    floor: 0,
    hasLift: false,
    parkingAvailable: false,
    narrowAccess: false,
  },
  distance: 0,
  estimatedDuration: 0,
};

export const defaultStep3Data: Partial<Step3Data> = {
  flexibility: 'exact',
};

export const defaultStep4Data: Partial<Step4Data> = {
  customer: {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    marketingConsent: false,
  },
  paymentMethod: 'card',
  termsAccepted: false,
  privacyAccepted: false,
};

export const defaultBookingFormState: BookingFormState = {
  currentStep: 1,
  totalSteps: 4,
  isValid: false,
  isDirty: false,
  isSubmitting: false,
  errors: {},
  data: {
    step1: defaultStep1Data,
    step2: defaultStep2Data,
    step3: defaultStep3Data,
    step4: defaultStep4Data,
  },
  metadata: {
    sessionId: '',
    startedAt: Date.now(),
    completedSteps: [],
  },
};

