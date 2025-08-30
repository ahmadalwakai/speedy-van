'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Box,
  VStack,
  HStack,
  Heading,
  Text,
  Input,
  Button,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Select,
  Switch,
  Textarea,
  Badge,
  SimpleGrid,
  IconButton,
  Tooltip,
  Divider,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from '@chakra-ui/react';
import {
  FaMapMarkerAlt,
  FaHome,
  FaBuilding,
  FaWarehouse,
  FaPlus,
  FaMinus,
  FaInfoCircle,
  FaSearch,
  FaBoxes,
} from 'react-icons/fa';
import { useBooking } from '@/lib/booking-context';
import { step1Schema, Step1Data, ItemData } from '@/lib/booking-schemas';

// Mock items data (will be replaced with real data later)
const MOCK_ITEMS = [
  {
    id: '1',
    name: 'Sofa (2-seater)',
    category: 'Furniture',
    volume: 2.5,
    weight: 45,
    imageUrl: '/items/sofa-2-seater.jpg',
    fragile: false,
    valuable: false,
  },
  {
    id: '2',
    name: 'Dining Table',
    category: 'Furniture',
    volume: 1.8,
    weight: 35,
    imageUrl: '/items/dining-table.jpg',
    fragile: false,
    valuable: false,
  },
  {
    id: '3',
    name: 'Wardrobe (Large)',
    category: 'Furniture',
    volume: 4.2,
    weight: 80,
    imageUrl: '/items/wardrobe-large.jpg',
    fragile: false,
    valuable: false,
  },
  {
    id: '4',
    name: 'Washing Machine',
    category: 'Appliances',
    volume: 0.8,
    weight: 70,
    imageUrl: '/items/washing-machine.jpg',
    fragile: true,
    valuable: true,
  },
  {
    id: '5',
    name: 'Refrigerator',
    category: 'Appliances',
    volume: 1.2,
    weight: 85,
    imageUrl: '/items/refrigerator.jpg',
    fragile: true,
    valuable: true,
  },
  {
    id: '6',
    name: 'TV (55")',
    category: 'Electronics',
    volume: 0.3,
    weight: 25,
    imageUrl: '/items/tv-55.jpg',
    fragile: true,
    valuable: true,
  },
];

// Address autocomplete component (placeholder for Mapbox integration)
const AddressAutocomplete: React.FC<{
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  error?: string;
}> = ({ value, onChange, placeholder, error }) => {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Mock address suggestions (will be replaced with Mapbox API)
  const mockSuggestions = [
    '123 Oxford Street, London W1D 2HX',
    '456 Baker Street, London NW1 6XE',
    '789 King\'s Road, London SW3 4LY',
    '321 Regent Street, London W1B 2QD',
  ];

  const handleInputChange = useCallback((inputValue: string) => {
    onChange(inputValue);
    
    if (inputValue.length > 2) {
      setIsLoading(true);
      // Simulate API call delay
      setTimeout(() => {
        setSuggestions(
          mockSuggestions.filter(addr => 
            addr.toLowerCase().includes(inputValue.toLowerCase())
          )
        );
        setIsLoading(false);
      }, 300);
    } else {
      setSuggestions([]);
    }
  }, [onChange]);

  return (
    <Box position="relative">
      <Input
        value={value}
        onChange={(e) => handleInputChange(e.target.value)}
        placeholder={placeholder}
        size="lg"
        borderColor={error ? 'red.400' : 'border.primary'}
        _focus={{
          borderColor: 'neon.400',
          boxShadow: '0 0 0 1px var(--chakra-colors-neon-400)',
        }}
        _hover={{
          borderColor: 'neon.300',
        }}
      />
      
      {/* Suggestions dropdown */}
      {suggestions.length > 0 && (
        <Box
          position="absolute"
          top="100%"
          left="0"
          right="0"
          zIndex={10}
          bg="bg.card"
          borderWidth="1px"
          borderColor="border.primary"
          borderRadius="md"
          mt={1}
          maxH="200px"
          overflowY="auto"
          boxShadow="lg"
        >
          {suggestions.map((suggestion, index) => (
            <Box
              key={index}
              p={3}
              cursor="pointer"
              _hover={{ bg: 'bg.surface' }}
              onClick={() => {
                onChange(suggestion);
                setSuggestions([]);
              }}
            >
              <Text fontSize="sm">{suggestion}</Text>
            </Box>
          ))}
        </Box>
      )}
      
      {isLoading && (
        <Box
          position="absolute"
          right="3"
          top="50%"
          transform="translateY(-50%)"
        >
          <Text fontSize="sm" color="text.secondary">
            Searching...
          </Text>
        </Box>
      )}
    </Box>
  );
};

// Item picker component
const ItemPicker: React.FC<{
  selectedItems: ItemData[];
  onItemsChange: (items: ItemData[]) => void;
}> = ({ selectedItems, onItemsChange }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = ['all', 'Furniture', 'Appliances', 'Electronics'];
  
  const filteredItems = MOCK_ITEMS.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const addItem = (item: typeof MOCK_ITEMS[0]) => {
    const existingItem = selectedItems.find(selected => selected.id === item.id);
    
    if (existingItem) {
      // Increase quantity
      const updatedItems = selectedItems.map(selected =>
        selected.id === item.id
          ? { ...selected, quantity: selected.quantity + 1 }
          : selected
      );
      onItemsChange(updatedItems);
    } else {
      // Add new item
      const newItem: ItemData = {
        ...item,
        quantity: 1,
      };
      onItemsChange([...selectedItems, newItem]);
    }
  };

  const removeItem = (itemId: string) => {
    const existingItem = selectedItems.find(item => item.id === itemId);
    
    if (existingItem && existingItem.quantity > 1) {
      // Decrease quantity
      const updatedItems = selectedItems.map(item =>
        item.id === itemId
          ? { ...item, quantity: item.quantity - 1 }
          : item
      );
      onItemsChange(updatedItems);
    } else {
      // Remove item completely
      onItemsChange(selectedItems.filter(item => item.id !== itemId));
    }
  };

  const getItemQuantity = (itemId: string) => {
    const item = selectedItems.find(item => item.id === itemId);
    return item?.quantity || 0;
  };

  const getTotalVolume = () => {
    return selectedItems.reduce((total, item) => total + (item.volume * item.quantity), 0);
  };

  const getTotalWeight = () => {
    return selectedItems.reduce((total, item) => total + ((item.weight || 0) * item.quantity), 0);
  };

  return (
    <VStack spacing={6} align="stretch">
      {/* Search and filter */}
      <HStack spacing={4}>
        <Box flex={1} position="relative">
          <Input
            placeholder="Search items..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            size="lg"
            pl={10}
          />
          <Box
            position="absolute"
            left="3"
            top="50%"
            transform="translateY(-50%)"
            color="text.secondary"
          >
            <FaSearch />
          </Box>
        </Box>
        
        <Select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          size="lg"
          maxW="200px"
        >
          {categories.map(category => (
            <option key={category} value={category}>
              {category === 'all' ? 'All Categories' : category}
            </option>
          ))}
        </Select>
      </HStack>

      {/* Items grid */}
      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
        {filteredItems.map(item => {
          const quantity = getItemQuantity(item.id);
          const isSelected = quantity > 0;

          return (
            <motion.div
              key={item.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Box
                p={4}
                borderRadius="xl"
                borderWidth="2px"
                borderColor={isSelected ? 'neon.400' : 'border.primary'}
                bg={isSelected ? 'dark.800' : 'dark.700'}
                cursor="pointer"
                position="relative"
                transition="all 200ms"
                _hover={{
                  borderColor: 'neon.300',
                  boxShadow: '0 4px 12px rgba(0,194,255,0.2)',
                }}
              >
                {/* Item image placeholder */}
                <Box
                  w="full"
                  h="120px"
                  bg="bg.surface"
                  borderRadius="lg"
                  mb={3}
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  <FaBoxes size={32} color="var(--chakra-colors-text-secondary)" />
                </Box>

                {/* Item details */}
                <VStack spacing={2} align="start">
                  <Text fontWeight="bold" fontSize="md" noOfLines={1}>
                    {item.name}
                  </Text>
                  
                  <HStack spacing={2}>
                    <Badge colorScheme="blue" size="sm">
                      {item.category}
                    </Badge>
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

                  <HStack spacing={4} fontSize="sm" color="text.secondary">
                    <Text>{item.volume}m³</Text>
                    {item.weight && <Text>{item.weight}kg</Text>}
                  </HStack>
                </VStack>

                {/* Quantity controls */}
                {isSelected ? (
                  <HStack
                    position="absolute"
                    top="2"
                    right="2"
                    bg="neon.500"
                    borderRadius="full"
                    p={1}
                    spacing={1}
                  >
                    <IconButton
                      aria-label="Decrease quantity"
                      icon={<FaMinus />}
                      size="xs"
                      variant="ghost"
                      color="white"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeItem(item.id);
                      }}
                    />
                    <Text
                      color="white"
                      fontWeight="bold"
                      fontSize="sm"
                      minW="20px"
                      textAlign="center"
                    >
                      {quantity}
                    </Text>
                    <IconButton
                      aria-label="Increase quantity"
                      icon={<FaPlus />}
                      size="xs"
                      variant="ghost"
                      color="white"
                      onClick={(e) => {
                        e.stopPropagation();
                        addItem(item);
                      }}
                    />
                  </HStack>
                ) : (
                  <IconButton
                    aria-label="Add item"
                    icon={<FaPlus />}
                    position="absolute"
                    top="2"
                    right="2"
                    size="sm"
                    colorScheme="neon"
                    borderRadius="full"
                    onClick={() => addItem(item)}
                  />
                )}
              </Box>
            </motion.div>
          );
        })}
      </SimpleGrid>

      {/* Summary */}
      {selectedItems.length > 0 && (
        <Box
          p={4}
          bg="bg.surface"
          borderRadius="xl"
          borderWidth="1px"
          borderColor="border.primary"
        >
          <VStack spacing={3}>
            <HStack justify="space-between" w="full">
              <Text fontWeight="bold">Selected Items Summary</Text>
              <Badge colorScheme="neon" size="lg">
                {selectedItems.length} item{selectedItems.length !== 1 ? 's' : ''}
              </Badge>
            </HStack>
            
            <HStack justify="space-between" w="full">
              <Text>Total Volume:</Text>
              <Text fontWeight="bold" color="neon.400">
                {getTotalVolume().toFixed(1)}m³
              </Text>
            </HStack>
            
            <HStack justify="space-between" w="full">
              <Text>Total Weight:</Text>
              <Text fontWeight="bold" color="neon.400">
                {getTotalWeight().toFixed(0)}kg
              </Text>
            </HStack>
          </VStack>
        </Box>
      )}
    </VStack>
  );
};

// Main component
const WhereAndWhatStep: React.FC = () => {
  const { state, updateData } = useBooking();
  
  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<Step1Data>({
    resolver: zodResolver(step1Schema),
    defaultValues: {
      pickupAddress: state.data.pickupAddress || {
        line1: '',
        city: '',
        postcode: '',
      },
      dropoffAddress: state.data.dropoffAddress || {
        line1: '',
        city: '',
        postcode: '',
      },
      pickupProperty: state.data.pickupProperty || {
        propertyType: 'house',
        floor: 0,
        hasLift: false,
      },
      dropoffProperty: state.data.dropoffProperty || {
        propertyType: 'house',
        floor: 0,
        hasLift: false,
      },
      items: state.data.items || [],
      estimatedVolume: state.data.estimatedVolume || 0,
      estimatedWeight: state.data.estimatedWeight || 0,
      distance: state.data.distance || 0,
    },
  });

  const watchedItems = watch('items');

  // Update estimated volume and weight when items change
  useEffect(() => {
    const totalVolume = watchedItems.reduce((sum, item) => sum + (item.volume * item.quantity), 0);
    const totalWeight = watchedItems.reduce((sum, item) => sum + ((item.weight || 0) * item.quantity), 0);
    
    setValue('estimatedVolume', totalVolume);
    setValue('estimatedWeight', totalWeight);
  }, [watchedItems, setValue]);

  // Save form data to context on change
  useEffect(() => {
    const subscription = watch((data) => {
      updateData(data as Partial<Step1Data>);
    });
    return () => subscription.unsubscribe();
  }, [watch, updateData]);

  return (
    <Box p={{ base: 6, md: 8 }}>
      <VStack spacing={8} align="stretch">
        {/* Header */}
        <VStack spacing={3} textAlign="center">
          <Heading size="lg" color="neon.500">
            Where are we moving from and to?
          </Heading>
          <Text color="text.secondary" fontSize="lg">
            Tell us your pickup and delivery addresses, plus what you're moving
          </Text>
        </VStack>

        {/* Addresses Section */}
        <VStack spacing={6} align="stretch">
          <Heading size="md" color="text.primary">
            📍 Addresses
          </Heading>
          
          <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
            {/* Pickup Address */}
            <VStack spacing={4} align="stretch">
              <HStack>
                <FaMapMarkerAlt color="var(--chakra-colors-neon-400)" />
                <Text fontWeight="bold" fontSize="lg">
                  Pickup Address
                </Text>
              </HStack>
              
              <Controller
                name="pickupAddress.line1"
                control={control}
                render={({ field }) => (
                  <FormControl isInvalid={!!errors.pickupAddress?.line1}>
                    <FormLabel>Address</FormLabel>
                    <AddressAutocomplete
                      value={field.value || ''}
                      onChange={field.onChange}
                      placeholder="Start typing your pickup address..."
                      error={errors.pickupAddress?.line1?.message}
                    />
                    <FormErrorMessage>
                      {errors.pickupAddress?.line1?.message}
                    </FormErrorMessage>
                  </FormControl>
                )}
              />

              {/* Property Details */}
              <SimpleGrid columns={2} spacing={3}>
                <Controller
                  name="pickupProperty.propertyType"
                  control={control}
                  render={({ field }) => (
                    <FormControl>
                      <FormLabel fontSize="sm">Property Type</FormLabel>
                      <Select {...field} size="md">
                        <option value="house">House</option>
                        <option value="flat">Flat</option>
                        <option value="office">Office</option>
                        <option value="storage">Storage</option>
                        <option value="other">Other</option>
                      </Select>
                    </FormControl>
                  )}
                />

                <Controller
                  name="pickupProperty.floor"
                  control={control}
                  render={({ field }) => (
                    <FormControl>
                      <FormLabel fontSize="sm">Floor</FormLabel>
                      <Input
                        type="number"
                        min="0"
                        max="50"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                      />
                    </FormControl>
                  )}
                />
              </SimpleGrid>

              <Controller
                name="pickupProperty.hasLift"
                control={control}
                render={({ field }) => (
                  <FormControl display="flex" alignItems="center">
                    <FormLabel htmlFor="pickup-lift" mb="0" fontSize="sm">
                      Has lift/elevator?
                    </FormLabel>
                    <Switch
                      id="pickup-lift"
                      isChecked={field.value}
                      onChange={field.onChange}
                      colorScheme="neon"
                    />
                  </FormControl>
                )}
              />
            </VStack>

            {/* Dropoff Address */}
            <VStack spacing={4} align="stretch">
              <HStack>
                <FaMapMarkerAlt color="var(--chakra-colors-green-400)" />
                <Text fontWeight="bold" fontSize="lg">
                  Delivery Address
                </Text>
              </HStack>
              
              <Controller
                name="dropoffAddress.line1"
                control={control}
                render={({ field }) => (
                  <FormControl isInvalid={!!errors.dropoffAddress?.line1}>
                    <FormLabel>Address</FormLabel>
                    <AddressAutocomplete
                      value={field.value || ''}
                      onChange={field.onChange}
                      placeholder="Start typing your delivery address..."
                      error={errors.dropoffAddress?.line1?.message}
                    />
                    <FormErrorMessage>
                      {errors.dropoffAddress?.line1?.message}
                    </FormErrorMessage>
                  </FormControl>
                )}
              />

              {/* Property Details */}
              <SimpleGrid columns={2} spacing={3}>
                <Controller
                  name="dropoffProperty.propertyType"
                  control={control}
                  render={({ field }) => (
                    <FormControl>
                      <FormLabel fontSize="sm">Property Type</FormLabel>
                      <Select {...field} size="md">
                        <option value="house">House</option>
                        <option value="flat">Flat</option>
                        <option value="office">Office</option>
                        <option value="storage">Storage</option>
                        <option value="other">Other</option>
                      </Select>
                    </FormControl>
                  )}
                />

                <Controller
                  name="dropoffProperty.floor"
                  control={control}
                  render={({ field }) => (
                    <FormControl>
                      <FormLabel fontSize="sm">Floor</FormLabel>
                      <Input
                        type="number"
                        min="0"
                        max="50"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                      />
                    </FormControl>
                  )}
                />
              </SimpleGrid>

              <Controller
                name="dropoffProperty.hasLift"
                control={control}
                render={({ field }) => (
                  <FormControl display="flex" alignItems="center">
                    <FormLabel htmlFor="dropoff-lift" mb="0" fontSize="sm">
                      Has lift/elevator?
                    </FormLabel>
                    <Switch
                      id="dropoff-lift"
                      isChecked={field.value}
                      onChange={field.onChange}
                      colorScheme="neon"
                    />
                  </FormControl>
                )}
              />
            </VStack>
          </SimpleGrid>
        </VStack>

        <Divider />

        {/* Items Section */}
        <VStack spacing={6} align="stretch">
          <VStack spacing={3} textAlign="center">
            <Heading size="md" color="text.primary">
              📦 What are you moving?
            </Heading>
            <Text color="text.secondary">
              Select the items you need to move. We'll automatically calculate the volume and weight.
            </Text>
          </VStack>

          <Controller
            name="items"
            control={control}
            render={({ field }) => (
              <FormControl isInvalid={!!errors.items}>
                <ItemPicker
                  selectedItems={field.value}
                  onItemsChange={field.onChange}
                />
                <FormErrorMessage>
                  {errors.items?.message}
                </FormErrorMessage>
              </FormControl>
            )}
          />

          {/* Smart recommendations */}
          {watchedItems.length > 0 && (
            <Alert status="info" borderRadius="xl">
              <AlertIcon />
              <Box>
                <AlertTitle>Smart Recommendation</AlertTitle>
                <AlertDescription>
                  Based on your items, we recommend a{' '}
                  {watchedItems.reduce((sum, item) => sum + item.volume * item.quantity, 0) > 5
                    ? 'large van with 2 movers'
                    : 'standard van with 1 mover'
                  }. This will be automatically selected in the next step.
                </AlertDescription>
              </Box>
            </Alert>
          )}
        </VStack>
      </VStack>
    </Box>
  );
};

export default WhereAndWhatStep;

