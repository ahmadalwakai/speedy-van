'use client';

import React, { useState, useCallback, useMemo } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Box,
  VStack,
  HStack,
  Text,
  Button,
  IconButton,
  Divider,
  Badge,
  Card,
  CardBody,
  CardHeader,
  Heading,
  Flex,
  Spacer,
  Input,
  Select,
  Textarea,
  FormControl,
  FormLabel,
  FormErrorMessage,
  useToast,
  Collapse,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  Alert,
  AlertIcon,
  Tooltip,
  Spinner,
} from '@chakra-ui/react';
import {
  EditIcon,
  CheckIcon,
  CloseIcon,
  InfoIcon,
  CalendarIcon,
  MapPinIcon,
  PackageIcon,
  TruckIcon,
  CreditCardIcon,
  UserIcon,
  DiscountIcon,
  AlertTriangleIcon,
} from 'lucide-react';

import { useBookingForm } from '@/lib/booking/state-manager';
import { usePricingEngine } from '@/lib/booking/pricing-engine';
import { useScheduleService } from '@/lib/booking/schedule-service';
import { useUKAddressService } from '@/lib/booking/address-service';
import { 
  BookingItem, 
  Address, 
  CustomerDetails,
  PricingBreakdown,
  Step1Data,
  Step2Data,
  Step3Data,
  Step4Data,
} from '@/lib/booking/schemas';
import { format } from 'date-fns';

// Edit form schemas for inline editing
const editItemSchema = z.object({
  quantity: z.number().min(1).max(20),
  description: z.string().optional(),
});

const editAddressSchema = z.object({
  line1: z.string().min(1, 'Address line 1 is required'),
  line2: z.string().optional(),
  city: z.string().min(1, 'City is required'),
  postcode: z.string().min(1, 'Postcode is required'),
});

const editCustomerSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(1, 'Phone number is required'),
  specialRequirements: z.string().optional(),
});

interface LuxuryBookingSummaryProps {
  onSubmit: () => void;
  onEdit: (step: number) => void;
  isSubmitting?: boolean;
}

interface EditableItemProps {
  item: BookingItem;
  onUpdate: (itemId: string, updates: Partial<BookingItem>) => void;
  onRemove: (itemId: string) => void;
}

interface EditableAddressProps {
  address: Address;
  label: string;
  onUpdate: (updates: Partial<Address>) => void;
}

interface EditableCustomerProps {
  customer: CustomerDetails;
  onUpdate: (updates: Partial<CustomerDetails>) => void;
}

// Editable Item Component
const EditableItem: React.FC<EditableItemProps> = ({ item, onUpdate, onRemove }) => {
  const [isEditing, setIsEditing] = useState(false);
  const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();
  const toast = useToast();

  const { control, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(editItemSchema),
    defaultValues: {
      quantity: item.quantity,
      description: item.description || '',
    },
  });

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    reset();
    setIsEditing(false);
  };

  const handleSave = (data: z.infer<typeof editItemSchema>) => {
    onUpdate(item.id, {
      quantity: data.quantity,
      description: data.description,
    });
    setIsEditing(false);
    toast({
      title: 'Item updated',
      status: 'success',
      duration: 2000,
    });
  };

  const handleRemove = () => {
    onRemove(item.id);
    onDeleteClose();
    toast({
      title: 'Item removed',
      status: 'info',
      duration: 2000,
    });
  };

  return (
    <>
      <Card size="sm" variant="outline">
        <CardBody>
          <HStack spacing={3} align="start">
            <Box flex={1}>
              <HStack spacing={2} mb={1}>
                <Text fontWeight="medium" fontSize="sm">
                  {item.name}
                </Text>
                {item.fragile && (
                  <Badge colorScheme="orange" size="sm">
                    Fragile
                  </Badge>
                )}
                {item.valuable && (
                  <Badge colorScheme="purple" size="sm">
                    Valuable
                  </Badge>
                )}
              </HStack>
              
              {isEditing ? (
                <VStack spacing={2} align="stretch">
                  <HStack>
                    <FormControl isInvalid={!!errors.quantity} size="sm">
                      <FormLabel fontSize="xs">Quantity</FormLabel>
                      <Controller
                        name="quantity"
                        control={control}
                        render={({ field }) => (
                          <Input
                            {...field}
                            type="number"
                            min={1}
                            max={20}
                            size="sm"
                            width="80px"
                            onChange={(e) => field.onChange(parseInt(e.target.value))}
                          />
                        )}
                      />
                      <FormErrorMessage fontSize="xs">
                        {errors.quantity?.message}
                      </FormErrorMessage>
                    </FormControl>
                    
                    <Text fontSize="xs" color="gray.600" alignSelf="end" pb={2}>
                      × {item.volume}m³ = {(item.quantity * item.volume).toFixed(1)}m³
                    </Text>
                  </HStack>
                  
                  <FormControl size="sm">
                    <FormLabel fontSize="xs">Notes (optional)</FormLabel>
                    <Controller
                      name="description"
                      control={control}
                      render={({ field }) => (
                        <Textarea
                          {...field}
                          size="sm"
                          rows={2}
                          placeholder="Any special instructions..."
                        />
                      )}
                    />
                  </FormControl>
                  
                  <HStack spacing={2}>
                    <Button
                      size="xs"
                      colorScheme="blue"
                      leftIcon={<CheckIcon size={12} />}
                      onClick={handleSubmit(handleSave)}
                    >
                      Save
                    </Button>
                    <Button
                      size="xs"
                      variant="ghost"
                      leftIcon={<CloseIcon size={12} />}
                      onClick={handleCancel}
                    >
                      Cancel
                    </Button>
                  </HStack>
                </VStack>
              ) : (
                <VStack spacing={1} align="start">
                  <HStack spacing={4}>
                    <Text fontSize="sm" color="gray.600">
                      Qty: {item.quantity}
                    </Text>
                    <Text fontSize="sm" color="gray.600">
                      Volume: {(item.quantity * item.volume).toFixed(1)}m³
                    </Text>
                    {item.weight && (
                      <Text fontSize="sm" color="gray.600">
                        Weight: {(item.quantity * item.weight).toFixed(0)}kg
                      </Text>
                    )}
                  </HStack>
                  
                  {item.description && (
                    <Text fontSize="xs" color="gray.500" fontStyle="italic">
                      {item.description}
                    </Text>
                  )}
                </VStack>
              )}
            </Box>
            
            <VStack spacing={1}>
              {!isEditing && (
                <Tooltip label="Edit item">
                  <IconButton
                    size="xs"
                    variant="ghost"
                    icon={<EditIcon size={14} />}
                    onClick={handleEdit}
                    aria-label="Edit item"
                  />
                </Tooltip>
              )}
              
              <Tooltip label="Remove item">
                <IconButton
                  size="xs"
                  variant="ghost"
                  colorScheme="red"
                  icon={<CloseIcon size={14} />}
                  onClick={onDeleteOpen}
                  aria-label="Remove item"
                />
              </Tooltip>
            </VStack>
          </HStack>
        </CardBody>
      </Card>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={isDeleteOpen} onClose={onDeleteClose} size="sm">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader fontSize="lg">Remove Item</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>
              Are you sure you want to remove <strong>{item.name}</strong> from your booking?
            </Text>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onDeleteClose}>
              Cancel
            </Button>
            <Button colorScheme="red" onClick={handleRemove}>
              Remove
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

// Editable Address Component
const EditableAddress: React.FC<EditableAddressProps> = ({ address, label, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const toast = useToast();
  const addressService = useUKAddressService();

  const { control, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(editAddressSchema),
    defaultValues: {
      line1: address.line1,
      line2: address.line2 || '',
      city: address.city,
      postcode: address.postcode,
    },
  });

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    reset();
    setIsEditing(false);
  };

  const handleSave = async (data: z.infer<typeof editAddressSchema>) => {
    try {
      // Validate address
      const validation = await addressService.validateAddress(data);
      
      if (!validation.isValid) {
        toast({
          title: 'Invalid address',
          description: validation.errors[0],
          status: 'error',
          duration: 4000,
        });
        return;
      }

      onUpdate({
        ...data,
        verified: true,
      });
      
      setIsEditing(false);
      toast({
        title: 'Address updated',
        status: 'success',
        duration: 2000,
      });
    } catch (error) {
      toast({
        title: 'Error updating address',
        description: 'Please try again',
        status: 'error',
        duration: 3000,
      });
    }
  };

  return (
    <Card size="sm" variant="outline">
      <CardHeader pb={2}>
        <HStack>
          <Heading size="xs">{label}</Heading>
          <Spacer />
          {!isEditing && (
            <Tooltip label="Edit address">
              <IconButton
                size="xs"
                variant="ghost"
                icon={<EditIcon size={14} />}
                onClick={handleEdit}
                aria-label="Edit address"
              />
            </Tooltip>
          )}
        </HStack>
      </CardHeader>
      
      <CardBody pt={0}>
        {isEditing ? (
          <VStack spacing={3} align="stretch">
            <FormControl isInvalid={!!errors.line1} size="sm">
              <FormLabel fontSize="xs">Address Line 1</FormLabel>
              <Controller
                name="line1"
                control={control}
                render={({ field }) => (
                  <Input {...field} size="sm" />
                )}
              />
              <FormErrorMessage fontSize="xs">
                {errors.line1?.message}
              </FormErrorMessage>
            </FormControl>
            
            <FormControl size="sm">
              <FormLabel fontSize="xs">Address Line 2 (optional)</FormLabel>
              <Controller
                name="line2"
                control={control}
                render={({ field }) => (
                  <Input {...field} size="sm" />
                )}
              />
            </FormControl>
            
            <HStack spacing={2}>
              <FormControl isInvalid={!!errors.city} size="sm">
                <FormLabel fontSize="xs">City</FormLabel>
                <Controller
                  name="city"
                  control={control}
                  render={({ field }) => (
                    <Input {...field} size="sm" />
                  )}
                />
                <FormErrorMessage fontSize="xs">
                  {errors.city?.message}
                </FormErrorMessage>
              </FormControl>
              
              <FormControl isInvalid={!!errors.postcode} size="sm">
                <FormLabel fontSize="xs">Postcode</FormLabel>
                <Controller
                  name="postcode"
                  control={control}
                  render={({ field }) => (
                    <Input {...field} size="sm" />
                  )}
                />
                <FormErrorMessage fontSize="xs">
                  {errors.postcode?.message}
                </FormErrorMessage>
              </FormControl>
            </HStack>
            
            <HStack spacing={2}>
              <Button
                size="xs"
                colorScheme="blue"
                leftIcon={<CheckIcon size={12} />}
                onClick={handleSubmit(handleSave)}
              >
                Save
              </Button>
              <Button
                size="xs"
                variant="ghost"
                leftIcon={<CloseIcon size={12} />}
                onClick={handleCancel}
              >
                Cancel
              </Button>
            </HStack>
          </VStack>
        ) : (
          <VStack spacing={1} align="start">
            <Text fontSize="sm" fontWeight="medium">
              {address.line1}
            </Text>
            {address.line2 && (
              <Text fontSize="sm" color="gray.600">
                {address.line2}
              </Text>
            )}
            <Text fontSize="sm" color="gray.600">
              {address.city}, {address.postcode}
            </Text>
            {address.verified && (
              <Badge colorScheme="green" size="sm">
                Verified
              </Badge>
            )}
          </VStack>
        )}
      </CardBody>
    </Card>
  );
};

// Editable Customer Component
const EditableCustomer: React.FC<EditableCustomerProps> = ({ customer, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const toast = useToast();

  const { control, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(editCustomerSchema),
    defaultValues: {
      firstName: customer.firstName,
      lastName: customer.lastName,
      email: customer.email,
      phone: customer.phone,
      specialRequirements: customer.specialRequirements || '',
    },
  });

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    reset();
    setIsEditing(false);
  };

  const handleSave = (data: z.infer<typeof editCustomerSchema>) => {
    onUpdate(data);
    setIsEditing(false);
    toast({
      title: 'Contact details updated',
      status: 'success',
      duration: 2000,
    });
  };

  return (
    <Card size="sm" variant="outline">
      <CardHeader pb={2}>
        <HStack>
          <Heading size="xs">Contact Details</Heading>
          <Spacer />
          {!isEditing && (
            <Tooltip label="Edit contact details">
              <IconButton
                size="xs"
                variant="ghost"
                icon={<EditIcon size={14} />}
                onClick={handleEdit}
                aria-label="Edit contact details"
              />
            </Tooltip>
          )}
        </HStack>
      </CardHeader>
      
      <CardBody pt={0}>
        {isEditing ? (
          <VStack spacing={3} align="stretch">
            <HStack spacing={2}>
              <FormControl isInvalid={!!errors.firstName} size="sm">
                <FormLabel fontSize="xs">First Name</FormLabel>
                <Controller
                  name="firstName"
                  control={control}
                  render={({ field }) => (
                    <Input {...field} size="sm" />
                  )}
                />
                <FormErrorMessage fontSize="xs">
                  {errors.firstName?.message}
                </FormErrorMessage>
              </FormControl>
              
              <FormControl isInvalid={!!errors.lastName} size="sm">
                <FormLabel fontSize="xs">Last Name</FormLabel>
                <Controller
                  name="lastName"
                  control={control}
                  render={({ field }) => (
                    <Input {...field} size="sm" />
                  )}
                />
                <FormErrorMessage fontSize="xs">
                  {errors.lastName?.message}
                </FormErrorMessage>
              </FormControl>
            </HStack>
            
            <FormControl isInvalid={!!errors.email} size="sm">
              <FormLabel fontSize="xs">Email</FormLabel>
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <Input {...field} type="email" size="sm" />
                )}
              />
              <FormErrorMessage fontSize="xs">
                {errors.email?.message}
              </FormErrorMessage>
            </FormControl>
            
            <FormControl isInvalid={!!errors.phone} size="sm">
              <FormLabel fontSize="xs">Phone</FormLabel>
              <Controller
                name="phone"
                control={control}
                render={({ field }) => (
                  <Input {...field} type="tel" size="sm" />
                )}
              />
              <FormErrorMessage fontSize="xs">
                {errors.phone?.message}
              </FormErrorMessage>
            </FormControl>
            
            <FormControl size="sm">
              <FormLabel fontSize="xs">Special Requirements (optional)</FormLabel>
              <Controller
                name="specialRequirements"
                control={control}
                render={({ field }) => (
                  <Textarea
                    {...field}
                    size="sm"
                    rows={2}
                    placeholder="Any special requirements or instructions..."
                  />
                )}
              />
            </FormControl>
            
            <HStack spacing={2}>
              <Button
                size="xs"
                colorScheme="blue"
                leftIcon={<CheckIcon size={12} />}
                onClick={handleSubmit(handleSave)}
              >
                Save
              </Button>
              <Button
                size="xs"
                variant="ghost"
                leftIcon={<CloseIcon size={12} />}
                onClick={handleCancel}
              >
                Cancel
              </Button>
            </HStack>
          </VStack>
        ) : (
          <VStack spacing={1} align="start">
            <Text fontSize="sm" fontWeight="medium">
              {customer.firstName} {customer.lastName}
            </Text>
            <Text fontSize="sm" color="gray.600">
              {customer.email}
            </Text>
            <Text fontSize="sm" color="gray.600">
              {customer.phone}
            </Text>
            {customer.specialRequirements && (
              <Text fontSize="xs" color="gray.500" fontStyle="italic">
                Special requirements: {customer.specialRequirements}
              </Text>
            )}
          </VStack>
        )}
      </CardBody>
    </Card>
  );
};

// Main Luxury Booking Summary Component
export const LuxuryBookingSummary: React.FC<LuxuryBookingSummaryProps> = ({
  onSubmit,
  onEdit,
  isSubmitting = false,
}) => {
  const { formState, getAllData, updateFormState } = useBookingForm();
  const pricingEngine = usePricingEngine();
  const [promoCode, setPromoCode] = useState('');
  const [promoError, setPromoError] = useState('');
  const [isApplyingPromo, setIsApplyingPromo] = useState(false);
  const toast = useToast();

  const bookingData = getAllData();
  
  // Calculate pricing
  const pricing = useMemo(() => {
    if (!bookingData.step1?.items?.length || !bookingData.step2?.distance || !bookingData.step3?.timeSlot) {
      return null;
    }

    try {
      return pricingEngine.calculatePricing({
        items: bookingData.step1.items,
        serviceType: bookingData.step3.serviceType?.id || 'man-and-van',
        distance: bookingData.step2.distance,
        estimatedDuration: bookingData.step2.estimatedDuration || 2,
        timeSlot: bookingData.step3.timeSlot,
        date: new Date(bookingData.step3.date || Date.now()),
        pickupProperty: bookingData.step2.pickupProperty || {
          type: 'house',
          floor: 0,
          hasLift: false,
          narrowAccess: false,
        },
        dropoffProperty: bookingData.step2.dropoffProperty || {
          type: 'house',
          floor: 0,
          hasLift: false,
          narrowAccess: false,
        },
        promoCode: bookingData.step4?.promoCode,
        isFirstTimeCustomer: true, // This would come from user data
      });
    } catch (error) {
      console.error('Pricing calculation error:', error);
      return null;
    }
  }, [bookingData, pricingEngine]);

  // Handle item updates
  const handleItemUpdate = useCallback((itemId: string, updates: Partial<BookingItem>) => {
    const currentItems = bookingData.step1?.items || [];
    const updatedItems = currentItems.map(item => 
      item.id === itemId ? { ...item, ...updates } : item
    );
    
    updateFormState({
      data: {
        ...formState.data,
        step1: {
          ...formState.data.step1,
          items: updatedItems,
        },
      },
    });
  }, [bookingData.step1?.items, formState.data, updateFormState]);

  // Handle item removal
  const handleItemRemove = useCallback((itemId: string) => {
    const currentItems = bookingData.step1?.items || [];
    const updatedItems = currentItems.filter(item => item.id !== itemId);
    
    updateFormState({
      data: {
        ...formState.data,
        step1: {
          ...formState.data.step1,
          items: updatedItems,
        },
      },
    });
  }, [bookingData.step1?.items, formState.data, updateFormState]);

  // Handle address updates
  const handleAddressUpdate = useCallback((type: 'pickup' | 'dropoff', updates: Partial<Address>) => {
    const addressKey = type === 'pickup' ? 'pickupAddress' : 'dropoffAddress';
    
    updateFormState({
      data: {
        ...formState.data,
        step2: {
          ...formState.data.step2,
          [addressKey]: {
            ...formState.data.step2?.[addressKey],
            ...updates,
          },
        },
      },
    });
  }, [formState.data, updateFormState]);

  // Handle customer updates
  const handleCustomerUpdate = useCallback((updates: Partial<CustomerDetails>) => {
    updateFormState({
      data: {
        ...formState.data,
        step4: {
          ...formState.data.step4,
          customer: {
            ...formState.data.step4?.customer,
            ...updates,
          },
        },
      },
    });
  }, [formState.data, updateFormState]);

  // Handle promo code application
  const handleApplyPromoCode = useCallback(async () => {
    if (!promoCode.trim() || !pricing) return;

    setIsApplyingPromo(true);
    setPromoError('');

    try {
      const validation = pricingEngine.validatePromoCode(
        promoCode.trim(),
        pricing.subtotal,
        {
          serviceType: bookingData.step3?.serviceType?.id,
          distance: bookingData.step2?.distance,
          isFirstTimeCustomer: true,
        }
      );

      if (validation.valid) {
        updateFormState({
          data: {
            ...formState.data,
            step4: {
              ...formState.data.step4,
              promoCode: promoCode.trim(),
            },
          },
        });
        
        toast({
          title: 'Promo code applied!',
          description: `You saved £${validation.discount.toFixed(2)}`,
          status: 'success',
          duration: 3000,
        });
        
        setPromoCode('');
      } else {
        setPromoError(validation.error || 'Invalid promo code');
      }
    } catch (error) {
      setPromoError('Error applying promo code');
    } finally {
      setIsApplyingPromo(false);
    }
  }, [promoCode, pricing, pricingEngine, bookingData, formState.data, updateFormState, toast]);

  if (!bookingData.step1?.items?.length) {
    return (
      <Alert status="warning">
        <AlertIcon />
        Please complete the previous steps to see your booking summary.
      </Alert>
    );
  }

  return (
    <VStack spacing={6} align="stretch" maxW="4xl" mx="auto">
      {/* Header */}
      <Card>
        <CardHeader>
          <HStack>
            <Heading size="md">Booking Summary</Heading>
            <Spacer />
            <Badge colorScheme="blue" variant="subtle">
              Step 4 of 4
            </Badge>
          </HStack>
        </CardHeader>
      </Card>

      {/* Items Section */}
      <Card>
        <CardHeader>
          <HStack>
            <PackageIcon size={20} />
            <Heading size="sm">Items to Move</Heading>
            <Spacer />
            <Button
              size="sm"
              variant="ghost"
              leftIcon={<EditIcon size={16} />}
              onClick={() => onEdit(1)}
            >
              Edit Items
            </Button>
          </HStack>
        </CardHeader>
        <CardBody>
          <VStack spacing={3} align="stretch">
            {bookingData.step1.items.map((item) => (
              <EditableItem
                key={item.id}
                item={item}
                onUpdate={handleItemUpdate}
                onRemove={handleItemRemove}
              />
            ))}
            
            <Divider />
            
            <HStack justify="space-between">
              <Text fontWeight="medium">Total Volume:</Text>
              <Text fontWeight="bold" color="blue.600">
                {bookingData.step1.totalVolume?.toFixed(1) || '0.0'}m³
              </Text>
            </HStack>
          </VStack>
        </CardBody>
      </Card>

      {/* Addresses Section */}
      <Card>
        <CardHeader>
          <HStack>
            <MapPinIcon size={20} />
            <Heading size="sm">Addresses</Heading>
            <Spacer />
            <Button
              size="sm"
              variant="ghost"
              leftIcon={<EditIcon size={16} />}
              onClick={() => onEdit(2)}
            >
              Edit Addresses
            </Button>
          </HStack>
        </CardHeader>
        <CardBody>
          <VStack spacing={4} align="stretch">
            {bookingData.step2?.pickupAddress && (
              <EditableAddress
                address={bookingData.step2.pickupAddress}
                label="Pickup Address"
                onUpdate={(updates) => handleAddressUpdate('pickup', updates)}
              />
            )}
            
            {bookingData.step2?.dropoffAddress && (
              <EditableAddress
                address={bookingData.step2.dropoffAddress}
                label="Dropoff Address"
                onUpdate={(updates) => handleAddressUpdate('dropoff', updates)}
              />
            )}
            
            {bookingData.step2?.distance && (
              <HStack justify="space-between" pt={2}>
                <Text fontWeight="medium">Distance:</Text>
                <Text fontWeight="bold" color="blue.600">
                  {bookingData.step2.distance.toFixed(1)} km
                </Text>
              </HStack>
            )}
          </VStack>
        </CardBody>
      </Card>

      {/* Schedule & Service Section */}
      <Card>
        <CardHeader>
          <HStack>
            <CalendarIcon size={20} />
            <Heading size="sm">Schedule & Service</Heading>
            <Spacer />
            <Button
              size="sm"
              variant="ghost"
              leftIcon={<EditIcon size={16} />}
              onClick={() => onEdit(3)}
            >
              Edit Schedule
            </Button>
          </HStack>
        </CardHeader>
        <CardBody>
          <VStack spacing={4} align="stretch">
            {bookingData.step3?.date && (
              <HStack justify="space-between">
                <Text fontWeight="medium">Date:</Text>
                <Text fontWeight="bold">
                  {format(new Date(bookingData.step3.date), 'EEEE, MMMM d, yyyy')}
                </Text>
              </HStack>
            )}
            
            {bookingData.step3?.timeSlot && (
              <HStack justify="space-between">
                <Text fontWeight="medium">Time:</Text>
                <Text fontWeight="bold">
                  {bookingData.step3.timeSlot.startTime} - {bookingData.step3.timeSlot.endTime}
                </Text>
              </HStack>
            )}
            
            {bookingData.step3?.serviceType && (
              <HStack justify="space-between">
                <Text fontWeight="medium">Service:</Text>
                <VStack align="end" spacing={0}>
                  <Text fontWeight="bold">
                    {bookingData.step3.serviceType.name}
                  </Text>
                  <Text fontSize="sm" color="gray.600">
                    {bookingData.step3.serviceType.description}
                  </Text>
                </VStack>
              </HStack>
            )}
          </VStack>
        </CardBody>
      </Card>

      {/* Contact Details Section */}
      <Card>
        <CardHeader>
          <HStack>
            <UserIcon size={20} />
            <Heading size="sm">Contact Details</Heading>
          </HStack>
        </CardHeader>
        <CardBody>
          {bookingData.step4?.customer ? (
            <EditableCustomer
              customer={bookingData.step4.customer}
              onUpdate={handleCustomerUpdate}
            />
          ) : (
            <Alert status="info">
              <AlertIcon />
              Please complete your contact details to continue.
            </Alert>
          )}
        </CardBody>
      </Card>

      {/* Pricing Section */}
      {pricing && (
        <Card>
          <CardHeader>
            <HStack>
              <CreditCardIcon size={20} />
              <Heading size="sm">Pricing Breakdown</Heading>
            </HStack>
          </CardHeader>
          <CardBody>
            <VStack spacing={3} align="stretch">
              {/* Promo Code Input */}
              <HStack>
                <Input
                  placeholder="Enter promo code"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  size="sm"
                />
                <Button
                  size="sm"
                  colorScheme="blue"
                  onClick={handleApplyPromoCode}
                  isLoading={isApplyingPromo}
                  leftIcon={<DiscountIcon size={16} />}
                >
                  Apply
                </Button>
              </HStack>
              
              {promoError && (
                <Text fontSize="sm" color="red.500">
                  {promoError}
                </Text>
              )}

              <Divider />

              {/* Price Breakdown */}
              <VStack spacing={2} align="stretch">
                <HStack justify="space-between">
                  <Text>Base fee</Text>
                  <Text>£{pricing.basePrice.toFixed(2)}</Text>
                </HStack>
                
                <HStack justify="space-between">
                  <Text>Service charge</Text>
                  <Text>£{pricing.servicePrice.toFixed(2)}</Text>
                </HStack>
                
                <HStack justify="space-between">
                  <Text>Items & volume</Text>
                  <Text>£{pricing.itemsPrice.toFixed(2)}</Text>
                </HStack>
                
                <HStack justify="space-between">
                  <Text>Distance</Text>
                  <Text>£{pricing.distancePrice.toFixed(2)}</Text>
                </HStack>
                
                <HStack justify="space-between">
                  <Text>Time</Text>
                  <Text>£{pricing.timePrice.toFixed(2)}</Text>
                </HStack>

                {pricing.surcharges.map((surcharge, index) => (
                  <HStack key={index} justify="space-between">
                    <Text fontSize="sm" color="orange.600">
                      {surcharge.name}
                    </Text>
                    <Text fontSize="sm" color="orange.600">
                      £{surcharge.amount.toFixed(2)}
                    </Text>
                  </HStack>
                ))}

                {pricing.discounts.map((discount, index) => (
                  <HStack key={index} justify="space-between">
                    <Text fontSize="sm" color="green.600">
                      {discount.name}
                    </Text>
                    <Text fontSize="sm" color="green.600">
                      -£{discount.amount.toFixed(2)}
                    </Text>
                  </HStack>
                ))}

                <Divider />

                <HStack justify="space-between">
                  <Text fontWeight="medium">Subtotal</Text>
                  <Text fontWeight="medium">£{pricing.subtotal.toFixed(2)}</Text>
                </HStack>

                <HStack justify="space-between">
                  <Text fontSize="sm" color="gray.600">VAT (20%)</Text>
                  <Text fontSize="sm" color="gray.600">£{pricing.vat.toFixed(2)}</Text>
                </HStack>

                <Divider />

                <HStack justify="space-between">
                  <Text fontSize="lg" fontWeight="bold">Total</Text>
                  <Text fontSize="lg" fontWeight="bold" color="blue.600">
                    £{pricing.total.toFixed(2)}
                  </Text>
                </HStack>
              </VStack>
            </VStack>
          </CardBody>
        </Card>
      )}

      {/* Submit Button */}
      <Card>
        <CardBody>
          <VStack spacing={4}>
            <Button
              size="lg"
              colorScheme="blue"
              width="full"
              onClick={onSubmit}
              isLoading={isSubmitting}
              loadingText="Processing booking..."
              leftIcon={<CheckIcon size={20} />}
            >
              Confirm Booking
            </Button>
            
            <Text fontSize="sm" color="gray.600" textAlign="center">
              By confirming, you agree to our terms and conditions and privacy policy.
            </Text>
          </VStack>
        </CardBody>
      </Card>
    </VStack>
  );
};

export default LuxuryBookingSummary;

