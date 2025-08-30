'use client';

import React, { useState, useCallback, useEffect } from 'react';
import {
  Box,
  Container,
  VStack,
  HStack,
  Heading,
  Text,
  SimpleGrid,
  Card,
  Badge,
  Divider,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Collapse,
  useDisclosure,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import {
  FaMapMarkerAlt,
  FaHome,
  FaBuilding,
  FaWarehouse,
  FaBoxes,
  FaSearch,
  FaPlus,
  FaMinus,
  FaInfoCircle,
  FaChevronDown,
  FaChevronUp,
} from 'react-icons/fa';
import {
  MobileFormField,
  MobileInput,
  MobileSelect,
  MobileSwitch,
  TouchButton,
  TouchIconButton,
  QuantitySelector,
} from '@/components/mobile/TouchOptimizedComponents';
import { locationService, addressAutocompleteService } from '@/lib/location-services';

// Create motion components
const MotionBox = motion.create(Box);
const MotionCard = motion.create(Card);

// Mock items data (will be replaced with real data)
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
    popular: true,
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
    popular: true,
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
    popular: false,
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
    popular: true,
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
    popular: false,
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
    popular: true,
  },
  {
    id: '7',
    name: 'Mattress (Double)',
    category: 'Furniture',
    volume: 1.5,
    weight: 30,
    imageUrl: '/items/mattress-double.jpg',
    fragile: false,
    valuable: false,
    popular: true,
  },
  {
    id: '8',
    name: 'Desk Chair',
    category: 'Furniture',
    volume: 0.5,
    weight: 15,
    imageUrl: '/items/desk-chair.jpg',
    fragile: false,
    valuable: false,
    popular: false,
  },
];

// Property type options
const PROPERTY_TYPES = [
  { value: 'house', label: 'House' },
  { value: 'flat', label: 'Flat/Apartment' },
  { value: 'office', label: 'Office' },
  { value: 'storage', label: 'Storage Unit' },
  { value: 'other', label: 'Other' },
];

// Address autocomplete component
const MobileAddressInput: React.FC<{
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  error?: string;
  label: string;
}> = ({ value, onChange, placeholder, error, label }) => {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleInputChange = useCallback(async (inputValue: string) => {
    onChange(inputValue);
    
    if (inputValue.length > 2) {
      setIsLoading(true);
      setShowSuggestions(true);
      
      try {
        // Mock suggestions for now (will be replaced with real Mapbox API)
        const mockSuggestions = [
          `${inputValue} Street, London W1D 2HX`,
          `${inputValue} Road, Manchester M1 1AA`,
          `${inputValue} Avenue, Birmingham B1 1BB`,
          `${inputValue} Close, Leeds LS1 1CC`,
        ].filter(addr => addr.toLowerCase().includes(inputValue.toLowerCase()));
        
        setSuggestions(mockSuggestions);
      } catch (error) {
        console.error('Address search failed:', error);
        setSuggestions([]);
      } finally {
        setIsLoading(false);
      }
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [onChange]);

  const handleSuggestionSelect = (suggestion: string) => {
    onChange(suggestion);
    setSuggestions([]);
    setShowSuggestions(false);
  };

  return (
    <MobileFormField label={label} error={error}>
      <Box position="relative">
        <MobileInput
          value={value}
          onChange={handleInputChange}
          placeholder={placeholder}
          isInvalid={!!error}
          onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
        />
        
        {/* Current location button */}
        <TouchIconButton
          aria-label="Use current location"
          icon={<FaMapMarkerAlt />}
          position="absolute"
          right="2"
          top="50%"
          transform="translateY(-50%)"
          size="sm"
          variant="ghost"
          color="neon.400"
          onClick={async () => {
            try {
              setIsLoading(true);
              const location = await locationService.getCurrentLocation();
              if (location.address) {
                onChange(location.address);
              }
            } catch (error) {
              console.error('Failed to get current location:', error);
            } finally {
              setIsLoading(false);
            }
          }}
          zIndex={2}
        />
        
        {/* Suggestions dropdown */}
        {showSuggestions && suggestions.length > 0 && (
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
                onClick={() => handleSuggestionSelect(suggestion)}
                borderBottomWidth={index < suggestions.length - 1 ? "1px" : "0"}
                borderColor="border.primary"
              >
                <Text fontSize="sm" noOfLines={2}>
                  {suggestion}
                </Text>
              </Box>
            ))}
          </Box>
        )}
        
        {isLoading && (
          <Box
            position="absolute"
            right="12"
            top="50%"
            transform="translateY(-50%)"
          >
            <Text fontSize="xs" color="text.secondary">
              Searching...
            </Text>
          </Box>
        )}
      </Box>
    </MobileFormField>
  );
};

// Property details component
const PropertyDetails: React.FC<{
  title: string;
  propertyData: any;
  onChange: (updates: any) => void;
  error?: string;
}> = ({ title, propertyData, onChange, error }) => {
  const { isOpen, onToggle } = useDisclosure({ defaultIsOpen: false });

  return (
    <Card p={4} borderRadius="xl" borderWidth="2px" borderColor="border.primary" bg="bg.card">
      <VStack spacing={4} align="stretch">
        <TouchButton
          onClick={onToggle}
          variant="ghost"
          size="md"
          justifyContent="space-between"
          rightIcon={isOpen ? <FaChevronUp /> : <FaChevronDown />}
          fontWeight="bold"
          color="text.primary"
          _hover={{ bg: 'bg.surface' }}
        >
          {title} Details
        </TouchButton>

        <Collapse in={isOpen}>
          <VStack spacing={4} align="stretch">
            <MobileFormField label="Property Type">
              <MobileSelect
                value={propertyData.propertyType || ''}
                onChange={(value) => onChange({ propertyType: value })}
                options={PROPERTY_TYPES}
                placeholder="Select property type"
              />
            </MobileFormField>

            <SimpleGrid columns={2} spacing={3}>
              <MobileFormField label="Floor">
                <MobileInput
                  type="number"
                  value={propertyData.floor?.toString() || '0'}
                  onChange={(value) => onChange({ floor: parseInt(value) || 0 })}
                  placeholder="0"
                />
              </MobileFormField>

              <MobileFormField label="Has Lift?">
                <Box pt={2}>
                  <MobileSwitch
                    isChecked={propertyData.hasLift || false}
                    onChange={(checked) => onChange({ hasLift: checked })}
                  />
                </Box>
              </MobileFormField>
            </SimpleGrid>

            <MobileFormField label="Access Notes (Optional)">
              <MobileInput
                value={propertyData.accessNotes || ''}
                onChange={(value) => onChange({ accessNotes: value })}
                placeholder="e.g., Parking restrictions, narrow stairs..."
              />
            </MobileFormField>
          </VStack>
        </Collapse>
      </VStack>
    </Card>
  );
};

// Item picker component
const MobileItemPicker: React.FC<{
  selectedItems: any[];
  onItemsChange: (items: any[]) => void;
}> = ({ selectedItems, onItemsChange }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showAllItems, setShowAllItems] = useState(false);

  const categories = ['all', 'Furniture', 'Appliances', 'Electronics'];
  
  const filteredItems = MOCK_ITEMS.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Show popular items first, then all items if requested
  const displayItems = showAllItems 
    ? filteredItems 
    : filteredItems.filter(item => item.popular);

  const addItem = (item: typeof MOCK_ITEMS[0]) => {
    const existingItem = selectedItems.find(selected => selected.id === item.id);
    
    if (existingItem) {
      const updatedItems = selectedItems.map(selected =>
        selected.id === item.id
          ? { ...selected, quantity: selected.quantity + 1 }
          : selected
      );
      onItemsChange(updatedItems);
    } else {
      const newItem = { ...item, quantity: 1 };
      onItemsChange([...selectedItems, newItem]);
    }
  };

  const updateItemQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      onItemsChange(selectedItems.filter(item => item.id !== itemId));
    } else {
      const updatedItems = selectedItems.map(item =>
        item.id === itemId ? { ...item, quantity } : item
      );
      onItemsChange(updatedItems);
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
    <VStack spacing={4} align="stretch">
      {/* Search and filter */}
      <VStack spacing={3} align="stretch">
        <MobileFormField label="Search Items">
          <Box position="relative">
            <MobileInput
              placeholder="Search for items..."
              value={searchTerm}
              onChange={setSearchTerm}
              pl="40px"
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
        </MobileFormField>
        
        <MobileFormField label="Category">
          <MobileSelect
            value={selectedCategory}
            onChange={setSelectedCategory}
            options={categories.map(cat => ({
              value: cat,
              label: cat === 'all' ? 'All Categories' : cat
            }))}
          />
        </MobileFormField>
      </VStack>

      {/* Popular items header */}
      {!showAllItems && (
        <HStack justify="space-between" align="center">
          <Text fontSize="md" fontWeight="bold" color="text.primary">
            Popular Items
          </Text>
          <TouchButton
            size="sm"
            variant="ghost"
            color="neon.400"
            onClick={() => setShowAllItems(true)}
            rightIcon={<FaChevronDown />}
          >
            Show All
          </TouchButton>
        </HStack>
      )}

      {/* Items grid */}
      <SimpleGrid columns={2} spacing={3}>
        {displayItems.map(item => {
          const quantity = getItemQuantity(item.id);
          const isSelected = quantity > 0;

          return (
            <MotionCard
              key={item.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              p={3}
              borderRadius="lg"
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
              onClick={() => addItem(item)}
            >
              {/* Item image placeholder */}
              <Box
                w="full"
                h="80px"
                bg="bg.surface"
                borderRadius="md"
                mb={2}
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <FaBoxes size={24} color="var(--chakra-colors-text-secondary)" />
              </Box>

              {/* Item details */}
              <VStack spacing={1} align="start">
                <Text fontWeight="bold" fontSize="sm" noOfLines={2} lineHeight="1.2">
                  {item.name}
                </Text>
                
                <HStack spacing={1} wrap="wrap">
                  <Badge colorScheme="blue" size="xs">
                    {item.category}
                  </Badge>
                  {item.fragile && (
                    <Badge colorScheme="orange" size="xs">
                      Fragile
                    </Badge>
                  )}
                  {item.valuable && (
                    <Badge colorScheme="purple" size="xs">
                      Valuable
                    </Badge>
                  )}
                </HStack>

                <Text fontSize="xs" color="text.secondary">
                  {item.volume}m³ • {item.weight}kg
                </Text>
              </VStack>

              {/* Quantity controls */}
              {isSelected ? (
                <Box
                  position="absolute"
                  top="2"
                  right="2"
                  onClick={(e) => e.stopPropagation()}
                >
                  <QuantitySelector
                    value={quantity}
                    onChange={(newQuantity) => updateItemQuantity(item.id, newQuantity)}
                    min={0}
                    max={10}
                  />
                </Box>
              ) : (
                <TouchIconButton
                  aria-label="Add item"
                  icon={<FaPlus />}
                  position="absolute"
                  top="2"
                  right="2"
                  size="sm"
                  colorScheme="neon"
                  borderRadius="full"
                  onClick={(e) => {
                    e.stopPropagation();
                    addItem(item);
                  }}
                />
              )}
            </MotionCard>
          );
        })}
      </SimpleGrid>

      {/* Show more button */}
      {!showAllItems && filteredItems.length > displayItems.length && (
        <TouchButton
          variant="outline"
          borderColor="border.primary"
          color="text.primary"
          onClick={() => setShowAllItems(true)}
          rightIcon={<FaChevronDown />}
        >
          Show {filteredItems.length - displayItems.length} More Items
        </TouchButton>
      )}

      {/* Summary */}
      {selectedItems.length > 0 && (
        <Alert status="info" borderRadius="lg" bg="bg.surface" borderColor="neon.400">
          <AlertIcon color="neon.400" />
          <Box>
            <AlertTitle fontSize="sm">
              {selectedItems.length} item{selectedItems.length !== 1 ? 's' : ''} selected
            </AlertTitle>
            <AlertDescription fontSize="xs">
              Total: {getTotalVolume().toFixed(1)}m³ • {getTotalWeight()}kg
            </AlertDescription>
          </Box>
        </Alert>
      )}
    </VStack>
  );
};

// Main Step 1 component
const MobileStep1: React.FC<{
  bookingData: any;
  updateBookingData: (updates: any) => void;
  validationErrors: Record<string, string>;
  isLoading: boolean;
}> = ({ bookingData, updateBookingData, validationErrors, isLoading }) => {
  
  const handlePickupAddressChange = (address: string) => {
    updateBookingData({
      pickupAddress: {
        ...bookingData.pickupAddress,
        line1: address,
      }
    });
  };

  const handleDropoffAddressChange = (address: string) => {
    updateBookingData({
      dropoffAddress: {
        ...bookingData.dropoffAddress,
        line1: address,
      }
    });
  };

  const handlePickupPropertyChange = (updates: any) => {
    updateBookingData({
      pickupProperty: {
        ...bookingData.pickupProperty,
        ...updates,
      }
    });
  };

  const handleDropoffPropertyChange = (updates: any) => {
    updateBookingData({
      dropoffProperty: {
        ...bookingData.dropoffProperty,
        ...updates,
      }
    });
  };

  const handleItemsChange = (items: any[]) => {
    const totalVolume = items.reduce((sum, item) => sum + (item.volume * item.quantity), 0);
    const totalWeight = items.reduce((sum, item) => sum + ((item.weight || 0) * item.quantity), 0);
    
    updateBookingData({
      items,
      estimatedVolume: totalVolume,
      estimatedWeight: totalWeight,
    });
  };

  return (
    <Container maxW="container.sm" py={6}>
      <VStack spacing={6} align="stretch">
        {/* Header */}
        <MotionBox
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          textAlign="center"
        >
          <Heading size="lg" color="neon.500" mb={2}>
            📍 Where & What
          </Heading>
          <Text color="text.secondary" fontSize="md">
            Tell us your addresses and what you're moving
          </Text>
        </MotionBox>

        {/* Addresses Section */}
        <MotionBox
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card p={4} borderRadius="xl" borderWidth="2px" borderColor="border.primary" bg="bg.card">
            <VStack spacing={4} align="stretch">
              <Text fontSize="md" fontWeight="bold" color="text.primary">
                📍 Addresses
              </Text>
              
              <MobileAddressInput
                label="Pickup Address"
                value={bookingData.pickupAddress?.line1 || ''}
                onChange={handlePickupAddressChange}
                placeholder="Where should we collect from?"
                error={validationErrors.pickupAddress}
              />

              <MobileAddressInput
                label="Delivery Address"
                value={bookingData.dropoffAddress?.line1 || ''}
                onChange={handleDropoffAddressChange}
                placeholder="Where should we deliver to?"
                error={validationErrors.dropoffAddress}
              />
            </VStack>
          </Card>
        </MotionBox>

        {/* Property Details */}
        <MotionBox
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <VStack spacing={4} align="stretch">
            <PropertyDetails
              title="Pickup"
              propertyData={bookingData.pickupProperty || {}}
              onChange={handlePickupPropertyChange}
            />
            
            <PropertyDetails
              title="Delivery"
              propertyData={bookingData.dropoffProperty || {}}
              onChange={handleDropoffPropertyChange}
            />
          </VStack>
        </MotionBox>

        <Divider />

        {/* Items Section */}
        <MotionBox
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <VStack spacing={4} align="stretch">
            <VStack spacing={2} textAlign="center">
              <Heading size="md" color="text.primary">
                📦 What are you moving?
              </Heading>
              <Text color="text.secondary" fontSize="sm">
                Select items and we'll calculate volume automatically
              </Text>
            </VStack>

            <MobileItemPicker
              selectedItems={bookingData.items || []}
              onItemsChange={handleItemsChange}
            />

            {validationErrors.items && (
              <Alert status="error" borderRadius="lg">
                <AlertIcon />
                <AlertDescription fontSize="sm">
                  {validationErrors.items}
                </AlertDescription>
              </Alert>
            )}
          </VStack>
        </MotionBox>

        {/* Smart recommendations */}
        {bookingData.items && bookingData.items.length > 0 && (
          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Alert status="info" borderRadius="lg" bg="bg.surface" borderColor="neon.400">
              <AlertIcon color="neon.400" />
              <Box>
                <AlertTitle fontSize="sm">Smart Recommendation</AlertTitle>
                <AlertDescription fontSize="xs">
                  Based on your items ({bookingData.estimatedVolume?.toFixed(1)}m³), we recommend a{' '}
                  {(bookingData.estimatedVolume || 0) > 5
                    ? 'large van with 2 movers'
                    : 'standard van with 1 mover'
                  }.
                </AlertDescription>
              </Box>
            </Alert>
          </MotionBox>
        )}
      </VStack>
    </Container>
  );
};

export default MobileStep1;

