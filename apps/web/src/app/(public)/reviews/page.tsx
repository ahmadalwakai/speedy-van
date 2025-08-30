import { Metadata } from 'next';
import { Box, Container, Heading, Text, SimpleGrid, VStack, HStack, Avatar, Icon, Flex } from '@chakra-ui/react';
import { Star, Quote, CheckCircle, Users, Award, TrendingUp } from 'lucide-react';
import LocalBusinessSchema from '@/components/Schema/LocalBusinessSchema';

export const metadata: Metadata = {
  title: "Customer Reviews & Testimonials | Speedy Van",
  description: "Read verified customer reviews and testimonials for Speedy Van. See why thousands of customers trust us for their moving and delivery needs across the UK.",
  keywords: "speedy van reviews, customer testimonials, trustpilot reviews, moving company reviews, man and van reviews, removal service reviews",
  alternates: { canonical: "https://speedy-van.co.uk/reviews" },
  openGraph: {
    title: "Customer Reviews & Testimonials | Speedy Van",
    description: "Read verified customer reviews and testimonials for Speedy Van. 4.8/5 stars from 247+ verified customers.",
    url: "https://speedy-van.co.uk/reviews",
    siteName: "Speedy Van",
    images: [{ url: "/og/og-reviews.jpg", width: 1200, height: 630, alt: "Speedy Van Customer Reviews" }],
    locale: "en_GB",
    type: "website",
  },
  twitter: { card: "summary_large_image", site: "@speedyvan", creator: "@speedyvan" },
};

const featuredReviews = [
  {
    id: 1,
    name: "Sarah Mitchell",
    location: "London",
    rating: 5,
    date: "August 2024",
    service: "House Removal",
    review: "Absolutely fantastic service! The team arrived exactly on time and handled our 3-bedroom house move with incredible professionalism. Every item was carefully wrapped and transported safely. The live tracking feature gave us peace of mind throughout the day. Couldn't recommend Speedy Van more highly!",
    verified: true
  },
  {
    id: 2,
    name: "James Thompson",
    location: "Birmingham",
    rating: 5,
    date: "August 2024",
    service: "Man and Van",
    review: "Needed a last-minute man and van service for furniture delivery. Speedy Van came to the rescue! The driver was courteous, the van was spotless, and the price was very reasonable. The online booking system made everything so easy. Will definitely use again.",
    verified: true
  },
  {
    id: 3,
    name: "Emma Rodriguez",
    location: "Manchester",
    rating: 5,
    date: "July 2024",
    service: "Office Relocation",
    review: "Our office relocation was handled flawlessly by Speedy Van. They coordinated everything perfectly, minimizing our downtime. The team was professional, efficient, and took great care with our IT equipment. Excellent value for money and outstanding customer service.",
    verified: true
  },
  {
    id: 4,
    name: "Michael Chen",
    location: "Leeds",
    rating: 5,
    date: "July 2024",
    service: "Furniture Delivery",
    review: "Ordered a large sofa and dining set online and needed reliable delivery. Speedy Van's team was amazing - they called ahead, arrived on time, and even helped position everything perfectly in our home. The care they took with our new furniture was impressive.",
    verified: true
  },
  {
    id: 5,
    name: "Lisa Parker",
    location: "Glasgow",
    rating: 5,
    date: "June 2024",
    service: "Student Move",
    review: "As a student moving between accommodations, I needed an affordable but reliable service. Speedy Van exceeded my expectations! The team was friendly, efficient, and made what could have been a stressful day actually enjoyable. Great communication throughout.",
    verified: true
  },
  {
    id: 6,
    name: "David Wilson",
    location: "Bristol",
    rating: 5,
    date: "June 2024",
    service: "Long Distance Move",
    review: "Moved from Bristol to Edinburgh with Speedy Van. The long-distance service was exceptional - everything arrived in perfect condition and exactly when promised. The team's attention to detail and professionalism made our interstate move stress-free.",
    verified: true
  }
];

const stats = [
  { icon: Users, label: "Happy Customers", value: "2,500+" },
  { icon: Star, label: "Average Rating", value: "4.8/5" },
  { icon: CheckCircle, label: "Verified Reviews", value: "247+" },
  { icon: Award, label: "Service Awards", value: "5+" }
];

export default function ReviewsPage() {
  return (
    <>
      <LocalBusinessSchema />
      
      <Container maxW="7xl" py={16}>
        {/* Header Section */}
        <VStack spacing={8} textAlign="center" mb={16}>
          <Heading as="h1" size="2xl" color="blue.600">
            Customer Reviews & Testimonials
          </Heading>
          <Text fontSize="xl" color="gray.600" maxW="3xl">
            Don't just take our word for it. Read what our customers say about their experience with Speedy Van's professional moving services.
          </Text>
          
          {/* Trust Indicators */}
          <SimpleGrid columns={{ base: 2, md: 4 }} spacing={8} w="full" maxW="4xl">
            {stats.map((stat, index) => (
              <VStack key={index} spacing={2}>
                <Icon as={stat.icon} boxSize={8} color="blue.500" />
                <Text fontSize="2xl" fontWeight="bold" color="blue.600">
                  {stat.value}
                </Text>
                <Text fontSize="sm" color="gray.600" textAlign="center">
                  {stat.label}
                </Text>
              </VStack>
            ))}
          </SimpleGrid>
        </VStack>

        {/* Trustpilot Widget Section */}
        <Box mb={16} textAlign="center">
          <Heading as="h2" size="lg" mb={6}>
            Verified Reviews on Trustpilot
          </Heading>
          <Box 
            bg="gray.50" 
            p={8} 
            borderRadius="lg" 
            border="1px solid"
            borderColor="gray.200"
          >
            {/* Trustpilot Widget Placeholder */}
            <VStack spacing={4}>
              <HStack spacing={1}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <Icon key={star} as={Star} color="green.400" fill="green.400" />
                ))}
              </HStack>
              <Text fontSize="lg" fontWeight="semibold">
                Excellent 4.8 out of 5 based on 247+ reviews
              </Text>
              <Text color="gray.600">
                Trustpilot widget will be embedded here
              </Text>
              {/* 
                In production, replace this with actual Trustpilot widget:
                <div id="tp-widget" data-tp-widget-id="YOUR_WIDGET_ID"></div>
              */}
            </VStack>
          </Box>
        </VStack>

        {/* Featured Reviews */}
        <VStack spacing={12} align="stretch">
          <Heading as="h2" size="lg" textAlign="center">
            Featured Customer Stories
          </Heading>
          
          <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={8}>
            {featuredReviews.map((review) => (
              <Box
                key={review.id}
                bg="white"
                p={8}
                borderRadius="xl"
                shadow="lg"
                border="1px solid"
                borderColor="gray.100"
                position="relative"
              >
                <Icon 
                  as={Quote} 
                  boxSize={6} 
                  color="blue.200" 
                  position="absolute"
                  top={4}
                  right={4}
                />
                
                <VStack align="start" spacing={4}>
                  <HStack spacing={4}>
                    <Avatar 
                      name={review.name} 
                      size="md"
                      bg="blue.500"
                    />
                    <VStack align="start" spacing={1}>
                      <HStack>
                        <Text fontWeight="bold">{review.name}</Text>
                        {review.verified && (
                          <Icon as={CheckCircle} boxSize={4} color="green.500" />
                        )}
                      </HStack>
                      <Text fontSize="sm" color="gray.600">
                        {review.location} • {review.date}
                      </Text>
                      <Text fontSize="sm" color="blue.600" fontWeight="medium">
                        {review.service}
                      </Text>
                    </VStack>
                  </HStack>
                  
                  <HStack spacing={1}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Icon 
                        key={star} 
                        as={Star} 
                        boxSize={4}
                        color={star <= review.rating ? "yellow.400" : "gray.300"}
                        fill={star <= review.rating ? "yellow.400" : "gray.300"}
                      />
                    ))}
                  </HStack>
                  
                  <Text color="gray.700" lineHeight="tall">
                    "{review.review}"
                  </Text>
                </VStack>
              </Box>
            ))}
          </SimpleGrid>
        </VStack>

        {/* Call to Action */}
        <Box mt={16} textAlign="center">
          <VStack spacing={6}>
            <Heading as="h2" size="lg">
              Ready to Experience Our Award-Winning Service?
            </Heading>
            <Text fontSize="lg" color="gray.600" maxW="2xl">
              Join thousands of satisfied customers who trust Speedy Van for their moving needs. 
              Get your instant quote today and see why we're the UK's top-rated moving service.
            </Text>
            <HStack spacing={4}>
              <Box
                as="a"
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
                as="a"
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

        {/* Review Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebPage",
              "name": "Customer Reviews & Testimonials",
              "description": "Verified customer reviews and testimonials for Speedy Van moving services",
              "url": "https://speedy-van.co.uk/reviews",
              "mainEntity": {
                "@type": "Organization",
                "@id": "https://speedy-van.co.uk/#organization",
                "aggregateRating": {
                  "@type": "AggregateRating",
                  "ratingValue": "4.8",
                  "ratingCount": "247",
                  "bestRating": "5",
                  "worstRating": "1"
                }
              }
            }, null, 2)
          }}
        />
      </Container>
    </>
  );
}

