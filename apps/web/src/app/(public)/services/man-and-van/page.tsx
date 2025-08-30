import { Metadata } from 'next';
import { Box, Container, Heading, Text, SimpleGrid, VStack, HStack, Icon, Badge, Flex, List, ListItem, ListIcon } from '@chakra-ui/react';
import { Truck, Clock, Shield, Star, CheckCircle, Phone, MessageCircle, Calculator, Users, Package, Home } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: "Man and Van Service | Professional Van Hire with Driver | Speedy Van",
  description: "Professional man and van service across the UK. Reliable van hire with experienced driver from £25/hour. Same day service, fully insured, live tracking. Book online now.",
  keywords: "man and van, van hire with driver, man with van service, van and driver hire, professional moving service, same day van hire, insured van service",
  alternates: { canonical: "https://speedy-van.co.uk/services/man-and-van" },
  openGraph: {
    title: "Man and Van Service | Professional Van Hire with Driver | Speedy Van",
    description: "Professional man and van service from £25/hour. Same day service, fully insured, live tracking. Book your van with driver online now.",
    url: "https://speedy-van.co.uk/services/man-and-van",
    siteName: "Speedy Van",
    images: [{ url: "/og/og-man-and-van.jpg", width: 1200, height: 630, alt: "Man and Van Service" }],
    locale: "en_GB",
    type: "website",
  },
  twitter: { card: "summary_large_image", site: "@speedyvan", creator: "@speedyvan" },
};

const serviceFeatures = [
  'Professional uniformed driver',
  'Fully insured service',
  'Live GPS tracking',
  'Same day availability',
  'Competitive hourly rates',
  'No hidden charges',
  'Flexible scheduling',
  'Equipment included'
];

const perfectFor = [
  {
    icon: Home,
    title: 'Student Moves',
    description: 'Perfect for university accommodation moves and student relocations'
  },
  {
    icon: Package,
    title: 'Single Items',
    description: 'Furniture delivery, appliance transport, and single item moves'
  },
  {
    icon: Users,
    title: 'Small Apartments',
    description: 'Studio and 1-bedroom apartment moves with professional care'
  },
  {
    icon: Truck,
    title: 'Local Deliveries',
    description: 'Local delivery service for businesses and individuals'
  }
];

const pricingTiers = [
  {
    name: 'Standard Van',
    price: '£25',
    period: 'per hour',
    features: [
      'Small to medium van',
      'Professional driver',
      'Basic equipment',
      'Up to 2 hours minimum'
    ],
    popular: false
  },
  {
    name: 'Large Van',
    price: '£35',
    period: 'per hour',
    features: [
      'Large capacity van',
      'Professional driver',
      'Full equipment set',
      'Up to 2 hours minimum'
    ],
    popular: true
  },
  {
    name: 'Same Day',
    price: '£45',
    period: 'per hour',
    features: [
      'Any size van available',
      'Immediate service',
      'Priority booking',
      'No minimum hours'
    ],
    popular: false
  }
];

const serviceAreas = [
  'London', 'Birmingham', 'Manchester', 'Leeds', 'Glasgow',
  'Liverpool', 'Bristol', 'Sheffield', 'Edinburgh', 'Cardiff',
  'Belfast', 'Leicester', 'Brighton', 'Nottingham', 'Reading'
];

export default function ManAndVanPage() {
  return (
    <>
      <Container maxW="7xl" py={16}>
        {/* Hero Section */}
        <VStack spacing={8} textAlign="center" mb={16}>
          <Badge colorScheme="blue" variant="solid" borderRadius="full" px={4} py={2}>
            Most Popular Service
          </Badge>
          <Heading as="h1" size="2xl" color="blue.600">
            Professional Man and Van Service
          </Heading>
          <Text fontSize="xl" color="gray.600" maxW="4xl">
            Reliable man and van hire with experienced drivers across the UK. From £25/hour with same day availability, 
            full insurance coverage, and live tracking. Perfect for student moves, furniture delivery, and small relocations.
          </Text>
          
          {/* Quick Stats */}
          <HStack spacing={8} flexWrap="wrap" justify="center">
            <VStack spacing={1}>
              <Text fontSize="2xl" fontWeight="bold" color="blue.600">£25/hr</Text>
              <Text fontSize="sm" color="gray.600">Starting Price</Text>
            </VStack>
            <VStack spacing={1}>
              <Text fontSize="2xl" fontWeight="bold" color="blue.600">4.8★</Text>
              <Text fontSize="sm" color="gray.600">Customer Rating</Text>
            </VStack>
            <VStack spacing={1}>
              <Text fontSize="2xl" fontWeight="bold" color="blue.600">2hr</Text>
              <Text fontSize="sm" color="gray.600">Minimum Booking</Text>
            </VStack>
            <VStack spacing={1}>
              <Text fontSize="2xl" fontWeight="bold" color="blue.600">24/7</Text>
              <Text fontSize="sm" color="gray.600">Availability</Text>
            </VStack>
          </HStack>

          {/* CTA Buttons */}
          <HStack spacing={4}>
            <Box
              as={Link}
              href="/book"
              bg="blue.600"
              color="white"
              px={8}
              py={4}
              borderRadius="lg"
              fontWeight="bold"
              _hover={{ bg: "blue.700" }}
              transition="all 0.2s"
              leftIcon={<Icon as={Calculator} />}
            >
              Get Instant Quote
            </Box>
            <Box
              as={Link}
              href="tel:+44-20-XXXX-XXXX"
              bg="green.600"
              color="white"
              px={8}
              py={4}
              borderRadius="lg"
              fontWeight="bold"
              _hover={{ bg: "green.700" }}
              transition="all 0.2s"
            >
              <HStack spacing={2}>
                <Icon as={Phone} />
                <Text>Call Now</Text>
              </HStack>
            </Box>
          </HStack>
        </VStack>

        {/* Service Features */}
        <VStack spacing={12} align="stretch">
          <Heading as="h2" size="lg" textAlign="center">
            Why Choose Our Man and Van Service?
          </Heading>
          
          <SimpleGrid columns={{ base: 2, md: 4 }} spacing={6}>
            {serviceFeatures.map((feature, index) => (
              <HStack key={index} spacing={3}>
                <Icon as={CheckCircle} color="green.500" boxSize={5} />
                <Text color="gray.700">{feature}</Text>
              </HStack>
            ))}
          </SimpleGrid>
        </VStack>

        {/* Perfect For Section */}
        <VStack spacing={12} mt={16}>
          <Heading as="h2" size="lg" textAlign="center">
            Perfect For Your Moving Needs
          </Heading>
          
          <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={8}>
            {perfectFor.map((item, index) => (
              <VStack key={index} spacing={4} textAlign="center" p={6} bg="gray.50" borderRadius="lg">
                <Icon as={item.icon} boxSize={12} color="blue.500" />
                <Heading as="h3" size="md" color="gray.800">
                  {item.title}
                </Heading>
                <Text color="gray.600" textAlign="center">
                  {item.description}
                </Text>
              </VStack>
            ))}
          </SimpleGrid>
        </VStack>

        {/* Pricing Section */}
        <VStack spacing={12} mt={16}>
          <Heading as="h2" size="lg" textAlign="center">
            Transparent Pricing
          </Heading>
          <Text textAlign="center" color="gray.600" maxW="2xl">
            No hidden fees, no surprises. Our hourly rates include driver, fuel, and basic equipment. 
            Additional services like packing materials available at cost.
          </Text>
          
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={8} w="full" maxW="5xl">
            {pricingTiers.map((tier, index) => (
              <Box
                key={index}
                bg="white"
                p={8}
                borderRadius="xl"
                shadow="lg"
                border="2px solid"
                borderColor={tier.popular ? "blue.500" : "gray.200"}
                position="relative"
              >
                {tier.popular && (
                  <Badge
                    position="absolute"
                    top={-3}
                    left="50%"
                    transform="translateX(-50%)"
                    colorScheme="blue"
                    variant="solid"
                    borderRadius="full"
                    px={4}
                    py={1}
                  >
                    Most Popular
                  </Badge>
                )}
                
                <VStack spacing={6}>
                  <VStack spacing={2}>
                    <Heading as="h3" size="md" color="gray.800">
                      {tier.name}
                    </Heading>
                    <HStack align="baseline">
                      <Text fontSize="3xl" fontWeight="bold" color="blue.600">
                        {tier.price}
                      </Text>
                      <Text color="gray.600">{tier.period}</Text>
                    </HStack>
                  </VStack>
                  
                  <List spacing={3} w="full">
                    {tier.features.map((feature, featureIndex) => (
                      <ListItem key={featureIndex}>
                        <ListIcon as={CheckCircle} color="green.500" />
                        {feature}
                      </ListItem>
                    ))}
                  </List>
                  
                  <Box
                    as={Link}
                    href="/book"
                    w="full"
                    bg={tier.popular ? "blue.600" : "gray.100"}
                    color={tier.popular ? "white" : "gray.800"}
                    py={3}
                    textAlign="center"
                    borderRadius="lg"
                    fontWeight="bold"
                    _hover={{
                      bg: tier.popular ? "blue.700" : "gray.200"
                    }}
                    transition="all 0.2s"
                  >
                    Book Now
                  </Box>
                </VStack>
              </Box>
            ))}
          </SimpleGrid>
        </VStack>

        {/* Service Areas */}
        <VStack spacing={8} mt={16}>
          <Heading as="h2" size="lg" textAlign="center">
            Service Areas Across the UK
          </Heading>
          <Text textAlign="center" color="gray.600" maxW="2xl">
            Our man and van service is available across major UK cities and surrounding areas. 
            Same day service available in most locations.
          </Text>
          
          <Flex flexWrap="wrap" justify="center" gap={4}>
            {serviceAreas.map((area, index) => (
              <Badge
                key={index}
                as={Link}
                href={`/uk/${area.toLowerCase()}/man-and-van`}
                variant="outline"
                colorScheme="blue"
                px={4}
                py={2}
                borderRadius="full"
                _hover={{ bg: "blue.50" }}
                transition="all 0.2s"
              >
                {area}
              </Badge>
            ))}
          </Flex>
        </VStack>

        {/* How It Works */}
        <VStack spacing={12} mt={16}>
          <Heading as="h2" size="lg" textAlign="center">
            How Our Man and Van Service Works
          </Heading>
          
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={8} w="full">
            <VStack spacing={4} textAlign="center">
              <Box bg="blue.100" p={4} borderRadius="full">
                <Text fontSize="2xl" fontWeight="bold" color="blue.600">1</Text>
              </Box>
              <Heading as="h3" size="md">Book Online</Heading>
              <Text color="gray.600">
                Get instant quote and book your man and van service online in minutes. 
                Choose your preferred time and date.
              </Text>
            </VStack>
            
            <VStack spacing={4} textAlign="center">
              <Box bg="blue.100" p={4} borderRadius="full">
                <Text fontSize="2xl" fontWeight="bold" color="blue.600">2</Text>
              </Box>
              <Heading as="h3" size="md">We Arrive</Heading>
              <Text color="gray.600">
                Our professional driver arrives on time with a clean van and all necessary equipment. 
                Track their location in real-time.
              </Text>
            </VStack>
            
            <VStack spacing={4} textAlign="center">
              <Box bg="blue.100" p={4} borderRadius="full">
                <Text fontSize="2xl" fontWeight="bold" color="blue.600">3</Text>
              </Box>
              <Heading as="h3" size="md">Job Done</Heading>
              <Text color="gray.600">
                We handle your move with care and professionalism. Pay securely online 
                and rate your experience.
              </Text>
            </VStack>
          </SimpleGrid>
        </VStack>

        {/* FAQ Section */}
        <VStack spacing={8} mt={16}>
          <Heading as="h2" size="lg" textAlign="center">
            Frequently Asked Questions
          </Heading>
          
          <VStack spacing={6} align="stretch" maxW="4xl">
            <Box p={6} bg="gray.50" borderRadius="lg">
              <Heading as="h3" size="sm" mb={2}>What's included in the man and van service?</Heading>
              <Text color="gray.600">
                Our service includes a professional driver, fully insured van, basic moving equipment (straps, blankets), 
                and fuel. The driver will help with loading and unloading your items.
              </Text>
            </Box>
            
            <Box p={6} bg="gray.50" borderRadius="lg">
              <Heading as="h3" size="sm" mb={2}>What's the minimum booking time?</Heading>
              <Text color="gray.600">
                Standard bookings have a 2-hour minimum. Same-day emergency bookings may have different terms. 
                You only pay for the time used, rounded to the nearest 15 minutes.
              </Text>
            </Box>
            
            <Box p={6} bg="gray.50" borderRadius="lg">
              <Heading as="h3" size="sm" mb={2}>Are you fully insured?</Heading>
              <Text color="gray.600">
                Yes, we carry comprehensive public liability and goods in transit insurance. 
                All our drivers are fully licensed and background checked.
              </Text>
            </Box>
            
            <Box p={6} bg="gray.50" borderRadius="lg">
              <Heading as="h3" size="sm" mb={2}>Can I track my driver?</Heading>
              <Text color="gray.600">
                Absolutely! You'll receive live GPS tracking information and can monitor your driver's 
                location in real-time through our app or website.
              </Text>
            </Box>
          </VStack>
        </VStack>

        {/* Final CTA */}
        <Box mt={16} textAlign="center" bg="blue.50" p={12} borderRadius="xl">
          <VStack spacing={6}>
            <Heading as="h2" size="lg">
              Ready to Book Your Man and Van Service?
            </Heading>
            <Text fontSize="lg" color="gray.600" maxW="2xl">
              Join thousands of satisfied customers who trust Speedy Van for their moving needs. 
              Get an instant quote and book your service in under 2 minutes.
            </Text>
            <HStack spacing={4}>
              <Box
                as={Link}
                href="/book"
                bg="blue.600"
                color="white"
                px={8}
                py={4}
                borderRadius="lg"
                fontWeight="bold"
                _hover={{ bg: "blue.700" }}
                transition="all 0.2s"
              >
                Book Now - From £25/hour
              </Box>
              <Box
                as={Link}
                href="https://wa.me/44XXXXXXXXXX"
                bg="green.600"
                color="white"
                px={8}
                py={4}
                borderRadius="lg"
                fontWeight="bold"
                _hover={{ bg: "green.700" }}
                transition="all 0.2s"
              >
                <HStack spacing={2}>
                  <Icon as={MessageCircle} />
                  <Text>WhatsApp Us</Text>
                </HStack>
              </Box>
            </HStack>
          </VStack>
        </Box>

        {/* Service Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Service",
              "name": "Man and Van Service",
              "description": "Professional man and van hire service with experienced drivers across the UK",
              "url": "https://speedy-van.co.uk/services/man-and-van",
              "provider": {
                "@type": "Organization",
                "@id": "https://speedy-van.co.uk/#organization"
              },
              "areaServed": serviceAreas.map(area => ({
                "@type": "City",
                "name": area
              })),
              "hasOfferCatalog": {
                "@type": "OfferCatalog",
                "name": "Man and Van Service Options",
                "itemListElement": pricingTiers.map((tier, index) => ({
                  "@type": "Offer",
                  "name": tier.name,
                  "description": `${tier.name} man and van service`,
                  "price": tier.price.replace('£', ''),
                  "priceCurrency": "GBP",
                  "priceSpecification": {
                    "@type": "PriceSpecification",
                    "price": tier.price.replace('£', ''),
                    "priceCurrency": "GBP",
                    "unitText": "per hour"
                  }
                }))
              },
              "serviceType": "Moving Service",
              "category": "Man and Van",
              "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": "4.8",
                "ratingCount": "247",
                "bestRating": "5"
              }
            }, null, 2)
          }}
        />
      </Container>
    </>
  );
}

