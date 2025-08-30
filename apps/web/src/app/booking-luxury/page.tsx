'use client';

import React, { useEffect, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookingProvider, useBooking } from '@/lib/booking-context';
import { Box, Container, VStack, HStack, Heading, Text, Progress, Badge, Button } from '@chakra-ui/react';
import { FaMapMarkerAlt, FaBoxes, FaCalendarAlt, FaCreditCard, FaCheckCircle, FaArrowLeft, FaArrowRight } from 'react-icons/fa';

// Step components (will be created in next phase)
const WhereAndWhatStep = React.lazy(() => import('@/components/booking-luxury/WhereAndWhatStep'));
const WhenAndHowStep = React.lazy(() => import('@/components/booking-luxury/WhenAndHowStep'));
const WhoAndPaymentStep = React.lazy(() => import('@/components/booking-luxury/WhoAndPaymentStep'));
const ConfirmationStep = React.lazy(() => import('@/components/booking-luxury/ConfirmationStep'));

// Step configuration
const STEPS = [
  {
    id: 1,
    title: 'Where & What',
    description: 'Addresses and items to move',
    icon: FaMapMarkerAlt,
    component: WhereAndWhatStep,
  },
  {
    id: 2,
    title: 'When & How',
    description: 'Schedule and service type',
    icon: FaCalendarAlt,
    component: WhenAndHowStep,
  },
  {
    id: 3,
    title: 'Who & Payment',
    description: 'Your details and payment',
    icon: FaCreditCard,
    component: WhoAndPaymentStep,
  },
  {
    id: 4,
    title: 'Confirmation',
    description: 'Review and confirm booking',
    icon: FaCheckCircle,
    component: ConfirmationStep,
  },
];

// Loading component
const StepLoader = () => (
  <Box
    w="full"
    h="400px"
    display="flex"
    alignItems="center"
    justifyContent="center"
    bg="bg.card"
    borderRadius="2xl"
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
        Loading luxury booking experience...
      </Text>
    </VStack>
  </Box>
);

// Progress indicator component
const ProgressIndicator: React.FC = () => {
  const { state } = useBooking();
  const { currentStep } = state;

  return (
    <Box
      w="full"
      bg="bg.card"
      p={{ base: 6, md: 8 }}
      borderRadius="2xl"
      borderWidth="2px"
      borderColor="border.primary"
      boxShadow="xl"
      position="relative"
      overflow="hidden"
    >
      {/* Background gradient */}
      <Box
        position="absolute"
        top="0"
        left="0"
        right="0"
        bottom="0"
        bg="linear-gradient(135deg, rgba(0,194,255,0.03), rgba(0,209,143,0.03))"
        borderRadius="2xl"
        pointerEvents="none"
      />

      <VStack spacing={6} position="relative" zIndex={1}>
        {/* Progress header */}
        <HStack justify="space-between" w="full" align="center">
          <VStack align="start" spacing={1}>
            <Text fontSize={{ base: "sm", md: "md" }} color="text.tertiary" fontWeight="medium">
              Booking Progress
            </Text>
            <Text fontSize={{ base: "lg", md: "xl" }} color="neon.500" fontWeight="bold">
              Step {currentStep} of {STEPS.length}
            </Text>
          </VStack>
          <Badge
            colorScheme="neon"
            variant="solid"
            size="lg"
            px={4}
            py={2}
            borderRadius="full"
            fontSize={{ base: "sm", md: "md" }}
            boxShadow="0 0 15px rgba(0,194,255,0.3)"
          >
            {Math.round((currentStep / STEPS.length) * 100)}% Complete
          </Badge>
        </HStack>

        {/* Progress bar */}
        <Box w="full" position="relative">
          <Progress
            value={(currentStep / STEPS.length) * 100}
            w="full"
            colorScheme="neon"
            size={{ base: "lg", md: "xl" }}
            borderRadius="full"
            bg="bg.surface"
            boxShadow="inset 0 2px 4px rgba(0,0,0,0.1)"
            sx={{
              '& > div': {
                background: 'linear-gradient(90deg, #00C2FF 0%, #00D18F 100%)',
                boxShadow: '0 0 20px rgba(0,194,255,0.4)',
                transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
              }
            }}
          />
          {/* Glow effect */}
          <Box
            position="absolute"
            top="0"
            left="0"
            right="0"
            bottom="0"
            borderRadius="full"
            background="linear-gradient(90deg, rgba(0,194,255,0.2) 0%, rgba(0,209,143,0.2) 100%)"
            filter="blur(8px)"
            opacity={0.6}
            zIndex={-1}
          />
        </Box>

        {/* Step indicators */}
        <HStack spacing={{ base: 2, md: 4 }} w="full" justify="space-between">
          {STEPS.map((step, index) => {
            const isCompleted = step.id < currentStep;
            const isCurrent = step.id === currentStep;
            const IconComponent = step.icon;

            return (
              <motion.div
                key={step.id}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                style={{ flex: 1 }}
              >
                <Box
                  p={{ base: 3, md: 4 }}
                  borderRadius="xl"
                  borderWidth="2px"
                  borderColor={
                    isCompleted ? 'green.400' : 
                    isCurrent ? 'neon.400' : 
                    'border.primary'
                  }
                  bg={
                    isCompleted ? 'green.50' : 
                    isCurrent ? 'dark.800' : 
                    'dark.700'
                  }
                  position="relative"
                  overflow="hidden"
                  transition="all 300ms cubic-bezier(0.4, 0, 0.2, 1)"
                  _hover={{
                    transform: isCurrent ? "translateY(-2px)" : "none",
                    boxShadow: isCurrent ? "0 8px 25px rgba(0,194,255,0.3)" : "none"
                  }}
                  cursor={isCompleted ? "pointer" : "default"}
                >
                  {/* Current step background */}
                  {isCurrent && (
                    <Box
                      position="absolute"
                      top="0"
                      left="0"
                      right="0"
                      bottom="0"
                      bg="linear-gradient(135deg, rgba(0,194,255,0.1), rgba(0,209,143,0.1))"
                      borderRadius="xl"
                      zIndex={0}
                    />
                  )}

                  <VStack spacing={2} position="relative" zIndex={1} textAlign="center">
                    <Box
                      p={2}
                      borderRadius="full"
                      bg={
                        isCompleted ? 'green.500' : 
                        isCurrent ? 'neon.500' : 
                        'gray.500'
                      }
                      color="white"
                      boxSize={{ base: "40px", md: "48px" }}
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      boxShadow={isCurrent ? "0 0 20px rgba(0,194,255,0.5)" : "none"}
                      transition="all 300ms ease"
                    >
                      {isCompleted ? (
                        <FaCheckCircle size={20} />
                      ) : (
                        <IconComponent size={20} />
                      )}
                    </Box>

                    <VStack spacing={1}>
                      <Text
                        fontSize={{ base: "xs", md: "sm" }}
                        fontWeight="bold"
                        color={
                          isCompleted ? 'green.600' : 
                          isCurrent ? 'neon.400' : 
                          'text.secondary'
                        }
                        lineHeight="1.2"
                      >
                        {step.title}
                      </Text>
                      <Text
                        fontSize={{ base: "2xs", md: "xs" }}
                        color={
                          isCompleted ? 'green.500' : 
                          isCurrent ? 'neon.300' : 
                          'text.tertiary'
                        }
                        textAlign="center"
                        lineHeight="1.2"
                        noOfLines={2}
                      >
                        {step.description}
                      </Text>
                    </VStack>

                    <Badge
                      colorScheme={
                        isCompleted ? 'green' : 
                        isCurrent ? 'neon' : 
                        'gray'
                      }
                      variant="solid"
                      size="sm"
                      borderRadius="full"
                      px={2}
                      py={1}
                      fontSize="xs"
                      fontWeight="bold"
                    >
                      {step.id}
                    </Badge>
                  </VStack>

                  {/* Current step pulse effect */}
                  {isCurrent && (
                    <Box
                      position="absolute"
                      top="50%"
                      left="50%"
                      transform="translate(-50%, -50%)"
                      w="100%"
                      h="100%"
                      borderRadius="xl"
                      border="2px solid"
                      borderColor="neon.400"
                      opacity={0.3}
                      animation="ping 2s cubic-bezier(0, 0, 0.2, 1) infinite"
                    />
                  )}
                </Box>
              </motion.div>
            );
          })}
        </HStack>
      </VStack>
    </Box>
  );
};

// Navigation component
const BookingNavigation: React.FC = () => {
  const { state, prevStep, nextStep, validateCurrentStep } = useBooking();
  const { currentStep } = state;

  const handleNext = async () => {
    const isValid = await validateCurrentStep();
    if (isValid) {
      await nextStep();
    }
  };

  const canGoBack = currentStep > 1;
  const canGoNext = currentStep < STEPS.length;
  const isLastStep = currentStep === STEPS.length;

  return (
    <HStack spacing={4} justify="space-between" w="full">
      <Button
        leftIcon={<FaArrowLeft />}
        onClick={prevStep}
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
      >
        Back
      </Button>

      <Box flex={1} />

      <Button
        rightIcon={<FaArrowRight />}
        onClick={handleNext}
        isDisabled={!canGoNext}
        isLoading={state.isLoading}
        loadingText={isLastStep ? "Confirming..." : "Validating..."}
        size="lg"
        bg="linear-gradient(135deg, #00C2FF, #00D18F)"
        color="white"
        fontWeight="bold"
        px={8}
        _hover={{
          transform: "translateY(-2px)",
          boxShadow: "0 8px 25px rgba(0,194,255,0.4)",
        }}
        _active={{
          transform: "translateY(0)",
        }}
        transition="all 200ms cubic-bezier(0.4, 0, 0.2, 1)"
      >
        {isLastStep ? 'Confirm Booking' : 'Continue'}
      </Button>
    </HStack>
  );
};

// Main booking flow component
const BookingFlowContent: React.FC = () => {
  const { state, trackStepStart } = useBooking();
  const { currentStep } = state;

  // Track step start on mount and step change
  useEffect(() => {
    trackStepStart(currentStep);
  }, [currentStep, trackStepStart]);

  const currentStepConfig = STEPS.find(step => step.id === currentStep);
  const StepComponent = currentStepConfig?.component;

  return (
    <Box minH="100vh" bg="bg.canvas" py={{ base: 4, md: 8 }}>
      <Container maxW={{ base: "100%", md: "6xl" }} px={{ base: 4, md: 6 }}>
        <VStack spacing={{ base: 8, md: 10 }}>
          {/* Header */}
          <Box
            textAlign="center"
            w="full"
            p={{ base: 6, md: 8 }}
            borderRadius="2xl"
            bg="linear-gradient(135deg, rgba(0,194,255,0.05), rgba(0,209,143,0.05))"
            borderWidth="2px"
            borderColor="border.neon"
            position="relative"
            overflow="hidden"
          >
            <Box
              position="absolute"
              top="0"
              left="0"
              right="0"
              bottom="0"
              borderRadius="2xl"
              background="radial-gradient(circle at 50% 0%, rgba(0,194,255,0.1) 0%, transparent 70%)"
              pointerEvents="none"
            />
            
            <VStack spacing={4} position="relative" zIndex={1}>
              <Heading
                size={{ base: "xl", md: "2xl" }}
                color="neon.500"
                mb={2}
                textShadow="0 0 20px rgba(0,194,255,0.5)"
                fontWeight="extrabold"
                letterSpacing="tight"
              >
                🚚 Luxury Booking Experience
              </Heading>
              <Text
                color="text.secondary"
                fontSize={{ base: "md", md: "xl" }}
                maxW="600px"
                lineHeight="1.6"
                fontWeight="medium"
              >
                Complete your move in just {STEPS.length} simple steps
              </Text>
              <Text
                color="neon.400"
                fontSize={{ base: "sm", md: "md" }}
                fontWeight="semibold"
                opacity={0.8}
              >
                Premium service • Smart defaults • Zero friction
              </Text>
            </VStack>
          </Box>

          {/* Progress indicator */}
          <ProgressIndicator />

          {/* Step content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              style={{ width: '100%' }}
            >
              <Box
                w="full"
                bg="bg.card"
                borderRadius="2xl"
                borderWidth="2px"
                borderColor="border.primary"
                boxShadow="xl"
                overflow="hidden"
              >
                <Suspense fallback={<StepLoader />}>
                  {StepComponent && <StepComponent />}
                </Suspense>
              </Box>
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <BookingNavigation />

          {/* Draft save indicator */}
          {state.isDraftSaved && state.lastSavedAt && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
            >
              <Badge
                colorScheme="green"
                variant="subtle"
                size="lg"
                px={4}
                py={2}
                borderRadius="full"
                fontSize="sm"
              >
                ✓ Draft saved at {state.lastSavedAt.toLocaleTimeString()}
              </Badge>
            </motion.div>
          )}
        </VStack>
      </Container>
    </Box>
  );
};

// Main page component
export default function LuxuryBookingPage() {
  return (
    <BookingProvider>
      <BookingFlowContent />
    </BookingProvider>
  );
}

