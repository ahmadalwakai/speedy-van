import { Metadata } from 'next';
import { Box, Container, Heading, Text, SimpleGrid, VStack, HStack, Icon, Badge, Flex, List, ListItem, ListIcon } from '@chakra-ui/react';
import { Package, Truck, Shield, Clock, Star, CheckCircle, Phone, MessageCircle, Calculator, Sofa, Bed, Table } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: "Furniture Removal Service | Professional Furniture Delivery | Speedy Van",
  description: "Professional furniture removal and delivery service across the UK. Safe transport for all furniture types from £35/hour. Assembly service available. Book online now.",
  keywords: "furniture removal, furniture delivery, furniture transport, sofa delivery, bed delivery, furniture moving service, professional furniture movers",
  alternates: { canonical: "https://speedy-van.co.uk/services/furniture-removal" },
  openGraph: {
    title: "Furniture Removal Service | Professional Furniture Delivery | Speedy Van",
    description: "Professional furniture removal and delivery from £35/hour. Safe transport, assembly service, fully insured. Book your furniture move online.",
    url: "https://speedy-van.co.uk/services/furniture-removal",
    siteName: "Speedy Van",
    images: [{ url: "/og/og-furniture-removal.jpg", width: 1200, height: 630, alt: "Furniture Removal Service" }],
    locale: "en_GB",
    type: "website",
  },
  twitter: { card: "summary_large_image", site: "@speedyvan", creator: "@speedyvan" },
};

const furnitureTypes = [
  {
    icon: Sofa,
    title: 'Sofas & Seating',
    description: 'Professional sofa delivery and removal with protective covering',
    items: ['3-seater sofas', 'Corner sofas', 'Recliners', 'Armchairs', 'Dining chairs']
  },
  {
    icon: Bed,
    title: 'Bedroom Furniture',
    description: 'Safe transport of beds, wardrobes, and bedroom sets',
    items: ['Double/King beds', 'Wardrobes', 'Chest of drawers', 'Bedside tables', 'Mattresses']
  },
  {
    icon: Table,
    title: 'Tables & Storage',
    description: 'Careful handling of dining tables, desks, and storage units',
    items: ['Dining tables', 'Office desks', 'Bookcases', 'TV units', 'Kitchen units']
  }
];

const serviceFeatures = [
  'Professional furniture protection',
  'Assembly and disassembly service',
  'Careful handling by trained staff',
  'Fully insured transport',
  'Flexible scheduling options',
  'Same day service available',
  'Competitive hourly rates',
  'No hidden charges'
];

const pricingOptions = [
  {
    name: 'Single Item',
    price: '£35',
    period: 'per hour',
    description: 'Perfect for individual furniture pieces',
    features: [
      'Professional driver',
      'Protective materials',
      'Basic assembly help',
      '2 hour minimum'
    ],
    popular: false
  },
  {
    name: 'Multiple Items',
    price: '£45',
    period: 'per hour',
    description: 'Ideal for furniture sets and multiple pieces',
    features: [
      'Two-person team',
      'Full protection kit',
      'Assembly service',
      '2 hour minimum'
    ],
    popular: true
  },
  {
    name: 'Full Room',
    price: '£65',
    period: 'per hour',
    description: 'Complete room furniture removal and setup',
    features: [
      'Three-person team',
      'Premium protection',
      'Full assembly service',
      'No minimum hours'
    ],
    popular: false
  }
];

const specialtyServices = [
  {
    title: 'Piano Removal',
    description: 'Specialized piano moving with expert equipment and techniques'
  },
  {
    title: 'Antique Furniture',
    description: 'Extra care and protection for valuable antique pieces'
  },
  {
    title: 'Office Furniture',
    description: 'Professional office furniture relocation and setup'
  },
  {
    title: 'Garden Furniture',
    description: 'Outdoor furniture moving including sheds and gazebos'
  },
  {
    title: 'Appliance Delivery',
    description: 'White goods delivery with installation service available'
  },
  {
    title: 'Flat Pack Assembly',
    description: 'Professional assembly service for flat pack furniture'
  }
];

const protectionMethods = [
  {
    title: 'Protective Wrapping',
    description: 'All furniture wrapped in protective blankets and plastic covering'
  },
  {
    title: 'Secure Loading',
    description: 'Professional loading techniques with straps and padding'
  },
  {
    title: 'Climate Control',
    description: 'Temperature-controlled vans for sensitive materials'
  },
  {
    title: 'Insurance Coverage',
    description: 'Comprehensive insurance for complete peace of mind'
  }
];

export default function FurnitureRemovalPage() {
  return (
    <>
      <Container maxW="7xl" py={16}>
        {/* Hero Section */}
        <VStack spacing={8} textAlign="center" mb={16}>
          <Badge colorScheme="purple" variant="solid" borderRadius="full" px={4} py={2}>
            Specialist Furniture Service
          </Badge>
          <Heading as="h1" size="2xl" color="blue.600">
            Professional Furniture Removal & Delivery
          </Heading>
          <Text fontSize="xl" color="gray.600" maxW="4xl">
            Expert furniture removal and delivery service across the UK. From single items to complete room sets, 
            we handle your furniture with professional care. Assembly service available from £35/hour.
          </Text>
          
          {/* Quick Stats */}
          <HStack spacing={8} flexWrap="wrap" justify="center">
            <VStack spacing={1}>
              <Text fontSize="2xl" fontWeight="bold" color="blue.600">£35/hr</Text>
              <Text fontSize="sm" color="gray.600">Starting Price</Text>
            </VStack>
            <VStack spacing={1}>
              <Text fontSize="2xl" fontWeight="bold" color="blue.600">4.9★</Text>
              <Text fontSize="sm" color="gray.600">Furniture Rating</Text>
            </VStack>
            <VStack spacing={1}>
              <Text fontSize="2xl" fontWeight="bold" color="blue.600">5,000+</Text>
              <Text fontSize="sm" color="gray.600">Items Moved</Text>
            </VStack>
            <VStack spacing={1}>
              <Text fontSize="2xl" fontWeight="bold" color="blue.600">0%</Text>
              <Text fontSize="sm" color="gray.600">Damage Rate</Text>
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
                <Text>Get Quote</Text>
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
                <Text>Call Now</Text>
              </HStack>
            </Box>
          </HStack>
        </VStack>

        {/* Furniture Types */}
        <VStack spacing={12} align="stretch">
          <Heading as="h2" size="lg" textAlign="center">
            Furniture We Move
          </Heading>
          
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={8}>
            {furnitureTypes.map((type, index) => (
              <VStack key={index} spacing={6} p={8} bg="gray.50" borderRadius="xl">
                <Icon as={type.icon} boxSize={16} color="blue.500" />
                <VStack spacing={3}>
                  <Heading as="h3" size="md" color="gray.800">
                    {type.title}
                  </Heading>
                  <Text color="gray.600" textAlign="center">
                    {type.description}
                  </Text>
                </VStack>
                <VStack spacing={2} align="start" w="full">
                  {type.items.map((item, itemIndex) => (
                    <HStack key={itemIndex} spacing={2}>
                      <Icon as={CheckCircle} color="green.500" boxSize={4} />
                      <Text fontSize="sm" color="gray.600">{item}</Text>
                    </HStack>
                  ))}
                </VStack>
              </VStack>
            ))}
          </SimpleGrid>
        </VStack>

        {/* Service Features */}
        <VStack spacing={12} mt={16}>
          <Heading as="h2" size="lg" textAlign="center">
            Why Choose Our Furniture Removal Service?
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

        {/* Pricing Options */}
        <VStack spacing={12} mt={16}>
          <Heading as="h2" size="lg" textAlign="center">
            Furniture Removal Pricing
          </Heading>
          <Text textAlign="center" color="gray.600" maxW="2xl">
            Transparent pricing based on your furniture removal needs. All prices include professional team, 
            protective materials, and basic assembly service.
          </Text>
          
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={8} w="full" maxW="5xl">
            {pricingOptions.map((option, index) => (
              <Box
                key={index}
                bg="white"
                p={8}
                borderRadius="xl"
                shadow="lg"
                border="2px solid"
                borderColor={option.popular ? "blue.500" : "gray.200"}
                position="relative"
              >
                {option.popular && (
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
                      {option.name}
                    </Heading>
                    <HStack align="baseline">
                      <Text fontSize="3xl" fontWeight="bold" color="blue.600">
                        {option.price}
                      </Text>
                      <Text color="gray.600">{option.period}</Text>
                    </HStack>
                    <Text color="gray.600" textAlign="center">
                      {option.description}
                    </Text>
                  </VStack>
                  
                  <List spacing={3} w="full">
                    {option.features.map((feature, featureIndex) => (
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
                    bg={option.popular ? "blue.600" : "gray.100"}
                    color={option.popular ? "white" : "gray.800"}
                    py={3}
                    textAlign="center"
                    borderRadius="lg"
                    fontWeight="bold"
                    _hover={{
                      bg: option.popular ? "blue.700" : "gray.200"
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

        {/* Protection Methods */}
        <VStack spacing={12} mt={16}>
          <Heading as="h2" size="lg" textAlign="center">
            How We Protect Your Furniture
          </Heading>
          
          <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={8}>
            {protectionMethods.map((method, index) => (
              <VStack key={index} spacing={4} textAlign="center" p={6} bg="white" borderRadius="lg" shadow="md">
                <Icon as={Shield} boxSize={12} color="blue.500" />
                <Heading as="h3" size="md" color="gray.800">
                  {method.title}
                </Heading>
                <Text color="gray.600" textAlign="center">
                  {method.description}
                </Text>
              </VStack>
            ))}
          </SimpleGrid>
        </VStack>

        {/* Specialty Services */}
        <VStack spacing={8} mt={16}>
          <Heading as="h2" size="lg" textAlign="center">
            Specialty Furniture Services
          </Heading>
          <Text textAlign="center" color="gray.600" maxW="2xl">
            We handle all types of furniture with specialized techniques and equipment for different items.
          </Text>
          
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6} w="full">
            {specialtyServices.map((service, index) => (
              <Box
                key={index}
                bg="white"
                p={6}
                borderRadius="lg"
                border="1px solid"
                borderColor="gray.200"
                _hover={{ borderColor: "blue.200", bg: "blue.50" }}
                transition="all 0.2s"
              >
                <VStack align="start" spacing={3}>
                  <Heading as="h3" size="sm" color="gray.800">
                    {service.title}
                  </Heading>
                  <Text fontSize="sm" color="gray.600">
                    {service.description}
                  </Text>
                </VStack>
              </Box>
            ))}
          </SimpleGrid>
        </VStack>

        {/* Process Steps */}
        <VStack spacing={12} mt={16}>
          <Heading as="h2" size="lg" textAlign="center">
            Our Furniture Removal Process
          </Heading>
          
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={8} w="full">
            <VStack spacing={4} textAlign="center">
              <Box bg="blue.100" p={4} borderRadius="full">
                <Text fontSize="2xl" fontWeight="bold" color="blue.600">1</Text>
              </Box>
              <Heading as="h3" size="md">Assessment</Heading>
              <Text color="gray.600">
                We assess your furniture and determine the best protection and transport method.
              </Text>
            </VStack>
            
            <VStack spacing={4} textAlign="center">
              <Box bg="blue.100" p={4} borderRadius="full">
                <Text fontSize="2xl" fontWeight="bold" color="blue.600">2</Text>
              </Box>
              <Heading as="h3" size="md">Protection</Heading>
              <Text color="gray.600">
                Your furniture is carefully wrapped and protected using professional materials.
              </Text>
            </VStack>
            
            <VStack spacing={4} textAlign="center">
              <Box bg="blue.100" p={4} borderRadius="full">
                <Text fontSize="2xl" fontWeight="bold" color="blue.600">3</Text>
              </Box>
              <Heading as="h3" size="md">Delivery</Heading>
              <Text color="gray.600">
                Safe transport and careful placement at your destination with assembly if needed.
              </Text>
            </VStack>
          </SimpleGrid>
        </VStack>

        {/* Customer Reviews */}
        <VStack spacing={8} mt={16}>
          <Heading as="h2" size="lg" textAlign="center">
            Customer Reviews
          </Heading>
          
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8} w="full" maxW="4xl">
            <Box bg="white" p={6} borderRadius="lg" shadow="md">
              <VStack spacing={4} align="start">
                <HStack spacing={1}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Icon key={star} as={Star} color="yellow.400" fill="yellow.400" />
                  ))}
                </HStack>
                <Text color="gray.700">
                  "Excellent furniture delivery service! They moved our entire living room set 
                  with such care. Not a single scratch on anything. Highly professional team."
                </Text>
                <Text fontWeight="bold" color="gray.800">- Lisa P., Bristol</Text>
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
                  "Amazing service for our antique furniture. They took extra care and everything 
                  arrived in perfect condition. The assembly service was a bonus!"
                </Text>
                <Text fontWeight="bold" color="gray.800">- David M., Edinburgh</Text>
              </VStack>
            </Box>
          </SimpleGrid>
        </VStack>

        {/* Final CTA */}
        <Box mt={16} textAlign="center" bg="blue.50" p={12} borderRadius="xl">
          <VStack spacing={6}>
            <Heading as="h2" size="lg">
              Need Furniture Moved? Get Your Quote Today
            </Heading>
            <Text fontSize="lg" color="gray.600" maxW="2xl">
              Trust the experts with your valuable furniture. Professional service, competitive prices, 
              and complete peace of mind. Book your furniture removal today.
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
                Book Now - From £35/hour
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
              "name": "Furniture Removal Service",
              "description": "Professional furniture removal and delivery service with assembly options",
              "url": "https://speedy-van.co.uk/services/furniture-removal",
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
                "name": "Furniture Removal Options",
                "itemListElement": pricingOptions.map((option, index) => ({
                  "@type": "Offer",
                  "name": option.name,
                  "description": option.description,
                  "price": option.price.replace('£', ''),
                  "priceCurrency": "GBP",
                  "priceSpecification": {
                    "@type": "PriceSpecification",
                    "price": option.price.replace('£', ''),
                    "priceCurrency": "GBP",
                    "unitText": "per hour"
                  }
                }))
              },
              "serviceType": "Furniture Removal",
              "category": "Moving Service",
              "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": "4.9",
                "ratingCount": "189",
                "bestRating": "5"
              }
            }, null, 2)
          }}
        />
      </Container>
    </>
  );
}

