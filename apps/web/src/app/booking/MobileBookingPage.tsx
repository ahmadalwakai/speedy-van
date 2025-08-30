'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { Box, Container, VStack, HStack, Heading, Text, Progress, Badge, useToast } from '@chakra-ui/react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaMapMarkerAlt, FaBoxes, FaCalendarAlt, FaCheckCircle, FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import { MobileNavigation } from '@/components/mobile/MobileNavigation';
import { TouchButton } from '@/components/mobile/TouchOptimizedComponents';

// Lazy load step components for better performance
const MobileStep1 = React.lazy(() => import('@/components/booking/mobile/MobileStep1'));
const MobileStep2 = React.lazy(() => import('@/components/booking/mobile/MobileStep2'));
const MobileStep3 = React.lazy(() => import('@/components/booking/mobile/MobileStep3'));
const MobileStep4 = React.lazy(() => import('@/components/booking/mobile/MobileStep4'));

// Create motion components
const MotionBox = motion.create(Box);

// Mobile booking data interface
interface MobileBookingData {
  // Step 1: Where & What (Combined)
  pickupAddress?: {
    line1?: string;
    city?: string;
    postcode?: string;
    coordinates?: { lat: number; lng: number };
  };
  dropoffAddress?: {
    line1?: string;
    city?: string;
    postcode?: string;
    coordinates?: { lat: number; lng: number };
  };
  pickupProperty?: {
    propertyType?: string;
    floor?: number;
    hasLift?: boolean;
    accessNotes?: string;
  };
  dropoffProperty?: {
    propertyType?: string;
    floor?: number;
    hasLift?: boolean;
    accessNotes?: string;
  };
  items?: Array<{
    id: string;
    name: string;
    category: string;
    volume: number;
    weight?: number;
    quantity: number;
    fragile?: boolean;
    valuable?: boolean;
  }>;
  estimatedVolume?: number;
  estimatedWeight?: number;
  distance?: number;

  // Step 2: When & How (Service & Schedule)
  serviceType?: 'man-and-van' | 'van-only' | 'large-van' | 'multiple-trips';
  date?: string;
  timeSlot?: string;
  flexibility?: 'exact' | 'flexible' | 'asap';
  specialRequirements?: string[];

  // Step 3: Who & Payment (Customer & Payment)
  customer?: {
    name?: string;
    email?: string;
    phone?: string;
    alternativePhone?: string;
  };
  paymentMethod?: string;
  promoCode?: string;
  pricing?: {
    basePrice?: number;
    itemsPrice?: number;
    distancePrice?: number;
    servicePrice?: number;
    totalPrice?: number;
    discounts?: number;
  };
  termsAccepted?: boolean;
  marketingConsent?: boolean;

  // Step 4: Confirmation
  bookingReference?: string;
  estimatedArrival?: string;
  driverDetails?: {
    name?: string;
    phone?: string;
    vehicle?: string;
  };
}

// Mobile step configuration
const MOBILE_STEPS = [
  {
    id: 1,
    title: 'Where & What',
    shortTitle: 'Location & Items',
    description: 'Addresses and items to move',
    icon: FaMapMarkerAlt,
    color: 'blue',
  },
  {
    id: 2,
    title: 'When & How',
    shortTitle: 'Schedule & Service',
    description: 'Date, time and service type',
    icon: FaCalendarAlt,
    color: 'green',
  },
  {
    id: 3,
    title: 'Who & Payment',
    shortTitle: 'Details & Pay',
    description: 'Your details and payment',
    icon: FaCheckCircle,
    color: 'purple',
  },
  {
    id: 4,
    title: 'Confirmation',
    shortTitle: 'Done!',
    description: 'Booking confirmed',
    icon: FaCheckCircle,
    color: 'neon',
  },
];

// Loading component for lazy-loaded steps
const StepLoader: React.FC = () => (
  <Box
    w="full"
    h="400px"
    display="flex"
    alignItems="center"
    justifyContent="center"
    bg="bg.card"
    borderRadius="xl"
    borderWidth="2px"
    borderColor="border.primary"
  >
    <VStack spacing={4}>
      <Box
        w="60px"
        h="60px"
        borderRadius="full"
        bg="linear-gradient(135deg, #00C2FF, #00D18F)"
        display="flex"
        alignItems="center"
        justifyContent="center"
        animation="pulse 2s infinite"
      >
        <FaBoxes color="white" size={24} />
      </Box>
      <Text color="text.secondary" fontSize="lg" fontWeight="medium">
        Loading step...
      </Text>
    </VStack>
  </Box>
);

// Mobile progress indicator
const MobileProgressIndicator: React.FC<{
  currentStep: number;
  totalSteps: number;
}> = ({ currentStep, totalSteps }) => {
  return (
    <Box
      position="sticky"
      top="56px" // Height of mobile header
      zIndex="sticky"
      bg="bg.card"
      borderBottomWidth="1px"
      borderColor="border.primary"
      p={4}
      className="safe-area-left safe-area-right"
    >
      <VStack spacing={3}>
        {/* Progress header */}
        <HStack justify="space-between" w="full" align="center">
          <Text fontSize="sm" color="text.tertiary" fontWeight="medium">
            Step {currentStep} of {totalSteps}
          </Text>
          <Badge
            colorScheme="neon"
            variant="solid"
            size="md"
            px={3}
            py={1}
            borderRadius="full"
            fontSize="sm"
            boxShadow="0 0 10px rgba(0,194,255,0.3)"
          >
            {Math.round((currentStep / totalSteps) * 100)}%
          </Badge>
        </HStack>

        {/* Progress bar */}
        <Box w="full" position="relative">
          <Progress
            value={(currentStep / totalSteps) * 100}
            w="full"
            colorScheme="neon"
            size="lg"
            borderRadius="full"
            bg="bg.surface"
            sx={{
              '& > div': {
                background: 'linear-gradient(90deg, #00C2FF 0%, #00D18F 100%)',
                boxShadow: '0 0 15px rgba(0,194,255,0.4)',
                transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
              }
            }}
          />
        </Box>

        {/* Current step info */}
        <Box textAlign="center">
          <Text fontSize="lg" fontWeight="bold" color="neon.400" mb={1}>
            {MOBILE_STEPS[currentStep - 1]?.title}
          </Text>
          <Text fontSize="sm" color="text.secondary">
            {MOBILE_STEPS[currentStep - 1]?.description}
          </Text>
        </Box>
      </VStack>
    </Box>
  );
};

// Mobile navigation buttons
const MobileNavigationButtons: React.FC<{
  currentStep: number;
  totalSteps: number;
  onNext: () => void;
  onBack: () => void;
  isNextDisabled?: boolean;
  isLoading?: boolean;
  nextLabel?: string;
}> = ({
  currentStep,
  totalSteps,
  onNext,
  onBack,
  isNextDisabled = false,
  isLoading = false,
  nextLabel,
}) => {
  const canGoBack = currentStep > 1;
  const canGoNext = currentStep < totalSteps;
  const isLastStep = currentStep === totalSteps;

  const getNextButtonLabel = () => {
    if (nextLabel) return nextLabel;
    if (isLastStep) return 'Complete Booking';
    if (currentStep === totalSteps - 1) return 'Confirm & Pay';
    return 'Continue';
  };

  return (
    <Box
      position="sticky"
      bottom="0"
      left="0"
      right="0"
      bg="bg.card"
      borderTopWidth="1px"
      borderColor="border.primary"
      p={4}
      className="safe-area-bottom safe-area-left safe-area-right"
      boxShadow="0 -4px 20px rgba(0, 0, 0, 0.1)"
    >
      <HStack spacing={3} justify="space-between">
        <TouchButton
          leftIcon={<FaArrowLeft />}
          onClick={onBack}
          isDisabled={!canGoBack}
          variant="outline"
          size="lg"
          borderColor="border.primary"
          color="text.primary"
          _hover={{
            bg: 'bg.surface',
            borderColor: 'neon.400',
            color: 'neon.400',
          }}
          _disabled={{
            opacity: 0.4,
            cursor: 'not-allowed',
          }}
          flex={1}
          maxW="120px"
        >
          Back
        </TouchButton>

        <TouchButton
          rightIcon={<FaArrowRight />}
          onClick={onNext}
          isDisabled={!canGoNext || isNextDisabled}
          isLoading={isLoading}
          loadingText={isLastStep ? "Confirming..." : "Processing..."}
          size="lg"
          bg="linear-gradient(135deg, #00C2FF, #00D18F)"
          color="white"
          fontWeight="bold"
          _hover={{
            transform: "translateY(-2px)",
            boxShadow: "0 8px 25px rgba(0,194,255,0.4)",
          }}
          _active={{
            transform: "translateY(0)",
          }}
          _disabled={{
            opacity: 0.6,
            cursor: 'not-allowed',
            transform: 'none',
          }}
          transition="all 200ms cubic-bezier(0.4, 0, 0.2, 1)"
          flex={2}
        >
          {getNextButtonLabel()}
        </TouchButton>
      </HStack>
    </Box>
  );
};

// Main mobile booking page component
export default function MobileBookingPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [bookingData, setBookingData] = useState<MobileBookingData>({});
  const [isLoading, setIsLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const toast = useToast();

  // Auto-save draft to localStorage
  useEffect(() => {
    const draftKey = 'speedy-van-booking-draft';
    const savedDraft = localStorage.getItem(draftKey);
    
    if (savedDraft && Object.keys(bookingData).length === 0) {
      try {
        const parsedDraft = JSON.parse(savedDraft);
        setBookingData(parsedDraft);
        
        toast({
          title: "Draft Restored",
          description: "Your previous booking draft has been restored.",
          status: "info",
          duration: 3000,
          isClosable: true,
        });
      } catch (error) {
        console.error('Failed to restore draft:', error);
      }
    }
  }, []);

  // Save draft on data change
  useEffect(() => {
    if (Object.keys(bookingData).length > 0) {
      const draftKey = 'speedy-van-booking-draft';
      localStorage.setItem(draftKey, JSON.stringify(bookingData));
    }
  }, [bookingData]);

  const updateBookingData = (updates: Partial<MobileBookingData>) => {
    setBookingData(prev => ({ ...prev, ...updates }));
    
    // Clear related validation errors
    const updatedErrors = { ...validationErrors };
    Object.keys(updates).forEach(key => {
      delete updatedErrors[key];
    });
    setValidationErrors(updatedErrors);
  };

  const validateCurrentStep = async (): Promise<boolean> => {
    setIsLoading(true);
    const errors: Record<string, string> = {};

    try {
      switch (currentStep) {
        case 1:
          // Validate addresses and items
          if (!bookingData.pickupAddress?.line1) {
            errors.pickupAddress = 'Pickup address is required';
          }
          if (!bookingData.dropoffAddress?.line1) {
            errors.dropoffAddress = 'Dropoff address is required';
          }
          if (!bookingData.items || bookingData.items.length === 0) {
            errors.items = 'Please select at least one item to move';
          }
          break;

        case 2:
          // Validate service type and schedule
          if (!bookingData.serviceType) {
            errors.serviceType = 'Please select a service type';
          }
          if (!bookingData.date) {
            errors.date = 'Please select a date';
          }
          if (!bookingData.timeSlot) {
            errors.timeSlot = 'Please select a time slot';
          }
          break;

        case 3:
          // Validate customer details and payment
          if (!bookingData.customer?.name) {
            errors.customerName = 'Name is required';
          }
          if (!bookingData.customer?.email) {
            errors.customerEmail = 'Email is required';
          }
          if (!bookingData.customer?.phone) {
            errors.customerPhone = 'Phone number is required';
          }
          if (!bookingData.paymentMethod) {
            errors.paymentMethod = 'Please select a payment method';
          }
          if (!bookingData.termsAccepted) {
            errors.termsAccepted = 'Please accept the terms and conditions';
          }
          break;

        default:
          break;
      }

      setValidationErrors(errors);
      return Object.keys(errors).length === 0;
    } finally {
      setIsLoading(false);
    }
  };

  const handleNext = async () => {
    const isValid = await validateCurrentStep();
    
    if (isValid) {
      if (currentStep < MOBILE_STEPS.length) {
        setCurrentStep(prev => prev + 1);
        
        // Scroll to top of new step
        window.scrollTo({ top: 0, behavior: 'smooth' });
        
        // Haptic feedback
        if (navigator.vibrate) {
          navigator.vibrate(10);
        }
      }
    } else {
      toast({
        title: "Please complete all required fields",
        description: "Check the highlighted fields and try again.",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      
      if (navigator.vibrate) {
        navigator.vibrate(5);
      }
    }
  };

  const renderCurrentStep = () => {
    const stepProps = {
      bookingData,
      updateBookingData,
      validationErrors,
      isLoading,
    };

    switch (currentStep) {
      case 1:
        return <MobileStep1 {...stepProps} />;
      case 2:
        return <MobileStep2 {...stepProps} />;
      case 3:
        return <MobileStep3 {...stepProps} />;
      case 4:
        return <MobileStep4 {...stepProps} />;
      default:
        return <MobileStep1 {...stepProps} />;
    }
  };

  return (
    <MobileNavigation title="Book Your Move">
      <Box minH="100vh" bg="bg.canvas">
        {/* Mobile Progress Indicator */}
        <MobileProgressIndicator
          currentStep={currentStep}
          totalSteps={MOBILE_STEPS.length}
        />

        {/* Step Content */}
        <Box pb="80px"> {/* Space for navigation buttons */}
          <AnimatePresence mode="wait">
            <MotionBox
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              w="full"
            >
              <Suspense fallback={<StepLoader />}>
                {renderCurrentStep()}
              </Suspense>
            </MotionBox>
          </AnimatePresence>
        </Box>

        {/* Mobile Navigation Buttons */}
        <MobileNavigationButtons
          currentStep={currentStep}
          totalSteps={MOBILE_STEPS.length}
          onNext={handleNext}
          onBack={handleBack}
          isLoading={isLoading}
        />
      </Box>
    </MobileNavigation>
  );
}

