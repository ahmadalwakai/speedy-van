'use client';

import React from "react";
import {
  HStack,
  Avatar,
  Text,
  Menu,
  MenuButton,
  IconButton,
  MenuList,
  MenuItem,
  MenuDivider,
  Box
} from "@chakra-ui/react";
import NextLink from "next/link";
import { signOut } from "next-auth/react";

interface UserMenuProps {
  session: any;
}

export default function UserMenu({ session }: UserMenuProps) {
  return (
    <HStack spacing={4} display={{ base: "none", lg: "flex" }}>
      <Menu>
        <MenuButton
          as={IconButton}
          aria-label="User menu"
          icon={
            <Avatar 
              size="sm" 
              name={session.user?.name ?? "Customer"}
              src={undefined}
            />
          }
          variant="ghost"
          size="sm"
        />
        <MenuList>
          <Box px={3} py={2}>
            <Text fontWeight="medium">{session.user?.name ?? "Customer"}</Text>
            <Text fontSize="sm" color="text.muted">{session.user?.email}</Text>
          </Box>
          <MenuDivider />
          <MenuItem as={NextLink} href="/customer-portal/settings">
            Settings
          </MenuItem>
          <MenuItem as={NextLink} href="/customer-portal/support">
            Help & Support
          </MenuItem>
          <MenuDivider />
          <MenuItem 
            onClick={() => signOut({ callbackUrl: "/" })}
            color="danger"
          >
            Sign out
          </MenuItem>
        </MenuList>
      </Menu>
    </HStack>
  );
}
