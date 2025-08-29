import React from "react";
import { 
  Box, 
  Container, 
  Flex, 
  HStack, 
  Spacer, 
  Text, 
  Link as ChakraLink
} from "@chakra-ui/react";
import NextLink from "next/link";
import { requireRole } from "@/lib/auth";
import { redirect } from "next/navigation";
import SkipLink from "@/components/site/SkipLink";
import CustomerChatWidget from "@/components/Chat/CustomerChatWidget";
import MobileNav from "@/components/customer/MobileNav";
import UserMenu from "@/components/customer/UserMenu";

export default async function CustomerPortalLayout({ children }: { children: React.ReactNode }) {
  const session = await requireRole("customer");
  if (!session) {
    // Redirect to home page with auth modal trigger and returnTo parameter
    const returnTo = "/customer-portal";
    redirect(`/?returnTo=${encodeURIComponent(returnTo)}&showAuth=true`);
  }

  return (
    <>
      <SkipLink />
      <Box as="header" borderBottom="1px solid" borderColor="border.header" bg="bg.header" position="sticky" top={0} zIndex={10}>
        <Container maxW="1200px" py={2}>
          <Flex align="center" gap={4}>
            <HStack spacing={6}>
              <ChakraLink as={NextLink} href="/customer-portal" fontWeight="bold" fontSize="lg">
                Speedy Van
              </ChakraLink>
              
              {/* Desktop Navigation */}
              <HStack spacing={6} as="nav" aria-label="Main navigation" display={{ base: "none", lg: "flex" }}>
                <ChakraLink as={NextLink} href="/customer-portal" variant="nav">
                  Dashboard
                </ChakraLink>
                <ChakraLink as={NextLink} href="/customer-portal/orders" variant="nav">
                  My Orders
                </ChakraLink>
                <ChakraLink as={NextLink} href="/customer-portal/track" variant="nav">
                  Track
                </ChakraLink>
                <ChakraLink as={NextLink} href="/customer-portal/invoices" variant="nav">
                  Invoices & Payments
                </ChakraLink>
                <ChakraLink as={NextLink} href="/customer-portal/addresses" variant="nav">
                  Addresses & Contacts
                </ChakraLink>
                <ChakraLink as={NextLink} href="/customer-portal/settings" variant="nav">
                  Settings
                </ChakraLink>
                <ChakraLink as={NextLink} href="/customer-portal/support" variant="nav">
                  Support
                </ChakraLink>
              </HStack>
            </HStack>
            
            <Spacer />
            
            {/* Mobile Navigation */}
            <MobileNav session={session} />
            
            {/* Desktop User Menu */}
            <HStack spacing={4} display={{ base: "none", lg: "flex" }}>
              <UserMenu session={session} />
            </HStack>
          </Flex>
        </Container>
      </Box>
      <Container as="main" id="main" maxW="1200px" py={6}>
        {children}
      </Container>
      
      {/* Customer Chat Widget */}
      <CustomerChatWidget 
        customerId={session.user?.id}
        customerName={session.user?.name}
        customerEmail={session.user?.email}
      />
    </>
  );
}


