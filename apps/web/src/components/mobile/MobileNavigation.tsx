'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import {
  Box,
  Flex,
  HStack,
  VStack,
  IconButton,
  Button,
  Text,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
  Badge,
  Divider,
  Link as ChakraLink,
  useBreakpointValue,
} from '@chakra-ui/react';
import {
  FaBars,
  FaTimes,
  FaHome,
  FaBoxes,
  FaUser,
  FaTruck,
  FaCog,
  FaPhone,
  FaQuestionCircle,
  FaSignOutAlt,
  FaChevronRight,
} from 'react-icons/fa';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

// Navigation items configuration
const navigationItems = [
  {
    label: 'Home',
    href: '/',
    icon: FaHome,
    description: 'Back to homepage',
  },
  {
    label: 'Book a Move',
    href: '/booking',
    icon: FaBoxes,
    description: 'Start your booking',
    highlight: true,
  },
  {
    label: 'My Bookings',
    href: '/customer-portal',
    icon: FaUser,
    description: 'View your bookings',
    badge: '2', // Example badge
  },
  {
    label: 'Driver Portal',
    href: '/driver-portal',
    icon: FaTruck,
    description: 'For drivers only',
    restricted: true,
  },
  {
    label: 'Admin',
    href: '/admin',
    icon: FaCog,
    description: 'Admin dashboard',
    restricted: true,
  },
];

const supportItems = [
  {
    label: 'Contact Us',
    href: '/contact',
    icon: FaPhone,
    description: 'Get in touch',
  },
  {
    label: 'Help & FAQ',
    href: '/help',
    icon: FaQuestionCircle,
    description: 'Find answers',
  },
];

// Mobile header component
const MobileHeader: React.FC<{
  onMenuOpen: () => void;
  title?: string;
}> = ({ onMenuOpen, title }) => {
  const pathname = usePathname();
  
  // Get page title based on current route
  const getPageTitle = () => {
    if (title) return title;
    
    const item = navigationItems.find(item => item.href === pathname);
    return item?.label || 'Speedy Van';
  };

  return (
    <Box
      position="sticky"
      top="0"
      zIndex="sticky"
      bg="bg.card"
      borderBottomWidth="1px"
      borderColor="border.primary"
      className="safe-area-top"
    >
      <Flex
        align="center"
        justify="space-between"
        px={4}
        py={3}
        minH="56px"
      >
        {/* Menu button */}
        <IconButton
          aria-label="Open menu"
          icon={<FaBars />}
          variant="ghost"
          size="md"
          onClick={onMenuOpen}
          color="text.primary"
        />

        {/* Page title */}
        <Text
          fontSize="lg"
          fontWeight="bold"
          color="text.primary"
          textAlign="center"
          flex={1}
          mx={4}
          noOfLines={1}
        >
          {getPageTitle()}
        </Text>

        {/* Right side actions (could be notifications, profile, etc.) */}
        <Box w="44px" /> {/* Spacer to center title */}
      </Flex>
    </Box>
  );
};

// Off-canvas menu component
const OffCanvasMenu: React.FC<{
  isOpen: boolean;
  onClose: () => void;
}> = ({ isOpen, onClose }) => {
  const router = useRouter();
  const pathname = usePathname();

  const handleNavigation = (href: string) => {
    router.push(href);
    onClose();
  };

  return (
    <Drawer isOpen={isOpen} placement="left" onClose={onClose} size="sm">
      <DrawerOverlay bg="rgba(0, 0, 0, 0.8)" />
      <DrawerContent bg="bg.card" maxW="320px">
        <DrawerCloseButton
          size="lg"
          color="text.primary"
          _hover={{ bg: 'bg.surface' }}
        />
        
        <DrawerHeader
          borderBottomWidth="1px"
          borderColor="border.primary"
          pb={4}
        >
          <VStack align="start" spacing={2}>
            <Text fontSize="xl" fontWeight="bold" color="neon.500">
              🚚 Speedy Van
            </Text>
            <Text fontSize="sm" color="text.secondary">
              Professional moving services
            </Text>
          </VStack>
        </DrawerHeader>

        <DrawerBody p={0}>
          <VStack spacing={0} align="stretch">
            {/* Main navigation */}
            <Box p={4}>
              <Text
                fontSize="xs"
                fontWeight="bold"
                color="text.tertiary"
                textTransform="uppercase"
                letterSpacing="wider"
                mb={3}
              >
                Navigation
              </Text>
              
              <VStack spacing={1} align="stretch">
                {navigationItems.map((item) => {
                  const isActive = pathname === item.href;
                  const IconComponent = item.icon;

                  return (
                    <motion.div
                      key={item.href}
                      whileHover={{ x: 4 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button
                        variant="ghost"
                        justifyContent="flex-start"
                        h="auto"
                        p={3}
                        borderRadius="lg"
                        bg={isActive ? 'neon.500' : 'transparent'}
                        color={isActive ? 'white' : 'text.primary'}
                        _hover={{
                          bg: isActive ? 'neon.600' : 'bg.surface',
                          transform: 'translateX(4px)',
                        }}
                        onClick={() => handleNavigation(item.href)}
                        leftIcon={
                          <Box position="relative">
                            <IconComponent size={18} />
                            {item.badge && (
                              <Badge
                                position="absolute"
                                top="-8px"
                                right="-8px"
                                colorScheme="red"
                                borderRadius="full"
                                fontSize="xs"
                                minW="16px"
                                h="16px"
                                display="flex"
                                alignItems="center"
                                justifyContent="center"
                              >
                                {item.badge}
                              </Badge>
                            )}
                          </Box>
                        }
                        rightIcon={
                          item.highlight ? (
                            <Badge colorScheme="neon" size="sm">
                              New
                            </Badge>
                          ) : item.restricted ? (
                            <Badge colorScheme="orange" size="sm">
                              Admin
                            </Badge>
                          ) : (
                            <FaChevronRight size={12} opacity={0.5} />
                          )
                        }
                      >
                        <VStack align="start" spacing={0} flex={1}>
                          <Text fontWeight="medium" fontSize="md">
                            {item.label}
                          </Text>
                          <Text
                            fontSize="xs"
                            color={isActive ? 'whiteAlpha.800' : 'text.tertiary'}
                            noOfLines={1}
                          >
                            {item.description}
                          </Text>
                        </VStack>
                      </Button>
                    </motion.div>
                  );
                })}
              </VStack>
            </Box>

            <Divider borderColor="border.primary" />

            {/* Support section */}
            <Box p={4}>
              <Text
                fontSize="xs"
                fontWeight="bold"
                color="text.tertiary"
                textTransform="uppercase"
                letterSpacing="wider"
                mb={3}
              >
                Support
              </Text>
              
              <VStack spacing={1} align="stretch">
                {supportItems.map((item) => {
                  const IconComponent = item.icon;

                  return (
                    <motion.div
                      key={item.href}
                      whileHover={{ x: 4 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button
                        variant="ghost"
                        justifyContent="flex-start"
                        h="auto"
                        p={3}
                        borderRadius="lg"
                        color="text.primary"
                        _hover={{
                          bg: 'bg.surface',
                          transform: 'translateX(4px)',
                        }}
                        onClick={() => handleNavigation(item.href)}
                        leftIcon={<IconComponent size={18} />}
                        rightIcon={<FaChevronRight size={12} opacity={0.5} />}
                      >
                        <VStack align="start" spacing={0} flex={1}>
                          <Text fontWeight="medium" fontSize="md">
                            {item.label}
                          </Text>
                          <Text fontSize="xs" color="text.tertiary" noOfLines={1}>
                            {item.description}
                          </Text>
                        </VStack>
                      </Button>
                    </motion.div>
                  );
                })}
              </VStack>
            </Box>

            <Divider borderColor="border.primary" />

            {/* User actions */}
            <Box p={4}>
              <Button
                variant="outline"
                leftIcon={<FaSignOutAlt />}
                size="md"
                w="full"
                borderColor="border.primary"
                color="text.secondary"
                _hover={{
                  borderColor: 'red.400',
                  color: 'red.400',
                  bg: 'red.50',
                }}
              >
                Sign Out
              </Button>
            </Box>
          </VStack>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
};

// Sticky bottom actions bar
const StickyBottomActions: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  
  // Don't show on certain pages
  const hiddenPaths = ['/booking', '/admin', '/driver-portal'];
  if (hiddenPaths.some(path => pathname.startsWith(path))) {
    return null;
  }

  return (
    <Box
      position="fixed"
      bottom="0"
      left="0"
      right="0"
      zIndex="sticky"
      bg="bg.card"
      borderTopWidth="1px"
      borderColor="border.primary"
      className="safe-area-bottom"
      boxShadow="0 -4px 20px rgba(0, 0, 0, 0.3)"
    >
      <HStack spacing={3} p={4} justify="center">
        <Button
          leftIcon={<FaPhone />}
          size="lg"
          variant="outline"
          flex={1}
          maxW="140px"
          borderColor="border.primary"
          color="text.primary"
          _hover={{
            borderColor: 'neon.400',
            color: 'neon.400',
            bg: 'bg.surface',
          }}
          onClick={() => window.open('tel:+441234567890')}
        >
          Call Now
        </Button>
        
        <Button
          leftIcon={<FaBoxes />}
          size="lg"
          flex={1}
          maxW="160px"
          bg="linear-gradient(135deg, #00C2FF, #00D18F)"
          color="white"
          fontWeight="bold"
          _hover={{
            transform: "translateY(-2px)",
            boxShadow: "0 8px 25px rgba(0,194,255,0.4)",
          }}
          _active={{
            transform: "translateY(0)",
          }}
          onClick={() => router.push('/booking')}
        >
          Book Now
        </Button>
      </HStack>
    </Box>
  );
};

// Main mobile navigation component
export const MobileNavigation: React.FC<{
  title?: string;
  children?: React.ReactNode;
}> = ({ title, children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isScrolled, setIsScrolled] = useState(false);
  
  // Show mobile navigation only on mobile screens
  const showMobileNav = useBreakpointValue({ base: true, lg: false });

  // Handle scroll to show/hide header shadow
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!showMobileNav) {
    return <>{children}</>;
  }

  return (
    <Box minH="100vh" bg="bg.canvas">
      {/* Mobile header */}
      <Box
        boxShadow={isScrolled ? 'md' : 'none'}
        transition="box-shadow 0.2s"
      >
        <MobileHeader onMenuOpen={onOpen} title={title} />
      </Box>

      {/* Off-canvas menu */}
      <OffCanvasMenu isOpen={isOpen} onClose={onClose} />

      {/* Page content */}
      <Box pb={{ base: "80px", lg: 0 }}>
        {children}
      </Box>

      {/* Sticky bottom actions */}
      <StickyBottomActions />
    </Box>
  );
};

// Hook for mobile navigation context
export const useMobileNavigation = () => {
  const [title, setTitle] = useState<string>();
  
  const setPageTitle = (newTitle: string) => {
    setTitle(newTitle);
  };
  
  return {
    title,
    setPageTitle,
  };
};

export default MobileNavigation;

