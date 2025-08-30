import { Metadata } from 'next';
import { Box, Container, Heading, Text, SimpleGrid, VStack, HStack, Icon, Badge, Flex } from '@chakra-ui/react';
import { MapPin, Truck, Clock, Star, Phone, MessageCircle, Calculator, Users, Package, Home } from 'lucide-react';
import Link from 'next/link';
import LocalBusinessSchema from '@/components/Schema/LocalBusinessSchema';

export const metadata: Metadata = {
  title: "Man and Van London | House Removals London | Speedy Van",
  description: "Professional man and van service in London. House removals, furniture delivery, and moving services across all London boroughs. Same day service available from £25/hour.",
  keywords: "man and van London, house removals London, furniture delivery London, moving services London, van hire London, removal company London",
  alternates: { canonical: "https://speedy-van.co.uk/uk/london" },
  openGraph: {
    title: "Man and Van London | House Removals London | Speedy Van",
    description: "Professional man and van service in London from £25/hour. Same day service across all London boroughs. Book online now.",
    url: "https://speedy-van.co.uk/uk/london",
    siteName: "Speedy Van",
    images: [{ url: "/og/og-london.jpg", width: 1200, height: 630, alt: "Man and Van London" }],
    locale: "en_GB",
    type: "website",
  },
  twitter: { card: "summary_large_image", site: "@speedyvan", creator: "@speedyvan" },
};

const londonServices = [
  {
    icon: Truck,
    title: 'Man and Van London',
    price: 'From £25/hour',
    description: 'Professional man and van service across all London boroughs',
    href: '/uk/london/man-and-van'
  },
  {
    icon: Home,
    title: 'House Removals London',
    price: 'From £150',
    description: 'Complete house removal service for London homes',
    href: '/uk/london/house-removal'
  },
  {
    icon: Package,
    title: 'Furniture Delivery London',
    price: 'From £35/hour',
    description: 'Safe furniture delivery and assembly across London',
    href: '/uk/london/furniture-delivery'
  },
  {
    icon: Users,
    title: 'Office Removals London',
    price: 'From £200',
    description: 'Professional office relocation services in London',
    href: '/uk/london/office-removals'
  }
];

const londonBoroughs = [
  'Westminster', 'Camden', 'Islington', 'Hackney', 'Tower Hamlets',
  'Greenwich', 'Lewisham', 'Southwark', 'Lambeth', 'Wandsworth',
  'Hammersmith and Fulham', 'Kensington and Chelsea', 'Brent', 'Ealing',
  'Hounslow', 'Richmond upon Thames', 'Kingston upon Thames', 'Merton',
  'Sutton', 'Croydon', 'Bromley', 'Bexley', 'Havering', 'Barking and Dagenham',
  'Redbridge', 'Newham', 'Waltham Forest', 'Haringey', 'Enfield', 'Barnet',
  'Harrow', 'Hillingdon'
];

const whyChooseLondon = [
  {
    icon: MapPin,
    title: 'Local Knowledge',
    description: 'Expert knowledge of London streets, parking, and access restrictions'
  },
  {
    icon: Clock,
    title: 'Same Day Service',
    description: 'Available for urgent moves across London with 2-hour response time'
  },
  {
    icon: Truck,
    title: 'London Licensed',
    description: 'Fully licensed for London operations with congestion charge included'
  },
  {
    icon: Star,
    title: '500+ London Moves',
    description: 'Completed over 500 successful moves across London boroughs'
  }
];

const popularRoutes = [
  { from: 'Central London', to: 'South London', time: '45 mins' },
  { from: 'North London', to: 'East London', time: '35 mins' },
  { from: 'West London', to: 'Central London', time: '30 mins' },
  { from: 'London', to: 'Surrey', time: '60 mins' },
  { from: 'London', to: 'Essex', time: '50 mins' },
  { from: 'London', to: 'Kent', time: '55 mins' }
];

export default function LondonPage() {
  return (
    <>
      <LocalBusinessSchema 
        location={{
          city: 'London',
          region: 'England',
          postalCode: 'SW1A 1AA',
          streetAddress: 'London, UK'
        }}
      />
      
      <Container maxW="7xl" py={16}>
        {/* Hero Section */}
        <VStack spacing={8} textAlign="center" mb={16}>
          <Badge colorScheme="red" variant="solid" borderRadius="full" px={4} py={2}>
            London's #1 Moving Service
          </Badge>
          <Heading as="h1" size="2xl" color="blue.600">
            Professional Man and Van Service in London
          </Heading>
          <Text fontSize="xl" color="gray.600" maxW="4xl">
            Reliable moving services across all London boroughs. From single item delivery to complete house removals, 
            we provide professional, insured, and affordable moving solutions throughout Greater London.
          </Text>
          
          {/* London Stats */}
          <HStack spacing={8} flexWrap="wrap" justify="center">
            <VStack spacing={1}>
              <Text fontSize="2xl" fontWeight="bold" color="blue.600">£25/hr</Text>
              <Text fontSize="sm" color="gray.600">London Rates</Text>
            </VStack>
            <VStack spacing={1}>
              <Text fontSize="2xl" fontWeight="bold" color="blue.600">32</Text>
              <Text fontSize="sm" color="gray.600">Boroughs Covered</Text>
            </VStack>
            <VStack spacing={1}>
              <Text fontSize="2xl" fontWeight="bold" color="blue.600">2hrs</Text>
              <Text fontSize="sm" color="gray.600">Response Time</Text>
            </VStack>
            <VStack spacing={1}>
              <Text fontSize="2xl" fontWeight="bold" color="blue.600">4.8★</Text>
              <Text fontSize="sm" color="gray.600">London Rating</Text>
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
                <Text>Get London Quote</Text>
              </HStack>
            </Box>
            <Box
              as={Link}
              href="tel:+44-20-XXXX-XXXX"
              bg="red.600"
              color="white"
              px={8}
              py={4}
              borderRadius="lg"
              fontWeight="bold"
              _hover={{ bg: "red.700" }}
              transition="all 0.2s"
            >
              <HStack spacing={2}>
                <Icon as={Phone} />
                <Text>Call London Team</Text>
              </HStack>
            </Box>
          </HStack>
        </VStack>

        {/* London Services */}
        <VStack spacing={12} align="stretch">
          <Heading as="h2" size="lg" textAlign="center">
            Our London Moving Services
          </Heading>
          
          <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={8}>
            {londonServices.map((service, index) => (
              <Box
                key={index}
                as={Link}
                href={service.href}
                bg="white"
                p={6}
                borderRadius="xl"
                shadow="lg"
                border="1px solid"
                borderColor="gray.100"
                transition="all 0.3s"
                _hover={{
                  transform: 'translateY(-4px)',
                  shadow: 'xl',
                  borderColor: 'blue.200'
                }}
              >
                <VStack spacing={4}>
                  <Icon as={service.icon} boxSize={12} color="blue.500" />
                  <VStack spacing={2}>
                    <Heading as="h3" size="md" color="gray.800" textAlign="center">
                      {service.title}
                    </Heading>
                    <Text fontSize="lg" fontWeight="bold" color="blue.600">
                      {service.price}
                    </Text>
                    <Text color="gray.600" textAlign="center" fontSize="sm">
                      {service.description}
                    </Text>
                  </VStack>
                </VStack>
              </Box>
            ))}
          </SimpleGrid>
        </VStack>

        {/* Why Choose Us for London */}
        <VStack spacing={12} mt={16}>
          <Heading as="h2" size="lg" textAlign="center">
            Why Choose Speedy Van for London Moves?
          </Heading>
          
          <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={8}>
            {whyChooseLondon.map((item, index) => (
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

        {/* London Boroughs */}
        <VStack spacing={8} mt={16}>
          <Heading as="h2" size="lg" textAlign="center">
            We Cover All London Boroughs
          </Heading>
          <Text textAlign="center" color="gray.600" maxW="2xl">
            Our professional moving service is available across all 32 London boroughs and the City of London. 
            Same day service available in most areas.
          </Text>
          
          <Box maxW="6xl">
            <Flex flexWrap="wrap" justify="center" gap={3}>
              {londonBoroughs.map((borough, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  colorScheme="blue"
                  px={3}
                  py={1}
                  borderRadius="full"
                  fontSize="sm"
                >
                  {borough}
                </Badge>
              ))}
            </Flex>
          </Box>
        </VStack>

        {/* Popular Routes */}
        <VStack spacing={8} mt={16}>
          <Heading as="h2" size="lg" textAlign="center">
            Popular London Moving Routes
          </Heading>
          
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6} w="full" maxW="4xl">
            {popularRoutes.map((route, index) => (
              <Box
                key={index}
                bg="white"
                p={6}
                borderRadius="lg"
                border="1px solid"
                borderColor="gray.200"
                textAlign="center"
              >
                <VStack spacing={3}>
                  <Text fontWeight="bold" color="gray.800">
                    {route.from} → {route.to}
                  </Text>
                  <Badge colorScheme="green" variant="subtle">
                    {route.time} average
                  </Badge>
                </VStack>
              </Box>
            ))}
          </SimpleGrid>
        </VStack>

        {/* London Specific Info */}
        <VStack spacing={8} mt={16}>
          <Heading as="h2" size="lg" textAlign="center">
            London Moving Information
          </Heading>
          
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8} w="full" maxW="4xl">
            <Box bg="blue.50" p={6} borderRadius="lg">
              <VStack spacing={4} align="start">
                <Heading as="h3" size="md" color="blue.800">
                  Congestion Charge Included
                </Heading>
                <Text color="gray.700">
                  All our London services include congestion charge costs. No hidden fees or 
                  surprise charges for central London moves.
                </Text>
              </VStack>
            </Box>
            
            <Box bg="green.50" p={6} borderRadius="lg">
              <VStack spacing={4} align="start">
                <Heading as="h3" size="md" color="green.800">
                  Parking Permits Handled
                </Heading>
                <Text color="gray.700">
                  We handle parking permits and restrictions across London boroughs. 
                  Our team knows the best access routes for efficient moves.
                </Text>
              </VStack>
            </Box>
            
            <Box bg="purple.50" p={6} borderRadius="lg">
              <VStack spacing={4} align="start">
                <Heading as="h3" size="md" color="purple.800">
                  Evening & Weekend Service
                </Heading>
                <Text color="gray.700">
                  Flexible scheduling including evenings and weekends to work around 
                  London's busy lifestyle and traffic patterns.
                </Text>
              </VStack>
            </Box>
            
            <Box bg="orange.50" p={6} borderRadius="lg">
              <VStack spacing={4} align="start">
                <Heading as="h3" size="md" color="orange.800">
                  Storage Solutions
                </Heading>
                <Text color="gray.700">
                  Temporary storage available for London moves with flexible access. 
                  Perfect for chain moves and property renovations.
                </Text>
              </VStack>
            </Box>
          </SimpleGrid>
        </VStack>

        {/* Customer Reviews London */}
        <VStack spacing={8} mt={16}>
          <Heading as="h2" size="lg" textAlign="center">
            London Customer Reviews
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
                  "Excellent service for our move from Camden to Greenwich. The team knew London 
                  well and avoided all the traffic. Professional and efficient!"
                </Text>
                <Text fontWeight="bold" color="gray.800">- Sarah M., Greenwich</Text>
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
                  "Perfect for our Central London office move. They handled the congestion charge 
                  and parking permits. Made our move stress-free!"
                </Text>
                <Text fontWeight="bold" color="gray.800">- James T., Westminster</Text>
              </VStack>
            </Box>
          </SimpleGrid>
        </VStack>

        {/* Final CTA */}
        <Box mt={16} textAlign="center" bg="red.50" p={12} borderRadius="xl">
          <VStack spacing={6}>
            <Heading as="h2" size="lg">
              Ready to Move in London? Book Your Service Today
            </Heading>
            <Text fontSize="lg" color="gray.600" maxW="2xl">
              Join hundreds of satisfied London customers who trust Speedy Van for their moves. 
              Professional service across all London boroughs with same day availability.
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
                Book London Move - From £25/hour
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
                  <Text>WhatsApp London</Text>
                </HStack>
              </Box>
            </HStack>
          </VStack>
        </Box>

        {/* London Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebPage",
              "name": "Man and Van London | House Removals London",
              "description": "Professional man and van service in London covering all boroughs",
              "url": "https://speedy-van.co.uk/uk/london",
              "mainEntity": {
                "@type": "LocalBusiness",
                "@id": "https://speedy-van.co.uk/#localbusiness-london",
                "name": "Speedy Van - London",
                "address": {
                  "@type": "PostalAddress",
                  "addressLocality": "London",
                  "addressRegion": "England",
                  "addressCountry": "GB"
                },
                "geo": {
                  "@type": "GeoCoordinates",
                  "latitude": 51.5074,
                  "longitude": -0.1278
                },
                "areaServed": londonBoroughs.map(borough => ({
                  "@type": "Place",
                  "name": borough
                }))
              }
            }, null, 2)
          }}
        />
      </Container>
    </>
  );
}

