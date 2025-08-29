'use client';

import React from "react";
import {
  IconButton,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  VStack,
  useDisclosure,
  Button,
  Divider,
  Text
} from "@chakra-ui/react";
import NextLink from "next/link";
import { signOut } from "next-auth/react";

interface MobileNavProps {
  session: any;
}

export default function MobileNav({ session }: MobileNavProps) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const navItems = [
    { href: "/customer-portal", label: "Dashboard" },
    { href: "/customer-portal/orders", label: "My Orders" },
    { href: "/customer-portal/track", label: "Track" },
    { href: "/customer-portal/invoices", label: "Invoices & Payments" },
    { href: "/customer-portal/addresses", label: "Addresses & Contacts" },
    { href: "/customer-portal/settings", label: "Settings" },
    { href: "/customer-portal/support", label: "Support" },
  ];

  return (
    <>
      <IconButton
        aria-label="Open navigation menu"
        icon={<span>☰</span>}
        variant="ghost"
        size="sm"
        display={{ base: "inline-flex", lg: "none" }}
        onClick={onOpen}
      />
      
      <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader borderBottomWidth="1px">
            <Text fontWeight="bold">Speedy Van</Text>
            <Text fontSize="sm" color="text.muted" mt={1}>
              {session.user?.name}
            </Text>
          </DrawerHeader>
          
          <DrawerBody>
            <VStack spacing={4} align="stretch" mt={4}>
              {navItems.map((item) => (
                <Button
                  key={item.href}
                  as={NextLink}
                  href={item.href}
                  variant="ghost"
                  justifyContent="flex-start"
                  onClick={onClose}
                  aria-label={`Navigate to ${item.label}`}
                >
                  {item.label}
                </Button>
              ))}
              
              <Divider my={4} />
              
              <Button
                onClick={() => {
                  onClose();
                  signOut({ callbackUrl: "/" });
                }}
                variant="ghost"
                color="danger"
                justifyContent="flex-start"
              >
                Sign out
              </Button>
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
}
