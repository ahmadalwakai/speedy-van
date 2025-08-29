import React from "react";
import {
  Box,
  Grid,
  GridItem,
  Heading,
  Link as ChakraLink,
  Text,
  Button,
  HStack,
  VStack,
  Badge,
  Card,
  CardBody,
  CardHeader,
  SimpleGrid,
  Divider,
  Icon,
  useColorModeValue
} from "@chakra-ui/react";
import NextLink from "next/link";
import { PrismaClient } from "@prisma/client";
import { requireRole } from "@/lib/auth";
import { NoOrdersEmptyState } from "@/components/EmptyState";

const prisma = new PrismaClient();

export default async function CustomerPortalHome() {
  const session = await requireRole("customer");
  const customerId = (session!.user as any).id as string;
  const firstName = session!.user?.name?.split(' ')[0] || 'there';

  const [nextBooking, recentOrders, outstandingPayments, invoiceStats] = await Promise.all([
    // Next booking (most recent active/upcoming)
    prisma.booking.findFirst({
      where: {
        customerId,
        status: {
          in: ["DRAFT", "CONFIRMED"]
        }
      },
      orderBy: { scheduledAt: "asc" },
      include: {
        pickupAddress: true,
        dropoffAddress: true,
        driver: {
          select: {
            user: {
              select: {
                name: true
              }
            }
          }
        }
      }
    }),
    // Recent orders (last 3)
    prisma.booking.findMany({
      where: { customerId },
      orderBy: { createdAt: "desc" },
      take: 3
    }),
    // Outstanding payments
    prisma.booking.findMany({
      where: {
        customerId,
        status: { in: ["DRAFT"] }
      },
      orderBy: { createdAt: "desc" },
      take: 3
    }),
    // Invoice statistics
    prisma.booking.aggregate({
      where: { customerId },
      _count: {
        id: true
      },
      _sum: {
        totalGBP: true
      }
    })
  ]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP'
    }).format(amount / 100);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED': return 'green';
      case 'CANCELLED': return 'red';
      case 'CONFIRMED': return 'green';
      case 'DRAFT': return 'gray';
      default: return 'gray';
    }
  };

  const getStatusLabel = (status: string) => {
    return status.replace(/_/g, " ").toUpperCase();
  };

  return (
    <VStack align="stretch" spacing={6} as="main">
      {/* Welcome Section */}
      <Box as="section" aria-labelledby="welcome-heading">
        <Heading id="welcome-heading" size="lg" mb={2}>Hello, {firstName}!</Heading>
        <Text color="text.muted">Welcome to your Speedy Van dashboard</Text>
      </Box>

      {/* Next Booking Card */}
      {nextBooking && (
        <Card as="section" aria-labelledby="next-booking-heading">
          <CardHeader>
            <HStack justify="space-between">
              <Heading id="next-booking-heading" size="md">Next Booking</Heading>
              <Badge
                colorScheme={getStatusColor(nextBooking.status)}
                variant="subtle"
                aria-label={`Status: ${getStatusLabel(nextBooking.status)}`}
              >
                {getStatusLabel(nextBooking.status)}
              </Badge>
            </HStack>
          </CardHeader>
          <CardBody>
            <VStack align="stretch" spacing={4}>
              <Box>
                <Text fontWeight="medium" mb={1}>Booking {nextBooking.reference}</Text>
                <Text fontSize="sm" color="text.muted">
                  {nextBooking.scheduledAt ? 
                    new Date(nextBooking.scheduledAt).toLocaleDateString('en-GB') : 
                    "Date TBD"
                                      } at {nextBooking.estimatedDurationMinutes ? `${nextBooking.estimatedDurationMinutes} minutes` : "Time TBD"}
                </Text>
              </Box>

              <Box>
                <Text fontSize="sm" fontWeight="medium" mb={1}>Route</Text>
                <Text fontSize="sm" color="text.muted">
                  {nextBooking.pickupAddress?.label || 'Pickup TBD'} → {nextBooking.dropoffAddress?.label || 'Dropoff TBD'}
                </Text>
              </Box>

              {nextBooking.driver && (
                <Box>
                  <Text fontSize="sm" fontWeight="medium" mb={1}>Your Driver</Text>
                  <Text fontSize="sm" color="text.muted">{nextBooking.driver.user.name}</Text>
                </Box>
              )}

              <HStack spacing={3} flexWrap="wrap">
                <Button
                  as={NextLink as any}
                  href={`/customer-portal/orders/${nextBooking.reference}`}
                  colorScheme="blue"
                  size="sm"
                  aria-label={`View details for booking ${nextBooking.reference}`}
                >
                  View Details
                </Button>
                {(nextBooking.status === "CONFIRMED") && (
                  <Button
                    as={NextLink as any}
                    href={`/track/${nextBooking.reference}`}
                    variant="outline"
                    size="sm"
                    aria-label={`Track booking ${nextBooking.reference}`}
                  >
                    Track
                  </Button>
                )}
                {nextBooking.status === "DRAFT" && (
                  <Button
                    as={NextLink as any}
                    href={`/customer-portal/orders/${nextBooking.reference}`}
                    variant="outline"
                    size="sm"
                    aria-label={`Reschedule booking ${nextBooking.reference}`}
                  >
                    Reschedule
                  </Button>
                )}
              </HStack>
            </VStack>
          </CardBody>
        </Card>
      )}

      {/* Quick Actions */}
      <Box as="section" aria-labelledby="quick-actions-heading">
        <Heading id="quick-actions-heading" size="md" mb={4}>Quick Actions</Heading>
        <SimpleGrid columns={{ base: 1, sm: 2, md: 4 }} spacing={4}>
          <Button
            as={NextLink as any}
            href="/book"
            colorScheme="blue"
            size="lg"
            height="auto"
            py={6}
            aria-label="Create a new booking"
          >
            <VStack spacing={2}>
              <Text fontSize="2xl" role="img" aria-hidden="true">📦</Text>
              <Text>New Booking</Text>
            </VStack>
          </Button>

          <Button
            as={NextLink as any}
            href="/customer-portal/orders"
            variant="outline"
            size="lg"
            height="auto"
            py={6}
            aria-label="View all your orders"
          >
            <VStack spacing={2}>
              <Text fontSize="2xl" role="img" aria-hidden="true">📋</Text>
              <Text>My Orders</Text>
            </VStack>
          </Button>

          <Button
            as={NextLink as any}
            href="/customer-portal/invoices"
            variant="outline"
            size="lg"
            height="auto"
            py={6}
            aria-label="View invoices and payments"
          >
            <VStack spacing={2}>
              <Text fontSize="2xl" role="img" aria-hidden="true">💰</Text>
              <Text>Invoices</Text>
            </VStack>
          </Button>

          <Button
            as={NextLink as any}
            href="/customer-portal/addresses"
            variant="outline"
            size="lg"
            height="auto"
            py={6}
            aria-label="Manage addresses and contacts"
          >
            <VStack spacing={2}>
              <Text fontSize="2xl" role="img" aria-hidden="true">📍</Text>
              <Text>Addresses</Text>
            </VStack>
          </Button>
        </SimpleGrid>
      </Box>

      {/* Recent Orders */}
      <Box as="section" aria-labelledby="recent-orders-heading">
        <HStack justify="space-between" mb={4}>
          <Heading id="recent-orders-heading" size="md">Recent Orders</Heading>
          <Button as={NextLink as any} href="/customer-portal/orders" variant="link" size="sm" aria-label="View all orders">
            View All
          </Button>
        </HStack>

        {recentOrders.length === 0 ? (
          <NoOrdersEmptyState />
        ) : (
          <VStack align="stretch" spacing={3}>
            {recentOrders.map((order) => (
              <Card key={order.id}>
                <CardBody>
                  <HStack justify="space-between" align="center">
                    <VStack align="start" spacing={1}>
                      <Text fontWeight="medium">{order.reference}</Text>
                      <Text fontSize="sm" color="text.muted">
                                                 {order.scheduledAt ?
                           new Date(order.scheduledAt).toLocaleDateString('en-GB') :
                           "Date TBD"
                         }
                      </Text>
                    </VStack>
                    <HStack spacing={3}>
                      <Badge
                        colorScheme={getStatusColor(order.status)}
                        variant="subtle"
                        aria-label={`Status: ${getStatusLabel(order.status)}`}
                      >
                        {getStatusLabel(order.status)}
                      </Badge>
                      <Button
                        as={NextLink as any}
                        href={`/customer-portal/orders/${order.reference}`}
                        size="sm"
                        variant="outline"
                        aria-label={`View details for order ${order.reference}`}
                      >
                        View
                      </Button>
                    </HStack>
                  </HStack>
                </CardBody>
              </Card>
            ))}
          </VStack>
        )}
      </Box>

      {/* Invoice Statistics */}
      <Box as="section" aria-labelledby="invoice-summary-heading">
        <HStack justify="space-between" mb={4}>
          <Heading id="invoice-summary-heading" size="md">Invoice Summary</Heading>
          <Button as={NextLink as any} href="/customer-portal/invoices" variant="link" size="sm" aria-label="View all invoices">
            View All
          </Button>
        </HStack>
        
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
          <Card>
            <CardBody>
              <VStack spacing={2}>
                <Text fontSize="2xl" fontWeight="bold" color="blue.500">
                  {invoiceStats._count.id}
                </Text>
                <Text fontSize="sm" color="text.muted" textAlign="center">
                  Total Invoices
                </Text>
              </VStack>
            </CardBody>
          </Card>
          
          <Card>
            <CardBody>
              <VStack spacing={2}>
                <Text fontSize="2xl" fontWeight="bold" color="green.500">
                  {formatCurrency((invoiceStats._sum.totalGBP || 0) * 100)}
                </Text>
                <Text fontSize="sm" color="text.muted" textAlign="center">
                  Total Spent
                </Text>
              </VStack>
            </CardBody>
          </Card>
          
          <Card>
            <CardBody>
              <VStack spacing={2}>
                <Text fontSize="2xl" fontWeight="bold" color="orange.500">
                  {outstandingPayments.length}
                </Text>
                <Text fontSize="sm" color="text.muted" textAlign="center">
                  Outstanding Payments
                </Text>
              </VStack>
            </CardBody>
          </Card>
        </SimpleGrid>
      </Box>

      {/* Outstanding Actions */}
      {outstandingPayments.length > 0 && (
        <Box as="section" aria-labelledby="outstanding-actions-heading">
          <Heading id="outstanding-actions-heading" size="md" mb={4}>Outstanding Actions</Heading>
          <VStack align="stretch" spacing={3}>
            {outstandingPayments.map((order) => (
              <Card key={order.id} bg="yellow.50" borderColor="yellow.200">
                <CardBody>
                  <HStack justify="space-between" align="center">
                    <VStack align="start" spacing={1}>
                      <Text fontWeight="medium">{order.reference}</Text>
                      <Text fontSize="sm" color="text.muted">
                        Payment required: {formatCurrency(order.totalGBP * 100)}
                      </Text>
                    </VStack>
                    <Button
                      as={NextLink as any}
                      href={`/checkout?code=${order.reference}`}
                      colorScheme="blue"
                      size="sm"
                      aria-label={`Complete payment for order ${order.reference}`}
                    >
                      Complete Payment
                    </Button>
                  </HStack>
                </CardBody>
              </Card>
            ))}
          </VStack>
        </Box>
      )}

      {/* Announcements */}
      <Card as="section" aria-labelledby="announcements-heading" bg="blue.50" borderColor="blue.200">
        <CardBody>
          <Heading id="announcements-heading" size="sm" mb={2}>
            <Text as="span" role="img" aria-hidden="true">📢</Text> Service Updates
          </Heading>
          <VStack align="start" spacing={2}>
            <Text fontSize="sm">
              • <strong>New Feature:</strong> Live tracking is now available for all active moves
            </Text>
            <Text fontSize="sm">
              • <strong>Holiday Hours:</strong> We'll be operating with reduced hours during the festive season
            </Text>
            <Text fontSize="sm">
              • <strong>Referral Bonus:</strong> Get £10 off your next move when you refer a friend
            </Text>
          </VStack>
        </CardBody>
      </Card>
    </VStack>
  );
}


