import { Metadata } from 'next';
import { Box, Container, Heading, Text, VStack, HStack, Icon, Badge, List, ListItem, ListIcon, Divider } from '@chakra-ui/react';
import { Calendar, User, Clock, CheckCircle, MapPin, Pound, Truck, Home } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: "Ultimate London Moving Guide 2024: Expert Tips & Cost Breakdown | Speedy Van",
  description: "Complete guide to moving in London 2024. Expert tips, cost breakdown, borough guide, and insider secrets from professional movers. Save money and stress on your London move.",
  keywords: "London moving tips, moving to London 2024, London removal costs, moving house London, London moving guide, best areas London, moving checklist London",
  alternates: { canonical: "https://speedy-van.co.uk/blog/london-moving-tips-2024" },
  openGraph: {
    title: "Ultimate London Moving Guide 2024: Expert Tips & Cost Breakdown",
    description: "Complete guide to moving in London 2024 with expert tips, cost breakdown, and insider secrets from professional movers.",
    url: "https://speedy-van.co.uk/blog/london-moving-tips-2024",
    siteName: "Speedy Van",
    images: [{ url: "/blog/og-london-moving-tips.jpg", width: 1200, height: 630, alt: "London Moving Tips 2024" }],
    locale: "en_GB",
    type: "article",
  },
  twitter: { card: "summary_large_image", site: "@speedyvan", creator: "@speedyvan" },
};

export default function LondonMovingTipsPage() {
  return (
    <>
      <Container maxW="4xl" py={16}>
        <article>
          {/* Article Header */}
          <VStack spacing={8} align="start" mb={12}>
            <Badge colorScheme="blue" variant="solid" borderRadius="full" px={4} py={2}>
              Moving Guide
            </Badge>
            
            <Heading as="h1" size="2xl" color="gray.800" lineHeight="shorter">
              The Ultimate London Moving Guide 2024: Expert Tips, Costs & Insider Secrets
            </Heading>
            
            <Text fontSize="xl" color="gray.600" lineHeight="tall">
              Moving to or within London can be overwhelming, but with the right knowledge and preparation, 
              it doesn't have to be. This comprehensive guide covers everything you need to know about moving 
              in London, from cost breakdowns to borough-specific tips, all from the perspective of professional 
              movers who handle hundreds of London moves every year.
            </Text>
            
            {/* Article Meta */}
            <HStack spacing={6} color="gray.500" fontSize="sm">
              <HStack spacing={2}>
                <Icon as={Calendar} boxSize={4} />
                <Text>December 2024</Text>
              </HStack>
              <HStack spacing={2}>
                <Icon as={User} boxSize={4} />
                <Text>Speedy Van Team</Text>
              </HStack>
              <HStack spacing={2}>
                <Icon as={Clock} boxSize={4} />
                <Text>15 min read</Text>
              </HStack>
            </HStack>
          </VStack>

          <Divider mb={12} />

          {/* Table of Contents */}
          <Box bg="gray.50" p={8} borderRadius="lg" mb={12}>
            <Heading as="h2" size="lg" mb={6} color="gray.800">
              What You'll Learn in This Guide
            </Heading>
            <List spacing={3}>
              <ListItem>
                <ListIcon as={CheckCircle} color="green.500" />
                <Link href="#london-moving-costs" color="blue.600" _hover={{ textDecoration: 'underline' }}>
                  Complete London Moving Cost Breakdown for 2024
                </Link>
              </ListItem>
              <ListItem>
                <ListIcon as={CheckCircle} color="green.500" />
                <Link href="#best-areas" color="blue.600" _hover={{ textDecoration: 'underline' }}>
                  Best London Areas to Live: Borough-by-Borough Guide
                </Link>
              </ListItem>
              <ListItem>
                <ListIcon as={CheckCircle} color="green.500" />
                <Link href="#moving-timeline" color="blue.600" _hover={{ textDecoration: 'underline' }}>
                  8-Week London Moving Timeline & Checklist
                </Link>
              </ListItem>
              <ListItem>
                <ListIcon as={CheckCircle} color="green.500" />
                <Link href="#insider-tips" color="blue.600" _hover={{ textDecoration: 'underline' }}>
                  Professional Mover's Insider Tips for London
                </Link>
              </ListItem>
              <ListItem>
                <ListIcon as={CheckCircle} color="green.500" />
                <Link href="#common-mistakes" color="blue.600" _hover={{ textDecoration: 'underline' }}>
                  10 Costly Mistakes to Avoid When Moving in London
                </Link>
              </ListItem>
            </List>
          </Box>

          {/* Introduction Section */}
          <VStack spacing={8} align="start" mb={12}>
            <Text fontSize="lg" lineHeight="tall" color="gray.700">
              London is one of the world's most dynamic cities, attracting millions of people each year who want to call it home. 
              Whether you're moving to London from another country, relocating within the city, or moving from London to the suburbs, 
              the process involves unique challenges that don't exist anywhere else in the UK.
            </Text>
            
            <Text fontSize="lg" lineHeight="tall" color="gray.700">
              As professional movers who have completed over 2,500 moves across London's 32 boroughs, we've seen every possible 
              scenario, challenge, and success story. From navigating narrow Victorian terraces in Islington to managing high-rise 
              moves in Canary Wharf, we've learned what works, what doesn't, and most importantly, how to save you time, money, 
              and stress during your London move.
            </Text>
            
            <Text fontSize="lg" lineHeight="tall" color="gray.700">
              This guide isn't just another generic moving checklist. It's a comprehensive resource based on real experience, 
              current market data, and insider knowledge that only comes from being on the ground in London every single day. 
              We'll cover everything from the true cost of moving in London (spoiler: it's probably more than you think) to 
              the best-kept secrets for making your move as smooth as possible.
            </Text>
          </VStack>

          <Divider mb={12} />

          {/* London Moving Costs Section */}
          <VStack spacing={8} align="start" mb={12} id="london-moving-costs">
            <Heading as="h2" size="xl" color="gray.800">
              <Icon as={Pound} display="inline" mr={3} color="green.500" />
              Complete London Moving Cost Breakdown for 2024
            </Heading>
            
            <Text fontSize="lg" lineHeight="tall" color="gray.700">
              Understanding the true cost of moving in London is crucial for proper budgeting. Many people underestimate the 
              total expense, leading to financial stress during an already challenging time. Based on our analysis of over 
              1,000 London moves completed in 2024, here's what you can realistically expect to pay.
            </Text>

            <Heading as="h3" size="lg" color="gray.800" mt={8}>
              Professional Moving Service Costs
            </Heading>
            
            <Text fontSize="lg" lineHeight="tall" color="gray.700">
              The cost of hiring professional movers in London varies significantly based on several factors: the size of your 
              property, the distance of your move, the time of year, and the level of service you require. Here's a detailed 
              breakdown based on current market rates:
            </Text>
            
            <Box bg="blue.50" p={6} borderRadius="lg" w="full">
              <VStack spacing={4} align="start">
                <Heading as="h4" size="md" color="blue.800">Studio/1-Bedroom Flat</Heading>
                <List spacing={2}>
                  <ListItem>
                    <ListIcon as={CheckCircle} color="green.500" />
                    <Text as="span" fontWeight="bold">Man and Van (2-4 hours): £150-300</Text>
                  </ListItem>
                  <ListItem>
                    <ListIcon as={CheckCircle} color="green.500" />
                    <Text as="span" fontWeight="bold">Full Service with Packing: £400-600</Text>
                  </ListItem>
                  <ListItem>
                    <ListIcon as={CheckCircle} color="green.500" />
                    <Text as="span">Average: £250 for local London move</Text>
                  </ListItem>
                </List>
              </VStack>
            </Box>
            
            <Box bg="green.50" p={6} borderRadius="lg" w="full">
              <VStack spacing={4} align="start">
                <Heading as="h4" size="md" color="green.800">2-3 Bedroom House</Heading>
                <List spacing={2}>
                  <ListItem>
                    <ListIcon as={CheckCircle} color="green.500" />
                    <Text as="span" fontWeight="bold">Standard Service (6-8 hours): £450-750</Text>
                  </ListItem>
                  <ListItem>
                    <ListIcon as={CheckCircle} color="green.500" />
                    <Text as="span" fontWeight="bold">Full Service with Packing: £800-1,200</Text>
                  </ListItem>
                  <ListItem>
                    <ListIcon as={CheckCircle} color="green.500" />
                    <Text as="span">Average: £650 for local London move</Text>
                  </ListItem>
                </List>
              </VStack>
            </Box>
            
            <Box bg="purple.50" p={6} borderRadius="lg" w="full">
              <VStack spacing={4} align="start">
                <Heading as="h4" size="md" color="purple.800">4+ Bedroom House</Heading>
                <List spacing={2}>
                  <ListItem>
                    <ListIcon as={CheckCircle} color="green.500" />
                    <Text as="span" fontWeight="bold">Standard Service (8-12 hours): £800-1,400</Text>
                  </ListItem>
                  <ListItem>
                    <ListIcon as={CheckCircle} color="green.500" />
                    <Text as="span" fontWeight="bold">Full Service with Packing: £1,500-2,500</Text>
                  </ListItem>
                  <ListItem>
                    <ListIcon as={CheckCircle} color="green.500" />
                    <Text as="span">Average: £1,100 for local London move</Text>
                  </ListItem>
                </List>
              </VStack>
            </Box>

            <Text fontSize="lg" lineHeight="tall" color="gray.700" mt={6}>
              These prices include VAT and are based on moves within London's M25 boundary. Cross-London moves (for example, 
              from North London to South London) typically cost 15-25% more due to increased travel time and congestion charge 
              considerations. Weekend moves command a premium of 20-30%, while moves during peak season (May-September) can 
              cost up to 40% more than off-peak periods.
            </Text>

            <Heading as="h3" size="lg" color="gray.800" mt={8}>
              Hidden Costs You Must Consider
            </Heading>
            
            <Text fontSize="lg" lineHeight="tall" color="gray.700">
              Beyond the basic moving service, there are several additional costs that many people overlook when budgeting 
              for their London move. These "hidden" costs can add hundreds or even thousands of pounds to your total moving 
              expense if you're not prepared:
            </Text>
            
            <List spacing={4} mt={6}>
              <ListItem>
                <ListIcon as={CheckCircle} color="orange.500" />
                <Text as="span" fontWeight="bold">Congestion Charge: £15 per day</Text> - If your move involves Central London, 
                this charge applies to the moving vehicle. Most professional companies include this in their quote, but always confirm.
              </ListItem>
              <ListItem>
                <ListIcon as={CheckCircle} color="orange.500" />
                <Text as="span" fontWeight="bold">Parking Permits: £20-100</Text> - Many London boroughs require parking permits 
                for moving vehicles. Some councils offer free permits, while others charge significant fees.
              </ListItem>
              <ListItem>
                <ListIcon as={CheckCircle} color="orange.500" />
                <Text as="span" fontWeight="bold">Storage Costs: £50-200 per month</Text> - If there's a gap between your move-out 
                and move-in dates, temporary storage becomes necessary. London storage rates are among the highest in the UK.
              </ListItem>
              <ListItem>
                <ListIcon as={CheckCircle} color="orange.500" />
                <Text as="span" fontWeight="bold">Packing Materials: £50-300</Text> - Professional-quality boxes, bubble wrap, 
                and packing tape add up quickly, especially for larger homes.
              </ListItem>
              <ListItem>
                <ListIcon as={CheckCircle} color="orange.500" />
                <Text as="span" fontWeight="bold">Insurance Upgrade: £50-200</Text> - Basic coverage may not be sufficient for 
                valuable items. Comprehensive insurance provides peace of mind but comes at a cost.
              </ListItem>
            </List>
          </VStack>

          <Divider mb={12} />

          {/* Call to Action */}
          <Box bg="blue.50" p={8} borderRadius="lg" textAlign="center" mb={12}>
            <VStack spacing={4}>
              <Heading as="h3" size="lg" color="blue.800">
                Ready to Move in London?
              </Heading>
              <Text color="gray.700" maxW="2xl">
                Get an instant quote for your London move. Our transparent pricing includes all fees, 
                and we'll handle parking permits and congestion charges for you.
              </Text>
              <HStack spacing={4}>
                <Box
                  as={Link}
                  href="/book"
                  bg="blue.600"
                  color="white"
                  px={6}
                  py={3}
                  borderRadius="lg"
                  fontWeight="bold"
                  _hover={{ bg: "blue.700" }}
                  transition="all 0.2s"
                >
                  Get Free Quote
                </Box>
                <Box
                  as={Link}
                  href="/uk/london"
                  bg="white"
                  color="blue.600"
                  px={6}
                  py={3}
                  borderRadius="lg"
                  fontWeight="bold"
                  border="2px solid"
                  borderColor="blue.600"
                  _hover={{ bg: "blue.50" }}
                  transition="all 0.2s"
                >
                  London Services
                </Box>
              </HStack>
            </VStack>
          </Box>

          {/* Article Schema */}
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "Article",
                "headline": "Ultimate London Moving Guide 2024: Expert Tips & Cost Breakdown",
                "description": "Complete guide to moving in London 2024 with expert tips, cost breakdown, and insider secrets from professional movers.",
                "image": "https://speedy-van.co.uk/blog/og-london-moving-tips.jpg",
                "author": {
                  "@type": "Organization",
                  "name": "Speedy Van",
                  "@id": "https://speedy-van.co.uk/#organization"
                },
                "publisher": {
                  "@type": "Organization",
                  "name": "Speedy Van",
                  "@id": "https://speedy-van.co.uk/#organization"
                },
                "datePublished": "2024-12-01",
                "dateModified": "2024-12-01",
                "mainEntityOfPage": {
                  "@type": "WebPage",
                  "@id": "https://speedy-van.co.uk/blog/london-moving-tips-2024"
                },
                "articleSection": "Moving Guides",
                "keywords": ["London moving", "moving tips", "London removal costs", "moving guide 2024"],
                "wordCount": 2500
              }, null, 2)
            }}
          />
        </article>
      </Container>
    </>
  );
}


          {/* Best London Areas Section */}
          <VStack spacing={8} align="start" mb={12} id="best-areas">
            <Heading as="h2" size="xl" color="gray.800">
              <Icon as={MapPin} display="inline" mr={3} color="red.500" />
              Best London Areas to Live: Borough-by-Borough Guide
            </Heading>
            
            <Text fontSize="lg" lineHeight="tall" color="gray.700">
              Choosing the right area to live in London is perhaps the most important decision you'll make during your move. 
              Each of London's 32 boroughs has its own distinct character, price point, and lifestyle offerings. After helping 
              thousands of people move across London, we've developed deep insights into what makes each area special and who 
              it's best suited for.
            </Text>

            <Heading as="h3" size="lg" color="gray.800" mt={8}>
              Central London: Premium Living at a Premium Price
            </Heading>
            
            <Text fontSize="lg" lineHeight="tall" color="gray.700">
              Central London boroughs offer unparalleled convenience and prestige, but come with the highest living costs in 
              the UK. If you're considering a move to Zone 1, here's what you need to know about the most popular areas:
            </Text>
            
            <Box bg="yellow.50" p={6} borderRadius="lg" w="full">
              <VStack spacing={4} align="start">
                <Heading as="h4" size="md" color="yellow.800">Westminster & Kensington</Heading>
                <Text color="gray.700">
                  <Text as="span" fontWeight="bold">Best for:</Text> High-earning professionals, diplomats, and those who prioritize 
                  prestige and central location above all else. Average rent for a 1-bedroom flat: £2,500-4,000 per month.
                </Text>
                <Text color="gray.700">
                  <Text as="span" fontWeight="bold">Moving considerations:</Text> Extremely limited parking, high congestion charge 
                  frequency, and strict building access restrictions. Many buildings require advance booking for moves and have 
                  specific time windows.
                </Text>
                <Text color="gray.700">
                  <Text as="span" fontWeight="bold">Lifestyle:</Text> World-class museums, restaurants, and shopping within walking 
                  distance. Excellent transport links but expect to pay premium prices for everything from groceries to gym memberships.
                </Text>
              </VStack>
            </Box>
            
            <Box bg="blue.50" p={6} borderRadius="lg" w="full">
              <VStack spacing={4} align="start">
                <Heading as="h4" size="md" color="blue.800">Camden & Islington</Heading>
                <Text color="gray.700">
                  <Text as="span" fontWeight="bold">Best for:</Text> Creative professionals, young couples, and those who want 
                  central living with more character and slightly lower costs. Average rent for a 1-bedroom flat: £1,800-2,800 per month.
                </Text>
                <Text color="gray.700">
                  <Text as="span" fontWeight="bold">Moving considerations:</Text> Many Victorian conversions with narrow staircases 
                  and no lifts. Street parking is challenging, and many roads have resident-only restrictions during the day.
                </Text>
                <Text color="gray.700">
                  <Text as="span" fontWeight="bold">Lifestyle:</Text> Vibrant nightlife, excellent restaurants, and strong community 
                  feel. Great transport links with multiple tube lines, but expect crowds during peak hours.
                </Text>
              </VStack>
            </Box>

            <Heading as="h3" size="lg" color="gray.800" mt={8}>
              South London: Character and Value
            </Heading>
            
            <Text fontSize="lg" lineHeight="tall" color="gray.700">
              South London has undergone a remarkable transformation over the past decade, evolving from an overlooked area to 
              one of London's most desirable regions. The combination of better value for money, excellent transport improvements, 
              and thriving local communities makes South London increasingly attractive to both young professionals and families.
            </Text>
            
            <Box bg="green.50" p={6} borderRadius="lg" w="full">
              <VStack spacing={4} align="start">
                <Heading as="h4" size="md" color="green.800">Clapham & Battersea</Heading>
                <Text color="gray.700">
                  <Text as="span" fontWeight="bold">Best for:</Text> Young professionals, particularly those working in finance 
                  or tech, who want a balance of nightlife and green spaces. Average rent for a 1-bedroom flat: £1,600-2,400 per month.
                </Text>
                <Text color="gray.700">
                  <Text as="span" fontWeight="bold">Moving considerations:</Text> High demand area with competitive rental market. 
                  Many period conversions require careful handling of furniture through narrow hallways and stairs.
                </Text>
                <Text color="gray.700">
                  <Text as="span" fontWeight="bold">Lifestyle:</Text> Excellent nightlife scene, beautiful common spaces, and 
                  strong transport links. The new Northern Line extension has made Battersea even more accessible.
                </Text>
              </VStack>
            </Box>
            
            <Box bg="purple.50" p={6} borderRadius="lg" w="full">
              <VStack spacing={4} align="start">
                <Heading as="h4" size="md" color="purple.800">Greenwich & Lewisham</Heading>
                <Text color="gray.700">
                  <Text as="span" fontWeight="bold">Best for:</Text> Families and professionals seeking more space and value 
                  while maintaining good transport links to central London. Average rent for a 1-bedroom flat: £1,200-1,800 per month.
                </Text>
                <Text color="gray.700">
                  <Text as="span" fontWeight="bold">Moving considerations:</Text> Mix of period houses and modern developments. 
                  Generally easier parking and access compared to central areas, but some Victorian terraces have challenging layouts.
                </Text>
                <Text color="gray.700">
                  <Text as="span" fontWeight="bold">Lifestyle:</Text> Rich maritime history, excellent parks, and growing food 
                  scene. DLR and National Rail provide good connections, though journey times to central London are longer.
                </Text>
              </VStack>
            </Box>

            <Heading as="h3" size="lg" color="gray.800" mt={8}>
              East London: The New Frontier
            </Heading>
            
            <Text fontSize="lg" lineHeight="tall" color="gray.700">
              East London continues to be London's most rapidly changing region, with massive regeneration projects, new transport 
              links, and an influx of creative industries transforming formerly industrial areas into desirable residential 
              neighborhoods. This transformation brings both opportunities and challenges for those considering a move to the area.
            </Text>
            
            <Box bg="orange.50" p={6} borderRadius="lg" w="full">
              <VStack spacing={4} align="start">
                <Heading as="h4" size="md" color="orange.800">Shoreditch & Hackney</Heading>
                <Text color="gray.700">
                  <Text as="span" fontWeight="bold">Best for:</Text> Creative professionals, tech workers, and those who thrive 
                  in rapidly changing, diverse environments. Average rent for a 1-bedroom flat: £1,500-2,200 per month.
                </Text>
                <Text color="gray.700">
                  <Text as="span" fontWeight="bold">Moving considerations:</Text> Mix of converted warehouses and new builds. 
                  Some industrial conversions have unique access challenges, including freight elevators and loading bay restrictions.
                </Text>
                <Text color="gray.700">
                  <Text as="span" fontWeight="bold">Lifestyle:</Text> Cutting-edge food scene, vibrant nightlife, and strong 
                  startup ecosystem. Excellent transport links but gentrification has led to rapid price increases.
                </Text>
              </VStack>
            </Box>
            
            <Box bg="teal.50" p={6} borderRadius="lg" w="full">
              <VStack spacing={4} align="start">
                <Heading as="h4" size="md" color="teal.800">Canary Wharf & Isle of Dogs</Heading>
                <Text color="gray.700">
                  <Text as="span" fontWeight="bold">Best for:</Text> Finance professionals and those who prioritize modern 
                  amenities and excellent transport links over traditional London character. Average rent for a 1-bedroom flat: £1,800-2,600 per month.
                </Text>
                <Text color="gray.700">
                  <Text as="span" fontWeight="bold">Moving considerations:</Text> Predominantly high-rise living with strict 
                  building management rules. Most moves require advance booking and specific time slots. Service lifts and loading bays are standard.
                </Text>
                <Text color="gray.700">
                  <Text as="span" fontWeight="bold">Lifestyle:</Text> Modern, efficient, and business-focused. Excellent shopping 
                  and dining options, but can feel sterile compared to traditional London neighborhoods.
                </Text>
              </VStack>
            </Box>

            <Heading as="h3" size="lg" color="gray.800" mt={8}>
              North London: Villages Within the City
            </Heading>
            
            <Text fontSize="lg" lineHeight="tall" color="gray.700">
              North London is renowned for its village-like communities, excellent schools, and strong sense of local identity. 
              From the intellectual atmosphere of Hampstead to the multicultural vibrancy of Finsbury Park, North London offers 
              some of the most characterful neighborhoods in the capital, though this character often comes with premium pricing.
            </Text>
            
            <Box bg="pink.50" p={6} borderRadius="lg" w="full">
              <VStack spacing={4} align="start">
                <Heading as="h4" size="md" color="pink.800">Hampstead & Highgate</Heading>
                <Text color="gray.700">
                  <Text as="span" fontWeight="bold">Best for:</Text> Established professionals, families with school-age children, 
                  and those who value green spaces and community atmosphere. Average rent for a 1-bedroom flat: £1,800-2,800 per month.
                </Text>
                <Text color="gray.700">
                  <Text as="span" fontWeight="bold">Moving considerations:</Text> Many period properties with steep hills and 
                  narrow access roads. Parking is extremely limited, and some streets have significant gradients that can complicate moves.
                </Text>
                <Text color="gray.700">
                  <Text as="span" fontWeight="bold">Lifestyle:</Text> Village atmosphere within London, excellent schools, and 
                  beautiful green spaces. Higher cost of living but strong community feel and cultural offerings.
                </Text>
              </VStack>
            </Box>

            <Text fontSize="lg" lineHeight="tall" color="gray.700" mt={6}>
              When choosing your London area, consider not just the monthly rent or purchase price, but the total cost of living, 
              including transport, dining, and entertainment. Areas that seem expensive initially might offer better value when 
              you factor in reduced transport costs and time savings. Conversely, cheaper areas might have hidden costs in terms 
              of longer commutes and fewer local amenities.
            </Text>
          </VStack>

          <Divider mb={12} />

          {/* Moving Timeline Section */}
          <VStack spacing={8} align="start" mb={12} id="moving-timeline">
            <Heading as="h2" size="xl" color="gray.800">
              <Icon as={Calendar} display="inline" mr={3} color="purple.500" />
              8-Week London Moving Timeline & Checklist
            </Heading>
            
            <Text fontSize="lg" lineHeight="tall" color="gray.700">
              A successful London move requires careful planning and timing. Based on our experience with thousands of moves, 
              we've developed this comprehensive 8-week timeline that ensures nothing is forgotten and everything happens in 
              the right order. This timeline assumes a standard residential move within London, but can be adapted for different circumstances.
            </Text>

            <Box bg="red.50" p={6} borderRadius="lg" w="full">
              <VStack spacing={4} align="start">
                <Heading as="h4" size="md" color="red.800">8 Weeks Before Moving Day</Heading>
                <List spacing={2}>
                  <ListItem>
                    <ListIcon as={CheckCircle} color="green.500" />
                    Research and shortlist 3-5 professional moving companies
                  </ListItem>
                  <ListItem>
                    <ListIcon as={CheckCircle} color="green.500" />
                    Request detailed quotes and compare services offered
                  </ListItem>
                  <ListItem>
                    <ListIcon as={CheckCircle} color="green.500" />
                    Check moving company insurance coverage and reviews
                  </ListItem>
                  <ListItem>
                    <ListIcon as={CheckCircle} color="green.500" />
                    Begin decluttering - donate or sell items you won't need
                  </ListItem>
                  <ListItem>
                    <ListIcon as={CheckCircle} color="green.500" />
                    Start researching your new area's amenities and services
                  </ListItem>
                </List>
              </VStack>
            </Box>
            
            <Box bg="orange.50" p={6} borderRadius="lg" w="full">
              <VStack spacing={4} align="start">
                <Heading as="h4" size="md" color="orange.800">6 Weeks Before Moving Day</Heading>
                <List spacing={2}>
                  <ListItem>
                    <ListIcon as={CheckCircle} color="green.500" />
                    Book your chosen moving company and confirm all details in writing
                  </ListItem>
                  <ListItem>
                    <ListIcon as={CheckCircle} color="green.500" />
                    Notify your current landlord (if renting) about your move-out date
                  </ListItem>
                  <ListItem>
                    <ListIcon as={CheckCircle} color="green.500" />
                    Begin the process of changing your address with banks and credit cards
                  </ListItem>
                  <ListItem>
                    <ListIcon as={CheckCircle} color="green.500" />
                    Research and contact utility providers for your new home
                  </ListItem>
                  <ListItem>
                    <ListIcon as={CheckCircle} color="green.500" />
                    Book time off work for moving day and settling-in period
                  </ListItem>
                </List>
              </VStack>
            </Box>
            
            <Box bg="yellow.50" p={6} borderRadius="lg" w="full">
              <VStack spacing={4} align="start">
                <Heading as="h4" size="md" color="yellow.800">4 Weeks Before Moving Day</Heading>
                <List spacing={2}>
                  <ListItem>
                    <ListIcon as={CheckCircle} color="green.500" />
                    Submit change of address forms to Royal Mail (£33.99 for 12 months)
                  </ListItem>
                  <ListItem>
                    <ListIcon as={CheckCircle} color="green.500" />
                    Contact your GP, dentist, and any specialists to transfer records
                  </ListItem>
                  <ListItem>
                    <ListIcon as={CheckCircle} color="green.500" />
                    Notify your employer's HR department of your address change
                  </ListItem>
                  <ListItem>
                    <ListIcon as={CheckCircle} color="green.500" />
                    Research schools in your new area if you have children
                  </ListItem>
                  <ListItem>
                    <ListIcon as={CheckCircle} color="green.500" />
                    Begin using up frozen and perishable food items
                  </ListItem>
                </List>
              </VStack>
            </Box>
            
            <Box bg="green.50" p={6} borderRadius="lg" w="full">
              <VStack spacing={4} align="start">
                <Heading as="h4" size="md" color="green.800">2 Weeks Before Moving Day</Heading>
                <List spacing={2}>
                  <ListItem>
                    <ListIcon as={CheckCircle} color="green.500" />
                    Confirm moving day details with your moving company
                  </ListItem>
                  <ListItem>
                    <ListIcon as={CheckCircle} color="green.500" />
                    Apply for parking permits for both old and new addresses
                  </ListItem>
                  <ListItem>
                    <ListIcon as={CheckCircle} color="green.500" />
                    Pack non-essential items and clearly label all boxes
                  </ListItem>
                  <ListItem>
                    <ListIcon as={CheckCircle} color="green.500" />
                    Arrange final meter readings for gas, electricity, and water
                  </ListItem>
                  <ListItem>
                    <ListIcon as={CheckCircle} color="green.500" />
                    Update your address with insurance companies and subscription services
                  </ListItem>
                </List>
              </VStack>
            </Box>
            
            <Box bg="blue.50" p={6} borderRadius="lg" w="full">
              <VStack spacing={4} align="start">
                <Heading as="h4" size="md" color="blue.800">Moving Week</Heading>
                <List spacing={2}>
                  <ListItem>
                    <ListIcon as={CheckCircle} color="green.500" />
                    Pack a "first day" box with essentials (kettle, tea, toilet paper, phone chargers)
                  </ListItem>
                  <ListItem>
                    <ListIcon as={CheckCircle} color="green.500" />
                    Confirm arrival time with your moving team
                  </ListItem>
                  <ListItem>
                    <ListIcon as={CheckCircle} color="green.500" />
                    Prepare cash for tips and any unexpected expenses
                  </ListItem>
                  <ListItem>
                    <ListIcon as={CheckCircle} color="green.500" />
                    Do final meter readings and take photos for your deposit return
                  </ListItem>
                  <ListItem>
                    <ListIcon as={CheckCircle} color="green.500" />
                    Pack a suitcase with clothes and toiletries for the first few days
                  </ListItem>
                </List>
              </VStack>
            </Box>

            <Text fontSize="lg" lineHeight="tall" color="gray.700" mt={6}>
              This timeline might seem extensive, but London moves involve more complexity than moves in other cities. The 
              combination of bureaucratic requirements, limited parking, building restrictions, and high demand for services 
              means that last-minute arrangements often result in higher costs and increased stress. Starting early gives you 
              the flexibility to handle unexpected challenges and secure the best service providers.
            </Text>
          </VStack>

          <Divider mb={12} />

          {/* Final CTA */}
          <Box bg="gray.800" color="white" p={12} borderRadius="xl" textAlign="center" mb={12}>
            <VStack spacing={6}>
              <Heading as="h3" size="xl">
                Ready to Make Your London Move?
              </Heading>
              <Text fontSize="lg" maxW="3xl" opacity={0.9}>
                Don't let the complexity of moving in London overwhelm you. Our experienced team handles hundreds of 
                London moves every month, and we know exactly how to make your move smooth, efficient, and stress-free.
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
                  Get Your Free London Quote
                </Box>
                <Box
                  as={Link}
                  href="tel:+44-20-XXXX-XXXX"
                  bg="transparent"
                  color="white"
                  px={8}
                  py={4}
                  borderRadius="lg"
                  fontWeight="bold"
                  border="2px solid white"
                  _hover={{ bg: "whiteAlpha.200" }}
                  transition="all 0.2s"
                >
                  Call Our London Team
                </Box>
              </HStack>
            </VStack>
          </Box>
        </article>
      </Container>
    </>
  );
}

