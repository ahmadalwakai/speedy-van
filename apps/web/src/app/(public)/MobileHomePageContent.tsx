'use client';

import React, { Suspense, lazy } from 'react';
import {
  Box,
  Container,
  VStack,
  HStack,
  Heading,
  Text,
  SimpleGrid,
  Card,
  Avatar,
  Badge,
  Icon,
  Flex,
  Stack,
  useBreakpointValue,
} from '@chakra-ui/react';
import { motion, useInView } from 'framer-motion';
import {
  FaTruck,
  FaClock,
  FaShieldAlt,
  FaStar,
  FaCouch,
  FaLaptop,
  FaGraduationCap,
  FaBuilding,
  FaMagic,
  FaCheckCircle,
  FaPhone,
  FaArrowRight,
} from 'react-icons/fa';
import { MobileNavigation } from '@/components/mobile/MobileNavigation';
import { TouchButton } from '@/components/mobile/TouchOptimizedComponents';
import Image from 'next/image';

// Lazy load heavy components for better performance
const ServiceMapSection = lazy(() => import('../../components/ServiceMapSection'));

// Create motion components
const MotionBox = motion.create(Box);
const MotionCard = motion.create(Card);

// Mobile-optimized data structures
const features = [
  {
    icon: FaTruck,
    title: 'Fast & Reliable',
    description: 'Professional service with guaranteed delivery times',
    color: 'blue',
    gradient: 'linear(to-r, blue.400, blue.600)'
  },
  {
    icon: FaClock,
    title: '24/7 Support',
    description: 'Round-the-clock customer support',
    color: 'green',
    gradient: 'linear(to-r, green.400, green.600)'
  },
  {
    icon: FaShieldAlt,
    title: 'Fully Insured',
    description: 'Complete coverage for your belongings',
    color: 'purple',
    gradient: 'linear(to-r, purple.400, purple.600)'
  },
  {
    icon: FaStar,
    title: '5-Star Rated',
    description: 'Trusted by thousands of customers',
    color: 'yellow',
    gradient: 'linear(to-r, yellow.400, yellow.600)'
  }
];

const services = [
  {
    icon: FaCouch,
    title: 'Furniture Moves',
    description: 'Expert handling of sofas, tables & delicate pieces',
    emoji: '🪑',
    color: 'orange',
    features: ['Professional packing', 'Furniture protection', 'Assembly service']
  },
  {
    icon: FaLaptop,
    title: 'Electronics',
    description: 'Safe transport of TVs, computers & appliances',
    emoji: '💻',
    color: 'blue',
    features: ['Anti-static packaging', 'Climate control', 'Insurance coverage']
  },
  {
    icon: FaGraduationCap,
    title: 'Student Moves',
    description: 'Affordable campus-to-campus relocation',
    emoji: '🎓',
    color: 'green',
    features: ['Student discounts', 'Flexible scheduling', 'Storage options']
  },
  {
    icon: FaBuilding,
    title: 'Business',
    description: 'Professional corporate relocation services',
    emoji: '🏢',
    color: 'purple',
    features: ['Minimal downtime', 'Document security', 'After-hours service']
  },
];

const testimonials = [
  {
    name: 'Sarah Mitchell',
    city: 'Manchester',
    quote: 'Speedy Van moved my entire flat in under 3 hours! Professional and careful with my furniture.',
    rating: 5,
    avatar: '/avatars/sarah.jpg',
    service: 'Flat Removal'
  },
  {
    name: 'James Thompson',
    city: 'Birmingham',
    quote: 'Best moving experience ever. They handled my electronics with care, and the price was exactly as quoted.',
    rating: 5,
    avatar: '/avatars/james.jpg',
    service: 'Electronics Move'
  },
  {
    name: 'Emma Davies',
    city: 'Leeds',
    quote: 'From booking to delivery, everything was seamless. Punctual drivers and perfect condition delivery.',
    rating: 5,
    avatar: '/avatars/emma.jpg',
    service: 'Home Removal'
  }
];

const stats = [
  { number: '50K+', label: 'Happy Customers', icon: FaStar, color: 'yellow' },
  { number: '95%', label: 'On-Time', icon: FaClock, color: 'green' },
  { number: '24/7', label: 'Support', icon: FaPhone, color: 'blue' },
  { number: '£50', label: 'From', icon: FaTruck, color: 'neon' }
];

// Mobile Hero Section
const MobileHero: React.FC = () => {
  return (
    <Box
      position="relative"
      minH={{ base: "70vh", md: "80vh" }}
      display="flex"
      alignItems="center"
      overflow="hidden"
      bg="linear-gradient(135deg, rgba(0,194,255,0.1) 0%, rgba(0,209,143,0.1) 100%)"
    >
      {/* Background Pattern */}
      <Box
        position="absolute"
        top="0"
        left="0"
        right="0"
        bottom="0"
        opacity={0.1}
        background="radial-gradient(circle at 30% 70%, rgba(0,194,255,0.3) 0%, transparent 50%)"
        pointerEvents="none"
      />

      <Container maxW="container.xl" position="relative" zIndex={1}>
        <VStack spacing={{ base: 6, md: 8 }} textAlign="center">
          {/* Main Heading */}
          <MotionBox
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <Heading
              size={{ base: "2xl", md: "4xl" }}
              color="neon.500"
              mb={4}
              fontWeight="extrabold"
              lineHeight="shorter"
              textShadow="0 0 20px rgba(0,194,255,0.3)"
            >
              🚚 Move Fast,{' '}
              <Text as="span" color="text.primary">
                Move Smart
              </Text>
            </Heading>
          </MotionBox>

          {/* Subtitle */}
          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <Text
              fontSize={{ base: "lg", md: "xl" }}
              color="text.secondary"
              maxW={{ base: "90%", md: "600px" }}
              lineHeight="tall"
              fontWeight="medium"
            >
              Professional van hire and moving services across the UK. 
              Book in minutes, track in real-time, move with confidence.
            </Text>
          </MotionBox>

          {/* CTA Buttons */}
          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            w="full"
          >
            <Stack
              direction={{ base: "column", sm: "row" }}
              spacing={4}
              justify="center"
              align="center"
              w="full"
              maxW="400px"
              mx="auto"
            >
              <TouchButton
                size="xl"
                bg="linear-gradient(135deg, #00C2FF, #00D18F)"
                color="white"
                fontWeight="bold"
                rightIcon={<FaArrowRight />}
                _hover={{
                  transform: "translateY(-2px)",
                  boxShadow: "0 8px 25px rgba(0,194,255,0.4)",
                }}
                fullWidth
                onClick={() => window.location.href = '/booking'}
              >
                Book Your Move
              </TouchButton>
              
              <TouchButton
                size="xl"
                variant="outline"
                borderColor="border.primary"
                color="text.primary"
                leftIcon={<FaPhone />}
                _hover={{
                  borderColor: 'neon.400',
                  color: 'neon.400',
                  bg: 'bg.surface',
                }}
                fullWidth
                onClick={() => window.open('tel:+441234567890')}
              >
                Call Now
              </TouchButton>
            </Stack>
          </MotionBox>

          {/* Trust Indicators */}
          <MotionBox
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <HStack spacing={4} justify="center" wrap="wrap">
              <Badge colorScheme="green" size="lg" px={3} py={1}>
                ✓ Fully Insured
              </Badge>
              <Badge colorScheme="blue" size="lg" px={3} py={1}>
                ✓ 5-Star Rated
              </Badge>
              <Badge colorScheme="purple" size="lg" px={3} py={1}>
                ✓ 24/7 Support
              </Badge>
            </HStack>
          </MotionBox>
        </VStack>
      </Container>
    </Box>
  );
};

// Mobile Stats Section
const MobileStats: React.FC = () => {
  return (
    <Box py={{ base: 12, md: 16 }}>
      <Container maxW="container.xl">
        <VStack spacing={8}>
          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            textAlign="center"
          >
            <Heading size={{ base: "lg", md: "xl" }} mb={4} color="text.primary">
              Trusted by Thousands
            </Heading>
            <Text color="text.secondary" fontSize={{ base: "md", md: "lg" }}>
              Our numbers speak for themselves
            </Text>
          </MotionBox>

          <SimpleGrid 
            columns={{ base: 2, md: 4 }} 
            spacing={{ base: 4, md: 6 }} 
            w="full"
          >
            {stats.map((stat, index) => (
              <MotionBox
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Box
                  p={{ base: 4, md: 6 }}
                  borderRadius="xl"
                  borderWidth="2px"
                  borderColor="border.primary"
                  bg="bg.card"
                  textAlign="center"
                  _hover={{ 
                    borderColor: `${stat.color}.400`,
                    boxShadow: "lg"
                  }}
                  transition="all 0.3s ease"
                >
                  <VStack spacing={3}>
                    <Box
                      p={2}
                      borderRadius="lg"
                      bg={`${stat.color}.500`}
                      color="white"
                      boxSize={{ base: "40px", md: "48px" }}
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                    >
                      <Icon as={stat.icon} boxSize={{ base: 4, md: 5 }} />
                    </Box>
                    <Text 
                      fontSize={{ base: "xl", md: "2xl" }} 
                      fontWeight="bold" 
                      color={`${stat.color}.500`}
                    >
                      {stat.number}
                    </Text>
                    <Text 
                      color="text.secondary" 
                      fontSize={{ base: "xs", md: "sm" }} 
                      fontWeight="medium"
                    >
                      {stat.label}
                    </Text>
                  </VStack>
                </Box>
              </MotionBox>
            ))}
          </SimpleGrid>
        </VStack>
      </Container>
    </Box>
  );
};

// Mobile Features Section
const MobileFeatures: React.FC = () => {
  return (
    <Box py={{ base: 12, md: 16 }} bg="bg.surface">
      <Container maxW="container.xl">
        <VStack spacing={8}>
          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            textAlign="center"
          >
            <Heading size={{ base: "lg", md: "xl" }} mb={4} color="text.primary">
              Why Choose Speedy Van?
            </Heading>
            <Text color="text.secondary" fontSize={{ base: "md", md: "lg" }}>
              Professional moving solutions tailored to your needs
            </Text>
          </MotionBox>

          <SimpleGrid 
            columns={{ base: 1, sm: 2 }} 
            spacing={{ base: 4, md: 6 }} 
            w="full"
          >
            {features.map((feature, index) => (
              <MotionCard
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                p={{ base: 6, md: 8 }}
                borderRadius="xl"
                borderWidth="2px"
                borderColor="border.primary"
                bg="bg.card"
                _hover={{ 
                  borderColor: `${feature.color}.400`,
                  boxShadow: "xl",
                  transform: "translateY(-4px)"
                }}
                transition="all 0.3s ease"
                cursor="pointer"
              >
                <VStack spacing={4} textAlign="center">
                  <Box
                    p={3}
                    borderRadius="lg"
                    bgGradient={feature.gradient}
                    color="white"
                    boxSize={{ base: "60px", md: "70px" }}
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    boxShadow="0 4px 15px rgba(0,0,0,0.2)"
                  >
                    <Icon as={feature.icon} boxSize={{ base: 6, md: 7 }} />
                  </Box>
                  <Heading size={{ base: "md", md: "lg" }} color="text.primary">
                    {feature.title}
                  </Heading>
                  <Text 
                    color="text.secondary" 
                    fontSize={{ base: "sm", md: "md" }} 
                    lineHeight="tall"
                  >
                    {feature.description}
                  </Text>
                </VStack>
              </MotionCard>
            ))}
          </SimpleGrid>
        </VStack>
      </Container>
    </Box>
  );
};

// Mobile Services Section
const MobileServices: React.FC = () => {
  return (
    <Box py={{ base: 12, md: 16 }}>
      <Container maxW="container.xl">
        <VStack spacing={8}>
          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            textAlign="center"
          >
            <Heading size={{ base: "lg", md: "xl" }} mb={4} color="text.primary">
              Our Premium Services
            </Heading>
            <Text color="text.secondary" fontSize={{ base: "md", md: "lg" }}>
              Professional moving solutions for every need
            </Text>
          </MotionBox>

          <SimpleGrid 
            columns={{ base: 1, md: 2 }} 
            spacing={{ base: 4, md: 6 }} 
            w="full"
          >
            {services.map((service, index) => (
              <MotionCard
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                p={{ base: 6, md: 8 }}
                borderRadius="xl"
                borderWidth="2px"
                borderColor="neon.500"
                bg="dark.800"
                _hover={{
                  borderColor: "neon.400",
                  boxShadow: "0 0 30px rgba(0,194,255,0.3)",
                  transform: "translateY(-4px)"
                }}
                transition="all 0.3s ease"
                cursor="pointer"
                position="relative"
                overflow="hidden"
              >
                {/* Glow effect */}
                <Box
                  position="absolute"
                  top={0}
                  left={0}
                  right={0}
                  bottom={0}
                  bg="linear-gradient(135deg, rgba(0,194,255,0.05) 0%, transparent 50%)"
                  borderRadius="xl"
                  opacity={0}
                  _groupHover={{ opacity: 1 }}
                  transition="opacity 0.3s ease"
                />
                
                <VStack spacing={4} align="center" textAlign="center" position="relative" zIndex={1}>
                  <HStack spacing={3} align="center">
                    <Box
                      p={2}
                      borderRadius="lg"
                      bg="neon.500"
                      color="white"
                      fontSize={{ base: "xl", md: "2xl" }}
                      boxShadow="0 4px 15px rgba(0,194,255,0.3)"
                    >
                      {service.emoji}
                    </Box>
                    <Icon as={service.icon} boxSize={{ base: 6, md: 8 }} color="neon.400" />
                  </HStack>
                  
                  <Heading size={{ base: "md", md: "lg" }} color="white">
                    {service.title}
                  </Heading>
                  
                  <Text 
                    color="gray.300" 
                    fontSize={{ base: "sm", md: "md" }} 
                    lineHeight="tall"
                  >
                    {service.description}
                  </Text>
                  
                  {/* Service Features */}
                  <VStack spacing={2} align="start" w="full">
                    {service.features.map((feature, idx) => (
                      <HStack key={idx} spacing={2}>
                        <Icon as={FaCheckCircle} color="green.400" boxSize={3} />
                        <Text color="gray.400" fontSize="xs">
                          {feature}
                        </Text>
                      </HStack>
                    ))}
                  </VStack>
                </VStack>
              </MotionCard>
            ))}
          </SimpleGrid>
        </VStack>
      </Container>
    </Box>
  );
};

// Mobile Testimonials Section
const MobileTestimonials: React.FC = () => {
  return (
    <Box py={{ base: 12, md: 16 }} bg="bg.surface">
      <Container maxW="container.xl">
        <VStack spacing={8}>
          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            textAlign="center"
          >
            <Heading size={{ base: "lg", md: "xl" }} mb={4} color="text.primary">
              What Our Customers Say
            </Heading>
            <Text color="text.secondary" fontSize={{ base: "md", md: "lg" }}>
              Real reviews from real customers
            </Text>
          </MotionBox>

          <SimpleGrid 
            columns={{ base: 1, md: 2, lg: 3 }} 
            spacing={{ base: 4, md: 6 }} 
            w="full"
          >
            {testimonials.map((testimonial, index) => (
              <MotionCard
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                p={{ base: 6, md: 8 }}
                borderRadius="xl"
                borderWidth="2px"
                borderColor="border.primary"
                bg="bg.card"
                _hover={{ 
                  borderColor: "neon.400",
                  boxShadow: "lg"
                }}
                transition="all 0.3s ease"
              >
                <VStack spacing={4} align="start">
                  {/* Rating */}
                  <HStack spacing={1}>
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Icon key={i} as={FaStar} color="yellow.400" boxSize={4} />
                    ))}
                  </HStack>
                  
                  {/* Quote */}
                  <Text 
                    color="text.secondary" 
                    fontSize={{ base: "sm", md: "md" }} 
                    lineHeight="tall"
                    fontStyle="italic"
                  >
                    "{testimonial.quote}"
                  </Text>
                  
                  {/* Customer info */}
                  <HStack spacing={3} w="full">
                    <Avatar 
                      size="sm" 
                      name={testimonial.name}
                      src={testimonial.avatar}
                    />
                    <VStack spacing={0} align="start" flex={1}>
                      <Text fontSize="sm" fontWeight="bold" color="text.primary">
                        {testimonial.name}
                      </Text>
                      <Text fontSize="xs" color="text.tertiary">
                        {testimonial.city} • {testimonial.service}
                      </Text>
                    </VStack>
                  </HStack>
                </VStack>
              </MotionCard>
            ))}
          </SimpleGrid>
        </VStack>
      </Container>
    </Box>
  );
};

// Mobile CTA Section
const MobileCTA: React.FC = () => {
  return (
    <Box py={{ base: 12, md: 16 }}>
      <Container maxW="container.xl">
        <MotionBox
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          p={{ base: 8, md: 12 }}
          borderRadius="2xl"
          bg="linear-gradient(135deg, rgba(0,194,255,0.1) 0%, rgba(0,209,143,0.1) 100%)"
          borderWidth="2px"
          borderColor="neon.500"
          textAlign="center"
          position="relative"
          overflow="hidden"
        >
          {/* Background glow */}
          <Box
            position="absolute"
            top="0"
            left="0"
            right="0"
            bottom="0"
            bg="radial-gradient(circle at center, rgba(0,194,255,0.1) 0%, transparent 70%)"
            borderRadius="2xl"
          />
          
          <VStack spacing={6} position="relative" zIndex={1}>
            <Heading 
              size={{ base: "xl", md: "2xl" }} 
              color="neon.500"
              textShadow="0 0 20px rgba(0,194,255,0.3)"
            >
              Ready to Move?
            </Heading>
            
            <Text 
              color="text.secondary" 
              fontSize={{ base: "lg", md: "xl" }}
              maxW="600px"
              lineHeight="tall"
            >
              Get your instant quote now and experience the UK's most trusted moving service.
            </Text>
            
            <Stack
              direction={{ base: "column", sm: "row" }}
              spacing={4}
              w="full"
              maxW="400px"
            >
              <TouchButton
                size="xl"
                bg="linear-gradient(135deg, #00C2FF, #00D18F)"
                color="white"
                fontWeight="bold"
                rightIcon={<FaArrowRight />}
                _hover={{
                  transform: "translateY(-2px)",
                  boxShadow: "0 8px 25px rgba(0,194,255,0.4)",
                }}
                fullWidth
                onClick={() => window.location.href = '/booking'}
              >
                Get Quote Now
              </TouchButton>
              
              <TouchButton
                size="xl"
                variant="outline"
                borderColor="neon.400"
                color="neon.400"
                leftIcon={<FaPhone />}
                _hover={{
                  bg: 'neon.400',
                  color: 'white',
                }}
                fullWidth
                onClick={() => window.open('tel:+441234567890')}
              >
                Call Us
              </TouchButton>
            </Stack>
          </VStack>
        </MotionBox>
      </Container>
    </Box>
  );
};

// Main Mobile Home Page Component
export default function MobileHomePageContent() {
  const isMobile = useBreakpointValue({ base: true, lg: false });

  return (
    <MobileNavigation title="Home">
      <Box bg="bg.canvas" minH="100vh">
        {/* Mobile Hero */}
        <MobileHero />

        {/* Mobile Stats */}
        <MobileStats />

        {/* Mobile Features */}
        <MobileFeatures />

        {/* Mobile Services */}
        <MobileServices />

        {/* Service Map (Lazy loaded) */}
        {!isMobile && (
          <Suspense fallback={
            <Box h="400px" display="flex" alignItems="center" justifyContent="center">
              <Text color="text.secondary">Loading map...</Text>
            </Box>
          }>
            <ServiceMapSection />
          </Suspense>
        )}

        {/* Mobile Testimonials */}
        <MobileTestimonials />

        {/* Mobile CTA */}
        <MobileCTA />
      </Box>
    </MobileNavigation>
  );
}

