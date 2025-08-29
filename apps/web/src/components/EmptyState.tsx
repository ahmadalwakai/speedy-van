'use client';
import React from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  VStack,
  Text,
  Button,
  Icon,
  useColorModeValue,
} from "@chakra-ui/react";

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: React.ReactElement;
  action?: {
    label: string;
    onClick: () => void;
    href?: string;
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
    href?: string;
  };
  variant?: "default" | "compact" | "illustrated";
}

export function EmptyState({
  title,
  description,
  icon,
  action,
  secondaryAction,
  variant = "default",
}: EmptyStateProps) {
  const bgColor = useColorModeValue("gray.50", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");

  const renderIcon = () => {
    if (icon) {
      return (
        <Box
          p={4}
          borderRadius="full"
          bg={useColorModeValue("gray.100", "gray.700")}
          color={useColorModeValue("gray.600", "gray.400")}
          mb={4}
        >
          {React.cloneElement(icon, { boxSize: 6 })}
        </Box>
      );
    }
    return null;
  };

  const renderContent = () => (
    <VStack spacing={4} textAlign="center" maxW="400px" mx="auto">
      {renderIcon()}
      <VStack spacing={2}>
        <Text fontSize="lg" fontWeight="semibold" color="text.default">
          {title}
        </Text>
        <Text fontSize="sm" color="text.muted" lineHeight="tall">
          {description}
        </Text>
      </VStack>
      
      {(action || secondaryAction) && (
        <VStack spacing={3} w="full">
          {action && (
            action.href ? (
              <Button
                as="a"
                href={action.href}
                onClick={action.onClick}
                colorScheme="blue"
                size="md"
                w="full"
                maxW="200px"
                aria-label={action.label}
              >
                {action.label}
              </Button>
            ) : (
              <Button
                onClick={action.onClick}
                colorScheme="blue"
                size="md"
                w="full"
                maxW="200px"
                aria-label={action.label}
              >
                {action.label}
              </Button>
            )
          )}
          {secondaryAction && (
            secondaryAction.href ? (
              <Button
                as="a"
                href={secondaryAction.href}
                onClick={secondaryAction.onClick}
                variant="outline"
                size="md"
                w="full"
                maxW="200px"
                aria-label={secondaryAction.label}
              >
                {secondaryAction.label}
              </Button>
            ) : (
              <Button
                onClick={secondaryAction.onClick}
                variant="outline"
                size="md"
                w="full"
                maxW="200px"
                aria-label={secondaryAction.label}
              >
                {secondaryAction.label}
              </Button>
            )
          )}
        </VStack>
      )}
    </VStack>
  );

  if (variant === "compact") {
    return (
      <Box
        p={6}
        bg={bgColor}
        borderWidth="1px"
        borderColor={borderColor}
        borderRadius="lg"
        textAlign="center"
        role="status"
        aria-label={`Empty state: ${title}`}
      >
        {renderContent()}
      </Box>
    );
  }

  if (variant === "illustrated") {
    return (
      <Box
        p={12}
        bg={bgColor}
        borderWidth="1px"
        borderColor={borderColor}
        borderStyle="dashed"
        borderRadius="xl"
        textAlign="center"
        role="status"
        aria-label={`Empty state: ${title}`}
      >
        {renderContent()}
      </Box>
    );
  }

  return (
    <Box
      p={8}
      bg={bgColor}
      borderWidth="1px"
      borderColor={borderColor}
      borderRadius="lg"
      textAlign="center"
      role="status"
      aria-label={`Empty state: ${title}`}
    >
      {renderContent()}
    </Box>
  );
}

// Predefined empty states for common scenarios
export function NoOrdersEmptyState() {
  const router = useRouter();
  
  return (
    <EmptyState
      title="No orders yet"
      description="Start by making your first booking. We'll help you move your items safely and efficiently."
      icon={<span role="img" aria-hidden="true">📦</span>}
      action={{
        label: "Book a Move",
        onClick: () => router.push("/book"),
        href: "/book",
      }}
      secondaryAction={{
        label: "Learn How It Works",
        onClick: () => router.push("/how-it-works"),
        href: "/how-it-works",
      }}
    />
  );
}

export function NoInvoicesEmptyState() {
  const router = useRouter();
  
  return (
    <EmptyState
      title="No invoices yet"
      description="Invoices will appear here once you complete your first booking."
      icon={<span role="img" aria-hidden="true">💰</span>}
      action={{
        label: "Book a Move",
        onClick: () => router.push("/book"),
        href: "/book",
      }}
    />
  );
}

export function NoAddressesEmptyState() {
  const router = useRouter();
  
  return (
    <EmptyState
      title="No saved addresses"
      description="Save your frequently used addresses to make booking faster."
      icon={<span role="img" aria-hidden="true">📍</span>}
      action={{
        label: "Add Address",
        onClick: () => router.push("/customer-portal/addresses"),
        href: "/customer-portal/addresses",
      }}
    />
  );
}

export function NoContactsEmptyState() {
  const router = useRouter();
  
  return (
    <EmptyState
      title="No saved contacts"
      description="Save contacts to quickly add them to your bookings."
      icon={<span role="img" aria-hidden="true">👥</span>}
      action={{
        label: "Add Contact",
        onClick: () => router.push("/customer-portal/addresses"),
        href: "/customer-portal/addresses",
      }}
    />
  );
}

export function NoSupportTicketsEmptyState() {
  const router = useRouter();
  
  return (
    <EmptyState
      title="No support tickets"
      description="You haven't created any support tickets yet. We're here to help when you need us."
      icon={<span role="img" aria-hidden="true">🎫</span>}
      action={{
        label: "Get Help",
        onClick: () => router.push("/customer-portal/support"),
        href: "/customer-portal/support",
      }}
    />
  );
}

export function SearchEmptyState({ query }: { query: string }) {
  const router = useRouter();
  
  return (
    <EmptyState
      title={`No results for "${query}"`}
      description="Try adjusting your search terms or browse our categories to find what you're looking for."
      icon={<span role="img" aria-hidden="true">🔍</span>}
      action={{
        label: "Clear Search",
        onClick: () => router.refresh(),
      }}
      secondaryAction={{
        label: "Browse Categories",
        onClick: () => router.push("/book"),
        href: "/book",
      }}
    />
  );
}

export function ErrorEmptyState({ 
  title = "Something went wrong",
  description = "We encountered an error while loading this content. Please try again.",
  onRetry,
}: {
  title?: string;
  description?: string;
  onRetry?: () => void;
}) {
  const router = useRouter();
  
  return (
    <EmptyState
      title={title}
      description={description}
      icon={<span role="img" aria-hidden="true">⚠️</span>}
      action={
        onRetry
          ? {
              label: "Try Again",
              onClick: onRetry,
            }
          : {
              label: "Refresh Page",
              onClick: () => router.refresh(),
            }
      }
      secondaryAction={{
        label: "Contact Support",
        onClick: () => router.push("/customer-portal/support"),
        href: "/customer-portal/support",
      }}
    />
  );
}
