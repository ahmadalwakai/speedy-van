import { Metadata } from 'next';
import { Box, Container, Heading, Text, SimpleGrid, VStack, HStack, Icon, Badge, Flex } from '@chakra-ui/react';
import { Truck, Users, Home, Package, Clock, Shield, Star, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: "Professional Moving Services | Man and Van | House Removals | Speedy Van",
  description: "Complete range of professional moving services across the UK. Man and van, house removals, furniture delivery, office relocation and more. Get instant quotes online.",
  keywords: "moving services, man and van, house removals, furniture removal, office relocation, van hire, removal services, professional movers, UK moving company",
  alternates: { canonical: "https://speedy-van.co.uk/services" },
  openGraph: {
    title: "Professional Moving Services | Man and Van | House Removals | Speedy Van",
    description: "Complete range of professional moving services across the UK. Man and van, house removals, furniture delivery and more.",
    url: "https://speedy-van.co.uk/services",
    siteName: "Speedy Van",
    images: [{ url: "/og/og-services.jpg", width: 1200, height: 630, alt: "Speedy Van Services" }],
    locale: "en_GB",
    type: "website",
  },
  twitter: { card: "summary_large_image", site: "@speedyvan", creator: "@speedyvan" },
};

const coreServices = [
  {
    id: 'man-and-van',
    title: 'Man and Van Service',
    description: 'Professional man and van hire for small to medium moves. Perfect for students, single items, and apartment moves.',
    icon: Truck,
    price: 'From £25/hour',
    features: ['Professional driver', 'Fully insured', 'Live tracking', 'Same day service'],
    popular: true,
    href: '/services/man-and-van'
  },
  {
    id: 'van-and-man',
    title: 'Van and Man Service',
    description: 'Reliable van and man service with experienced movers. Ideal for furniture delivery and local moves.',
    icon: Users,
    price: 'From £30/hour',
    features: ['Experienced team', 'Equipment included', 'Flexible timing', 'Competitive rates'],
    popular: false,
    href: '/services/van-and-man'
  },
  {
    id: '2-men-with-van',
    title: '2 Men with Van',
    description: 'Two professional movers with van for efficient house moves and heavy furniture transport.',
    icon: Users,
    price: 'From £45/hour',
    features: ['Two movers', 'Heavy lifting', 'Faster service', 'Professional equipment'],
    popular: true,
    href: '/services/2-men-with-van'
  },
  {
    id: 'van-with-2-men',
    title: 'Van with 2 Men',
    description: 'Large van with two experienced movers for comprehensive moving solutions.',
    icon: Truck,
    price: 'From £50/hour',
    features: ['Large capacity', 'Two professionals', 'Full service', 'Insurance included'],
    popular: false,
    href: '/services/van-with-2-men'
  },
  {
    id: 'house-removal',
    title: 'House Removal Service',
    description: 'Complete house removal service for full home relocations. Professional packing and moving.',
    icon: Home,
    price: 'From £150',
    features: ['Full house service', 'Packing materials', 'Professional team', 'Storage options'],
    popular: true,
    href: '/services/house-removal'
  },
  {
    id: 'full-house-removal',
    title: 'Full House Removal',
    description: 'Comprehensive full house removal with packing, loading, transport and unpacking services.',
    icon: Package,
    price: 'From £200',
    features: ['Complete service', 'Packing & unpacking', 'Furniture assembly', 'Cleaning service'],
    popular: false,
    href: '/services/full-house-removal'
  },
  {
    id: 'furniture-removal',
    title: 'Furniture Removal',
    description: 'Specialized furniture removal and delivery service. Safe transport for all furniture types.',
    icon: Package,
    price: 'From £35/hour',
    features: ['Furniture protection', 'Assembly service', 'Careful handling', 'Damage insurance'],
    popular: true,
    href: '/services/furniture-removal'
  },
  {
    id: '1-bedroom-removal',
    title: '1 Bedroom Removal',
    description: 'Efficient 1 bedroom apartment removal service. Perfect for studio and small apartment moves.',
    icon: Home,
    price: 'From £120',
    features: ['Fixed pricing', 'Quick service', 'Student friendly', 'Flexible scheduling'],
    popular: false,
    href: '/services/1-bedroom-removal'
  }
];

const additionalServices = [
  {
    title: 'Office Relocation',
    description: 'Professional office moving with minimal business disruption',
    href: '/services/office-relocation'
  },
  {
    title: 'Piano Removal',
    description: 'Specialized piano moving with expert care and equipment',
    href: '/services/piano-removal'
  },
  {
    title: 'Storage Services',
    description: 'Secure storage solutions for short and long-term needs',
    href: '/services/storage'
  },
  {
    title: 'Packing Service',
    description: 'Professional packing service with quality materials',
    href: '/services/packing'
  },
  {
    title: 'International Moves',
    description: 'International moving services across Europe and beyond',
    href: '/services/international'
  },
  {
    title: 'Same Day Service',
    description: 'Urgent same-day moving service for immediate needs',
    href: '/services/same-day'
  }
];

const whyChooseUs = [
  {
    icon: Shield,
    title: 'Fully Insured',
    description: 'Comprehensive insurance coverage for your peace of mind'
  },
  {
    icon: Clock,
    title: 'Punctual Service',
    description: 'Always on time with live tracking and updates'
  },
  {
    icon: Star,
    title: '4.8/5 Rating',
    description: 'Trusted by thousands with excellent customer reviews'
  },
  {
    icon: Users,
    title: 'Professional Team',
    description: 'Experienced, vetted, and uniformed moving professionals'
  }
];

export default function ServicesPage() {
  return (
    <>
      <Container maxW="7xl" py={16}>
        {/* Header Section */}
        <VStack spacing={8} textAlign="center" mb={16}>
          <Heading as="h1" size="2xl" color="blue.600">
            Professional Moving Services Across the UK
          </Heading>
          <Text fontSize="xl" color="gray.600" maxW="4xl">
            From single item delivery to complete house removals, we provide comprehensive moving solutions 
            tailored to your needs. Professional, reliable, and affordable services with live tracking.
          </Text>
        </VStack>

        {/* Core Services Grid */}
        <VStack spacing={12} align="stretch">
          <Heading as="h2" size="lg" textAlign="center">
            Our Core Moving Services
          </Heading>
          
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={8}>
            {coreServices.map((service) => (
              <Box
                key={service.id}
                as={Link}
                href={service.href}
                bg="white"
                p={8}
                borderRadius="xl"
                shadow="lg"
                border="1px solid"
                borderColor="gray.100"
                position="relative"
                transition="all 0.3s"
                _hover={{
                  transform: 'translateY(-4px)',
                  shadow: 'xl',
                  borderColor: 'blue.200'
                }}
              >
                {service.popular && (
                  <Badge
                    position="absolute"
                    top={4}
                    right={4}
                    colorScheme="blue"
                    variant="solid"
                    borderRadius="full"
                    px={3}
                    py={1}
                  >
                    Popular
                  </Badge>
                )}
                
                <VStack align="start" spacing={4}>
                  <HStack spacing={3}>
                    <Icon as={service.icon} boxSize={8} color="blue.500" />
                    <VStack align="start" spacing={1}>
                      <Heading as="h3" size="md" color="gray.800">
                        {service.title}
                      </Heading>
                      <Text fontSize="lg" fontWeight="bold" color="blue.600">
                        {service.price}
                      </Text>
                    </VStack>
                  </HStack>
                  
                  <Text color="gray.600" lineHeight="tall">
                    {service.description}
                  </Text>
                  
                  <VStack align="start" spacing={2} w="full">
                    {service.features.map((feature, index) => (
                      <HStack key={index} spacing={2}>
                        <Box w={2} h={2} bg="green.400" borderRadius="full" />
                        <Text fontSize="sm" color="gray.600">{feature}</Text>
                      </HStack>
                    ))}
                  </VStack>
                  
                  <HStack spacing={2} color="blue.600" fontWeight="medium" mt={4}>
                    <Text>Learn More</Text>
                    <Icon as={ArrowRight} boxSize={4} />
                  </HStack>
                </VStack>
              </Box>
            ))}
          </SimpleGrid>
        </VStack>

        {/* Additional Services */}
        <VStack spacing={8} mt={16}>
          <Heading as="h2" size="lg" textAlign="center">
            Additional Specialized Services
          </Heading>
          
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6} w="full">
            {additionalServices.map((service, index) => (
              <Box
                key={index}
                as={Link}
                href={service.href}
                bg="gray.50"
                p={6}
                borderRadius="lg"
                border="1px solid"
                borderColor="gray.200"
                transition="all 0.2s"
                _hover={{
                  bg: 'blue.50',
                  borderColor: 'blue.200'
                }}
              >
                <VStack align="start" spacing={2}>
                  <Text fontWeight="bold" color="gray.800">
                    {service.title}
                  </Text>
                  <Text fontSize="sm" color="gray.600">
                    {service.description}
                  </Text>
                </VStack>
              </Box>
            ))}
          </SimpleGrid>
        </VStack>

        {/* Why Choose Us */}
        <VStack spacing={8} mt={16}>
          <Heading as="h2" size="lg" textAlign="center">
            Why Choose Speedy Van?
          </Heading>
          
          <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={8} w="full">
            {whyChooseUs.map((item, index) => (
              <VStack key={index} spacing={4} textAlign="center">
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

        {/* Call to Action */}
        <Box mt={16} textAlign="center">
          <VStack spacing={6}>
            <Heading as="h2" size="lg">
              Ready to Move? Get Your Free Quote Today
            </Heading>
            <Text fontSize="lg" color="gray.600" maxW="2xl">
              Join thousands of satisfied customers who trust Speedy Van for their moving needs. 
              Get an instant quote and book your service online in minutes.
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
                Get Instant Quote
              </Box>
              <Box
                as={Link}
                href="/contact"
                bg="white"
                color="blue.600"
                px={8}
                py={4}
                borderRadius="lg"
                fontWeight="bold"
                border="2px solid"
                borderColor="blue.600"
                _hover={{ bg: "blue.50" }}
                transition="all 0.2s"
              >
                Contact Us
              </Box>
            </HStack>
          </VStack>
        </Box>

        {/* Services Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebPage",
              "name": "Professional Moving Services",
              "description": "Complete range of professional moving services across the UK",
              "url": "https://speedy-van.co.uk/services",
              "mainEntity": {
                "@type": "ItemList",
                "itemListElement": coreServices.map((service, index) => ({
                  "@type": "ListItem",
                  "position": index + 1,
                  "item": {
                    "@type": "Service",
                    "name": service.title,
                    "description": service.description,
                    "url": `https://speedy-van.co.uk${service.href}`,
                    "provider": {
                      "@type": "Organization",
                      "@id": "https://speedy-van.co.uk/#organization"
                    }
                  }
                }))
              }
            }, null, 2)
          }}
        />
      </Container>
    </>
  );
}

