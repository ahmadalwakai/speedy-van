import { Metadata } from 'next';
import { Box, Container, Heading, Text, SimpleGrid, VStack, HStack, Icon, Badge } from '@chakra-ui/react';
import { Calendar, User, Clock, ArrowRight, MapPin, Pound, Home, Truck } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: "Moving Tips & Guides Blog | Expert Advice from Speedy Van",
  description: "Expert moving tips, guides, and advice from professional movers. Learn how to save money, avoid common mistakes, and make your move stress-free.",
  keywords: "moving tips, removal guides, moving advice, house removal tips, moving blog, professional moving advice, UK moving guides",
  alternates: { canonical: "https://speedy-van.co.uk/blog" },
  openGraph: {
    title: "Moving Tips & Guides Blog | Expert Advice from Speedy Van",
    description: "Expert moving tips, guides, and advice from professional movers. Learn how to save money and make your move stress-free.",
    url: "https://speedy-van.co.uk/blog",
    siteName: "Speedy Van",
    images: [{ url: "/og/og-blog.jpg", width: 1200, height: 630, alt: "Speedy Van Moving Blog" }],
    locale: "en_GB",
    type: "website",
  },
  twitter: { card: "summary_large_image", site: "@speedyvan", creator: "@speedyvan" },
};

const blogPosts = [
  {
    id: 'london-moving-tips-2024',
    title: 'Ultimate London Moving Guide 2024: Expert Tips & Cost Breakdown',
    excerpt: 'Complete guide to moving in London with expert tips, cost breakdown, borough guide, and insider secrets from professional movers.',
    category: 'Moving Guides',
    readTime: '15 min read',
    publishDate: 'December 2024',
    author: 'Speedy Van Team',
    icon: MapPin,
    featured: true,
    href: '/blog/london-moving-tips-2024'
  },
  {
    id: 'house-removal-costs-uk',
    title: 'House Removal Costs UK 2024: Complete Price Guide',
    excerpt: 'Detailed breakdown of house removal costs across the UK. Learn what factors affect pricing and how to get the best value for your move.',
    category: 'Cost Guides',
    readTime: '12 min read',
    publishDate: 'December 2024',
    author: 'Speedy Van Team',
    icon: Pound,
    featured: true,
    href: '/blog/house-removal-costs-uk-2024'
  },
  {
    id: 'moving-house-checklist',
    title: 'Complete Moving House Checklist: 8-Week Timeline',
    excerpt: 'Never forget anything again with our comprehensive moving house checklist. Organized by timeline with expert tips for each stage.',
    category: 'Checklists',
    readTime: '10 min read',
    publishDate: 'November 2024',
    author: 'Speedy Van Team',
    icon: Home,
    featured: false,
    href: '/blog/moving-house-checklist'
  },
  {
    id: 'man-and-van-vs-removal-company',
    title: 'Man and Van vs Removal Company: Which Should You Choose?',
    excerpt: 'Detailed comparison of man and van services versus full removal companies. Learn which option is best for your specific moving needs.',
    category: 'Service Guides',
    readTime: '8 min read',
    publishDate: 'November 2024',
    author: 'Speedy Van Team',
    icon: Truck,
    featured: false,
    href: '/blog/man-and-van-vs-removal-company'
  }
];

const categories = [
  { name: 'Moving Guides', count: 2, color: 'blue' },
  { name: 'Cost Guides', count: 1, color: 'green' },
  { name: 'Checklists', count: 1, color: 'purple' },
  { name: 'Service Guides', count: 1, color: 'orange' }
];

export default function BlogPage() {
  const featuredPosts = blogPosts.filter(post => post.featured);
  const regularPosts = blogPosts.filter(post => !post.featured);

  return (
    <>
      <Container maxW="7xl" py={16}>
        {/* Header Section */}
        <VStack spacing={8} textAlign="center" mb={16}>
          <Badge colorScheme="blue" variant="solid" borderRadius="full" px={4} py={2}>
            Expert Moving Advice
          </Badge>
          <Heading as="h1" size="2xl" color="blue.600">
            Moving Tips & Guides Blog
          </Heading>
          <Text fontSize="xl" color="gray.600" maxW="4xl">
            Expert advice from professional movers who have completed thousands of moves across the UK. 
            Learn insider tips, avoid common mistakes, and make your move as smooth as possible.
          </Text>
        </VStack>

        {/* Categories */}
        <VStack spacing={8} mb={16}>
          <Heading as="h2" size="lg" textAlign="center">
            Browse by Category
          </Heading>
          <HStack spacing={4} flexWrap="wrap" justify="center">
            {categories.map((category, index) => (
              <Badge
                key={index}
                colorScheme={category.color}
                variant="outline"
                px={4}
                py={2}
                borderRadius="full"
                fontSize="sm"
                cursor="pointer"
                _hover={{ bg: `${category.color}.50` }}
                transition="all 0.2s"
              >
                {category.name} ({category.count})
              </Badge>
            ))}
          </HStack>
        </VStack>

        {/* Featured Posts */}
        <VStack spacing={12} align="stretch" mb={16}>
          <Heading as="h2" size="lg" textAlign="center">
            Featured Articles
          </Heading>
          
          <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={8}>
            {featuredPosts.map((post) => (
              <Box
                key={post.id}
                as={Link}
                href={post.href}
                bg="white"
                borderRadius="xl"
                shadow="lg"
                overflow="hidden"
                transition="all 0.3s"
                _hover={{
                  transform: 'translateY(-4px)',
                  shadow: 'xl'
                }}
              >
                <Box bg="gradient-to-r from-blue-500 to-purple-600" h="200px" position="relative">
                  <VStack
                    position="absolute"
                    top="50%"
                    left="50%"
                    transform="translate(-50%, -50%)"
                    color="white"
                    textAlign="center"
                    spacing={4}
                  >
                    <Icon as={post.icon} boxSize={16} />
                    <Badge colorScheme="whiteAlpha" variant="solid">
                      {post.category}
                    </Badge>
                  </VStack>
                </Box>
                
                <VStack spacing={4} p={8} align="start">
                  <Heading as="h3" size="md" color="gray.800" lineHeight="shorter">
                    {post.title}
                  </Heading>
                  
                  <Text color="gray.600" lineHeight="tall">
                    {post.excerpt}
                  </Text>
                  
                  <HStack spacing={4} color="gray.500" fontSize="sm" w="full">
                    <HStack spacing={1}>
                      <Icon as={Calendar} boxSize={4} />
                      <Text>{post.publishDate}</Text>
                    </HStack>
                    <HStack spacing={1}>
                      <Icon as={Clock} boxSize={4} />
                      <Text>{post.readTime}</Text>
                    </HStack>
                  </HStack>
                  
                  <HStack spacing={2} color="blue.600" fontWeight="medium" mt={4}>
                    <Text>Read Article</Text>
                    <Icon as={ArrowRight} boxSize={4} />
                  </HStack>
                </VStack>
              </Box>
            ))}
          </SimpleGrid>
        </VStack>

        {/* Regular Posts */}
        <VStack spacing={12} align="stretch">
          <Heading as="h2" size="lg" textAlign="center">
            All Articles
          </Heading>
          
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={8}>
            {regularPosts.map((post) => (
              <Box
                key={post.id}
                as={Link}
                href={post.href}
                bg="white"
                p={6}
                borderRadius="lg"
                shadow="md"
                border="1px solid"
                borderColor="gray.200"
                transition="all 0.3s"
                _hover={{
                  transform: 'translateY(-2px)',
                  shadow: 'lg',
                  borderColor: 'blue.200'
                }}
              >
                <VStack spacing={4} align="start">
                  <HStack spacing={3}>
                    <Icon as={post.icon} boxSize={8} color="blue.500" />
                    <Badge colorScheme="blue" variant="outline">
                      {post.category}
                    </Badge>
                  </HStack>
                  
                  <Heading as="h3" size="sm" color="gray.800" lineHeight="shorter">
                    {post.title}
                  </Heading>
                  
                  <Text color="gray.600" fontSize="sm" lineHeight="tall">
                    {post.excerpt}
                  </Text>
                  
                  <HStack spacing={4} color="gray.500" fontSize="xs" w="full">
                    <HStack spacing={1}>
                      <Icon as={Clock} boxSize={3} />
                      <Text>{post.readTime}</Text>
                    </HStack>
                    <HStack spacing={1}>
                      <Icon as={User} boxSize={3} />
                      <Text>{post.author}</Text>
                    </HStack>
                  </HStack>
                  
                  <HStack spacing={2} color="blue.600" fontWeight="medium" fontSize="sm" mt={2}>
                    <Text>Read More</Text>
                    <Icon as={ArrowRight} boxSize={3} />
                  </HStack>
                </VStack>
              </Box>
            ))}
          </SimpleGrid>
        </VStack>

        {/* Newsletter Signup */}
        <Box mt={16} bg="blue.50" p={12} borderRadius="xl" textAlign="center">
          <VStack spacing={6}>
            <Heading as="h2" size="lg" color="blue.800">
              Get Moving Tips Delivered to Your Inbox
            </Heading>
            <Text color="gray.700" maxW="2xl">
              Subscribe to our newsletter for the latest moving tips, cost guides, and exclusive offers. 
              Join thousands of smart movers who save money with our expert advice.
            </Text>
            <HStack spacing={4} maxW="md">
              <Box
                as="input"
                type="email"
                placeholder="Enter your email address"
                bg="white"
                px={4}
                py={3}
                borderRadius="lg"
                border="1px solid"
                borderColor="gray.300"
                flex="1"
                _focus={{ borderColor: "blue.500", outline: "none" }}
              />
              <Box
                as="button"
                bg="blue.600"
                color="white"
                px={6}
                py={3}
                borderRadius="lg"
                fontWeight="bold"
                _hover={{ bg: "blue.700" }}
                transition="all 0.2s"
              >
                Subscribe
              </Box>
            </HStack>
          </VStack>
        </Box>

        {/* Blog Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Blog",
              "name": "Speedy Van Moving Blog",
              "description": "Expert moving tips, guides, and advice from professional movers",
              "url": "https://speedy-van.co.uk/blog",
              "publisher": {
                "@type": "Organization",
                "@id": "https://speedy-van.co.uk/#organization"
              },
              "blogPost": blogPosts.map(post => ({
                "@type": "BlogPosting",
                "headline": post.title,
                "description": post.excerpt,
                "url": `https://speedy-van.co.uk${post.href}`,
                "datePublished": "2024-12-01",
                "author": {
                  "@type": "Organization",
                  "name": post.author
                },
                "publisher": {
                  "@type": "Organization",
                  "@id": "https://speedy-van.co.uk/#organization"
                }
              }))
            }, null, 2)
          }}
        />
      </Container>
    </>
  );
}

