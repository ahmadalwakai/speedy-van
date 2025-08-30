import { Metadata } from 'next';
import { Box, Container, Heading, Text, SimpleGrid, VStack, HStack, Icon, Badge, Flex, List, ListItem, ListIcon } from '@chakra-ui/react';
import { Home, Truck, Users, Package, Clock, Shield, Star, CheckCircle, Phone, MessageCircle, Calculator } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: "House Removal Service | Professional Home Moving | Speedy Van",
  description: "Professional house removal service across the UK. Complete home moving from £150. Experienced team, full insurance, packing service available. Book your house move online.",
  keywords: "house removal, home removal service, house moving, professional house removals, full house removal, home relocation, house moving company",
  alternates: { canonical: "https://speedy-van.co.uk/services/house-removal" },
  openGraph: {
    title: "House Removal Service | Professional Home Moving | Speedy Van",
    description: "Professional house removal service from £150. Complete home moving with experienced team, full insurance, and packing service available.",
    url: "https://speedy-van.co.uk/services/house-removal",
    siteName: "Speedy Van",
    images: [{ url: "/og/og-house-removal.jpg", width: 1200, height: 630, alt: "House Removal Service" }],
    locale: "en_GB",
    type: "website",
  },
  twitter: { card: "summary_large_image", site: "@speedyvan", creator: "@speedyvan" },
};

const serviceIncludes = [
  'Professional moving team',
  'All packing materials',
  'Furniture disassembly/assembly',
  'Comprehensive insurance',
  'Free boxes and bubble wrap',
  'Wardrobe boxes for clothes',
  'Appliance disconnection/connection',
  'Post-move cleanup service'
];

const houseTypes = [
  {
    icon: Home,
    title: '1-2 Bedroom Houses',
    price: 'From £150',
    description: 'Perfect for small homes, flats, and starter properties',
    features: ['2-3 professional movers', '1 large van', '4-6 hours typical', 'Basic packing included']
  },
  {
    icon: Home,
    title: '3-4 Bedroom Houses',
    price: 'From £300',
    description: 'Ideal for family homes and larger properties',
    features: ['3-4 professional movers', '1-2 large vans', '6-8 hours typical', 'Full packing service'],
    popular: true
  },
  {
    icon: Home,
    title: '5+ Bedroom Houses',
    price: 'From £500',
    description: 'Comprehensive service for large family homes',
    features: ['4-6 professional movers', '2-3 large vans', '8-12 hours typical', 'Premium packing service']
  }
];

const movingProcess = [
  {
    step: 1,
    title: 'Free Survey',
    description: 'We visit your home to assess your moving needs and provide an accurate quote'
  },
  {
    step: 2,
    title: 'Packing Day',
    description: 'Our team arrives to professionally pack your belongings with quality materials'
  },
  {
    step: 3,
    title: 'Moving Day',
    description: 'We carefully load, transport, and unload your items at your new home'
  },
  {
    step: 4,
    title: 'Unpacking',
    description: 'Optional unpacking service to help you settle into your new home quickly'
  }
];

const whyChooseUs = [
  {
    icon: Users,
    title: 'Experienced Team',
    description: 'Professional movers with years of house removal experience'
  },
  {
    icon: Shield,
    title: 'Fully Insured',
    description: 'Comprehensive insurance coverage for complete peace of mind'
  },
  {
    icon: Package,
    title: 'Quality Materials',
    description: 'Premium packing materials and protective equipment included'
  },
  {
    icon: Clock,
    title: 'Flexible Timing',
    description: 'Weekend and evening moves available to suit your schedule'
  }
];

const additionalServices = [
  'Piano removal and specialist items',
  'Temporary storage solutions',
  'Pet relocation assistance',
  'Utility disconnection/reconnection',
  'Cleaning service for old property',
  'Furniture assembly at new home',
  'Appliance installation service',
  'Garden furniture and shed moves'
];

export default function HouseRemovalPage() {
  return (
    <>
      <Container maxW="7xl" py={16}>
        {/* Hero Section */}
        <VStack spacing={8} textAlign="center" mb={16}>
          <Badge colorScheme="green" variant="solid" borderRadius="full" px={4} py={2}>
            Complete Home Moving Service
          </Badge>
          <Heading as="h1" size="2xl" color="blue.600">
            Professional House Removal Service
          </Heading>
          <Text fontSize="xl" color="gray.600" maxW="4xl">
            Stress-free house removals across the UK with our experienced team. From small flats to large family homes, 
            we handle every aspect of your move with care and professionalism. Full insurance and packing service included.
          </Text>
          
          {/* Quick Stats */}
          <HStack spacing={8} flexWrap="wrap" justify="center">
            <VStack spacing={1}>
              <Text fontSize="2xl" fontWeight="bold" color="blue.600">£150</Text>
              <Text fontSize="sm" color="gray.600">Starting Price</Text>
            </VStack>
            <VStack spacing={1}>
              <Text fontSize="2xl" fontWeight="bold" color="blue.600">4.8★</Text>
              <Text fontSize="sm" color="gray.600">Customer Rating</Text>
            </VStack>
            <VStack spacing={1}>
              <Text fontSize="2xl" fontWeight="bold" color="blue.600">2,500+</Text>
              <Text fontSize="sm" color="gray.600">Homes Moved</Text>
            </VStack>
            <VStack spacing={1}>
              <Text fontSize="2xl" fontWeight="bold" color="blue.600">100%</Text>
              <Text fontSize="sm" color="gray.600">Insured</Text>
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
            >
              <HStack spacing={2}>
                <Icon as={Calculator} />
                <Text>Get Free Quote</Text>
              </HStack>
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
                <Text>Call for Survey</Text>
              </HStack>
            </Box>
          </HStack>
        </VStack>

        {/* What's Included */}
        <VStack spacing={12} align="stretch">
          <Heading as="h2" size="lg" textAlign="center">
            What's Included in Our House Removal Service
          </Heading>
          
          <SimpleGrid columns={{ base: 2, md: 4 }} spacing={6}>
            {serviceIncludes.map((item, index) => (
              <HStack key={index} spacing={3}>
                <Icon as={CheckCircle} color="green.500" boxSize={5} />
                <Text color="gray.700">{item}</Text>
              </HStack>
            ))}
          </SimpleGrid>
        </VStack>

        {/* House Types & Pricing */}
        <VStack spacing={12} mt={16}>
          <Heading as="h2" size="lg" textAlign="center">
            House Removal Packages
          </Heading>
          <Text textAlign="center" color="gray.600" maxW="2xl">
            Choose the perfect package for your home size. All packages include professional team, 
            packing materials, insurance, and our satisfaction guarantee.
          </Text>
          
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={8} w="full" maxW="6xl">
            {houseTypes.map((house, index) => (
              <Box
                key={index}
                bg="white"
                p={8}
                borderRadius="xl"
                shadow="lg"
                border="2px solid"
                borderColor={house.popular ? "blue.500" : "gray.200"}
                position="relative"
              >
                {house.popular && (
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
                  <Icon as={house.icon} boxSize={12} color="blue.500" />
                  
                  <VStack spacing={2}>
                    <Heading as="h3" size="md" color="gray.800">
                      {house.title}
                    </Heading>
                    <Text fontSize="2xl" fontWeight="bold" color="blue.600">
                      {house.price}
                    </Text>
                    <Text color="gray.600" textAlign="center">
                      {house.description}
                    </Text>
                  </VStack>
                  
                  <List spacing={3} w="full">
                    {house.features.map((feature, featureIndex) => (
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
                    bg={house.popular ? "blue.600" : "gray.100"}
                    color={house.popular ? "white" : "gray.800"}
                    py={3}
                    textAlign="center"
                    borderRadius="lg"
                    fontWeight="bold"
                    _hover={{
                      bg: house.popular ? "blue.700" : "gray.200"
                    }}
                    transition="all 0.2s"
                  >
                    Get Quote
                  </Box>
                </VStack>
              </Box>
            ))}
          </SimpleGrid>
        </VStack>

        {/* Moving Process */}
        <VStack spacing={12} mt={16}>
          <Heading as="h2" size="lg" textAlign="center">
            Our House Removal Process
          </Heading>
          
          <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={8} w="full">
            {movingProcess.map((process, index) => (
              <VStack key={index} spacing={4} textAlign="center">
                <Box bg="blue.100" p={4} borderRadius="full">
                  <Text fontSize="2xl" fontWeight="bold" color="blue.600">{process.step}</Text>
                </Box>
                <Heading as="h3" size="md">{process.title}</Heading>
                <Text color="gray.600" textAlign="center">
                  {process.description}
                </Text>
              </VStack>
            ))}
          </SimpleGrid>
        </VStack>

        {/* Why Choose Us */}
        <VStack spacing={12} mt={16}>
          <Heading as="h2" size="lg" textAlign="center">
            Why Choose Speedy Van for Your House Removal?
          </Heading>
          
          <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={8}>
            {whyChooseUs.map((item, index) => (
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

        {/* Additional Services */}
        <VStack spacing={8} mt={16}>
          <Heading as="h2" size="lg" textAlign="center">
            Additional Services Available
          </Heading>
          <Text textAlign="center" color="gray.600" maxW="2xl">
            Enhance your house removal with our additional services. We can handle every aspect 
            of your move to make the process as smooth as possible.
          </Text>
          
          <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={4} w="full">
            {additionalServices.map((service, index) => (
              <Box
                key={index}
                bg="white"
                p={4}
                borderRadius="lg"
                border="1px solid"
                borderColor="gray.200"
                textAlign="center"
              >
                <Text color="gray.700">{service}</Text>
              </Box>
            ))}
          </SimpleGrid>
        </VStack>

        {/* Customer Testimonials */}
        <VStack spacing={8} mt={16}>
          <Heading as="h2" size="lg" textAlign="center">
            What Our Customers Say
          </Heading>
          
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={8} w="full">
            <Box bg="white" p={6} borderRadius="lg" shadow="md">
              <VStack spacing={4} align="start">
                <HStack spacing={1}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Icon key={star} as={Star} color="yellow.400" fill="yellow.400" />
                  ))}
                </HStack>
                <Text color="gray.700">
                  "Fantastic service! The team was professional, careful with our belongings, 
                  and made our house move stress-free. Highly recommended!"
                </Text>
                <Text fontWeight="bold" color="gray.800">- Sarah M., London</Text>
              </VStack>
            </Box>
            
            <Box bg="white" p={6} borderRadius="lg" shadow="md">
              <VStack spacing={4} align="start">
                <HStack spacing={1}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Icon key={star} as={Star} color="yellow.400" fill="yellow.400" />
                  ))}
                </HStack>
                <Text color="gray.700">
                  "Excellent house removal service. They packed everything carefully and 
                  nothing was damaged. Great value for money and very professional."
                </Text>
                <Text fontWeight="bold" color="gray.800">- James T., Birmingham</Text>
              </VStack>
            </Box>
            
            <Box bg="white" p={6} borderRadius="lg" shadow="md">
              <VStack spacing={4} align="start">
                <HStack spacing={1}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Icon key={star} as={Star} color="yellow.400" fill="yellow.400" />
                  ))}
                </HStack>
                <Text color="gray.700">
                  "The best house removal company we've used. Punctual, efficient, and 
                  took great care of our furniture. Will definitely use again!"
                </Text>
                <Text fontWeight="bold" color="gray.800">- Emma R., Manchester</Text>
              </VStack>
            </Box>
          </SimpleGrid>
        </VStack>

        {/* Final CTA */}
        <Box mt={16} textAlign="center" bg="blue.50" p={12} borderRadius="xl">
          <VStack spacing={6}>
            <Heading as="h2" size="lg">
              Ready to Move House? Get Your Free Quote Today
            </Heading>
            <Text fontSize="lg" color="gray.600" maxW="2xl">
              Join thousands of families who have trusted Speedy Van with their house removal. 
              Get a free, no-obligation quote and book your move with confidence.
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
                Get Free Quote - From £150
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
                  <Text>WhatsApp Quote</Text>
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
              "name": "House Removal Service",
              "description": "Professional house removal service for complete home moving across the UK",
              "url": "https://speedy-van.co.uk/services/house-removal",
              "provider": {
                "@type": "Organization",
                "@id": "https://speedy-van.co.uk/#organization"
              },
              "areaServed": {
                "@type": "Country",
                "name": "United Kingdom"
              },
              "hasOfferCatalog": {
                "@type": "OfferCatalog",
                "name": "House Removal Packages",
                "itemListElement": houseTypes.map((house, index) => ({
                  "@type": "Offer",
                  "name": house.title,
                  "description": house.description,
                  "price": house.price.replace('From £', ''),
                  "priceCurrency": "GBP",
                  "priceSpecification": {
                    "@type": "PriceSpecification",
                    "price": house.price.replace('From £', ''),
                    "priceCurrency": "GBP",
                    "unitText": "starting from"
                  }
                }))
              },
              "serviceType": "House Removal",
              "category": "Moving Service",
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

