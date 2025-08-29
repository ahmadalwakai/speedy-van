import React, { useState } from 'react';
import { 
  Box, 
  Text, 
  VStack, 
  HStack, 
  Input, 
  InputGroup,
  InputLeftElement,
  Button, 
  FormControl, 
  FormLabel, 
  FormErrorMessage,
  Divider,
  Icon,
  useToast,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  SimpleGrid,
  Badge,
  Flex,
  Spacer,
  useColorModeValue,
  Tooltip,
  InputRightElement,
  Collapse,
  useDisclosure
} from '@chakra-ui/react';
import { keyframes } from '@emotion/react';
import { 
  FaUser, 
  FaEnvelope, 
  FaPhone, 
  FaArrowRight, 
  FaArrowLeft, 
  FaShieldAlt, 
  FaCheckCircle,
  FaUserTie,
  FaInfoCircle,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaExclamationTriangle,
  FaQuestionCircle,
  FaStar,
  FaHeart,
  FaRocket,
  FaGem,
  FaCrown,
  FaBolt
} from 'react-icons/fa';
import EmailInputWithSuggestions from './EmailInputWithSuggestions';
import BookingNavigationButtons from './BookingNavigationButtons';
import { normalizeUK, isValidUKMobile } from '@/lib/phone';

interface CustomerDetailsStepProps {
  bookingData: any;
  updateBookingData: (data: any) => void;
  onNext?: () => void;
  onBack?: () => void;
}

export default function CustomerDetailsStep({ 
  bookingData, 
  updateBookingData, 
  onNext, 
  onBack 
}: CustomerDetailsStepProps) {
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [focusedField, setFocusedField] = useState<string>('');
  const [showPassword, setShowPassword] = useState(false);
  const [fieldHints, setFieldHints] = useState<{[key: string]: boolean}>({});
  const [hoveredField, setHoveredField] = useState<string>('');
  const toast = useToast();
  const { isOpen, onToggle } = useDisclosure();

  // Custom keyframe animations
  const pulse = keyframes`
    0% { transform: scale(1); opacity: 0.3; }
    50% { transform: scale(1.1); opacity: 0.6; }
    100% { transform: scale(1); opacity: 0.3; }
  `;

  const bounce = keyframes`
    0%, 20%, 53%, 80%, 100% { transform: translate3d(0,0,0); }
    40%, 43% { transform: translate3d(0,-8px,0); }
    70% { transform: translate3d(0,-4px,0); }
    90% { transform: translate3d(0,-2px,0); }
  `;

  const glow = keyframes`
    0%, 100% { box-shadow: 0 0 20px rgba(0,194,255,0.3); }
    50% { box-shadow: 0 0 30px rgba(0,194,255,0.6); }
  `;

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};

    // Validate name
    if (!bookingData.customer?.name?.trim()) {
      newErrors.name = 'Full name is required';
    } else if (bookingData.customer.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    } else if (bookingData.customer.name.trim().length > 50) {
      newErrors.name = 'Name must be less than 50 characters';
    }

    // Validate email
    if (!bookingData.customer?.email?.trim()) {
      newErrors.email = 'Email address is required';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(bookingData.customer.email.trim())) {
        newErrors.email = 'Please enter a valid email address';
      }
    }

    // Validate phone
    if (!bookingData.customer?.phone?.trim()) {
      newErrors.phone = 'Phone number is required';
    } else {
      const phoneRegex = /^(\+44|0)[1-9]\d{8,9}$/;
      if (!phoneRegex.test(bookingData.customer.phone.trim().replace(/\s/g, ''))) {
        newErrors.phone = 'Please enter a valid UK phone number';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateForm()) {
      onNext?.();
    } else {
      toast({
        title: 'Please fill in all required fields correctly',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const updateCustomerField = (field: string, value: string) => {
    updateBookingData({
      customer: {
        ...bookingData.customer,
        [field]: value
      }
    });
  };

  const formatPhoneNumber = (value: string) => {
    // Remove all non-digit characters
    const digits = value.replace(/\D/g, '');
    
    // Format UK phone number for display
    if (digits.startsWith('44')) {
      return `+${digits.slice(0, 2)} ${digits.slice(2, 6)} ${digits.slice(6, 9)} ${digits.slice(9)}`;
    } else if (digits.startsWith('0')) {
      return `${digits.slice(0, 4)} ${digits.slice(4, 7)} ${digits.slice(7)}`;
    }
    
    return value;
  };

  const handlePhoneChange = (value: string) => {
    const formatted = formatPhoneNumber(value);
    updateCustomerField('phone', formatted);
  };

  const getFieldStatus = (field: string) => {
    if (errors[field]) return 'error';
    if (bookingData.customer?.[field]?.trim()) return 'success';
    return 'neutral';
  };

  const getFieldIcon = (field: string) => {
    const status = getFieldStatus(field);
    switch (status) {
      case 'success':
        return <FaCheckCircle color="#00D18F" />;
      case 'error':
        return <FaExclamationTriangle color="#EF4444" />;
      default:
        switch (field) {
          case 'name':
            return <FaUser />;
          case 'email':
            return <FaEnvelope />;
          case 'phone':
            return <FaPhone />;
          default:
            return <FaUser />;
        }
    }
  };

  const getFieldColor = (field: string) => {
    const status = getFieldStatus(field);
    switch (status) {
      case 'success':
        return 'brand.500';
      case 'error':
        return 'error.500';
      default:
        return 'text.tertiary';
    }
  };

  const getFieldHint = (field: string) => {
    switch (field) {
      case 'name':
        return 'Enter your full legal name as it appears on official documents';
      case 'email':
        return 'We\'ll use this to send booking confirmations and updates';
      case 'phone':
        return 'Enter a UK mobile or landline number for urgent contact';
      default:
        return '';
    }
  };

  const isFormComplete = () => {
    return bookingData.customer?.name?.trim() && 
           bookingData.customer?.email?.trim() && 
           bookingData.customer?.phone?.trim();
  };

  const getCharacterCount = (field: string) => {
    const value = bookingData.customer?.[field] || '';
    const maxLength = field === 'name' ? 50 : 100;
    return { current: value.length, max: maxLength };
  };

  const isFieldValid = (field: string) => {
    const value = bookingData.customer?.[field] || '';
    if (field === 'name') {
      return value.length >= 2 && value.length <= 50;
    } else if (field === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(value);
    } else if (field === 'phone') {
      // Use the phone validation utility
      return isValidUKMobile(value.replace(/\s/g, ''));
    }
    return false;
  };

  const getFieldIconWithAnimation = (field: string) => {
    const status = getFieldStatus(field);
    const isHovered = hoveredField === field;
    
    let icon;
    switch (field) {
      case 'name':
        icon = status === 'success' ? FaCrown : FaUser;
        break;
      case 'email':
        icon = status === 'success' ? FaGem : FaEnvelope;
        break;
      case 'phone':
        icon = status === 'success' ? FaStar : FaPhone;
        break;
      default:
        icon = FaUser;
    }

    return (
      <Icon 
        as={icon} 
        color={getFieldColor(field)}
        boxSize={5}
        transition="all 300ms"
        transform={isHovered ? 'scale(1.2) rotate(5deg)' : 'scale(1) rotate(0deg)'}
        filter={status === 'success' ? 'drop-shadow(0 0 8px currentColor)' : 'none'}
        animation={status === 'success' ? `${glow} 2s ease-in-out infinite` : 'none'}
      />
    );
  };

  return (
    <Box p={6} borderWidth="1px" borderRadius="xl" bg="bg.card" borderColor="border.primary" boxShadow="md" className="booking-step-card">
      <VStack spacing={8} align="stretch">
        {/* Enhanced Header with Animated Icons */}
        <Box textAlign="center">
          <VStack spacing={4}>
            {/* Animated Main Icon */}
            <Box
              position="relative"
              p={4}
              borderRadius="full"
              bg="linear-gradient(135deg, rgba(0,194,255,0.1), rgba(0,209,143,0.1))"
              borderWidth="2px"
              borderColor="neon.500"
              animation={isFormComplete() ? `${pulse} 2s infinite` : 'none'}
            >
              <Icon 
                as={FaUserTie} 
                color="neon.500" 
                boxSize={10}
                filter="drop-shadow(0 0 12px rgba(0,194,255,0.6))"
                transition="all 300ms"
                _hover={{
                  transform: 'scale(1.1) rotate(5deg)',
                  filter: 'drop-shadow(0 0 20px rgba(0,194,255,0.8))'
                }}
              />
              
              {/* Floating Icons */}
              {isFormComplete() && (
                <>
                  <Icon
                    as={FaBolt}
                    position="absolute"
                    top="-8px"
                    right="-8px"
                    color="brand.500"
                    boxSize={4}
                    animation={`${bounce} 1.5s ease-in-out infinite`}
                  />
                  <Icon
                    as={FaStar}
                    position="absolute"
                    bottom="-8px"
                    left="-8px"
                    color="neon.500"
                    boxSize={3}
                    animation={`${bounce} 1.5s ease-in-out infinite 0.5s`}
                  />
                </>
              )}
            </Box>
            
            <VStack spacing={2}>
              <Text fontSize="2xl" fontWeight="bold" color="neon.500">
                Step 5: Customer Details
              </Text>
              <Text fontSize="md" color="text.secondary">
                Please provide your contact information for the move
              </Text>
            </VStack>
          </VStack>
        </Box>

        {/* Enhanced Progress Indicator with Icons */}
        <Box>
          <HStack spacing={6} justify="center" mb={8}>
            {['name', 'email', 'phone'].map((field, index) => (
              <VStack key={field} spacing={3} position="relative">
                {/* Progress Icon */}
                <Box
                  position="relative"
                  p={3}
                  borderRadius="full"
                  bg={getFieldStatus(field) === 'success' ? 'brand.500' : 'bg.surface'}
                  borderWidth="2px"
                  borderColor={getFieldStatus(field) === 'success' ? 'brand.500' : 'border.primary'}
                  transition="all 300ms"
                  _hover={{
                    transform: 'scale(1.1)',
                    borderColor: getFieldStatus(field) === 'success' ? 'brand.400' : 'neon.400'
                  }}
                  cursor="pointer"
                  onClick={() => setHoveredField(hoveredField === field ? '' : field)}
                >
                  {getFieldIconWithAnimation(field)}
                  
                  {/* Success Ring Animation */}
                  {getFieldStatus(field) === 'success' && (
                    <Box
                      position="absolute"
                      top="-4px"
                      left="-4px"
                      right="-4px"
                      bottom="-4px"
                      borderRadius="full"
                      borderWidth="2px"
                      borderColor="brand.500"
                      opacity="0.6"
                      animation={`${pulse} 2s infinite`}
                    />
                  )}
                </Box>
                
                {/* Field Label */}
                <Text 
                  fontSize="sm" 
                  color="text.tertiary" 
                  textTransform="capitalize"
                  fontWeight="medium"
                  transition="all 200ms"
                  _hover={{
                    color: getFieldStatus(field) === 'success' ? 'brand.400' : 'neon.400'
                  }}
                >
                  {field}
                </Text>
                
                {/* Connection Line */}
                {index < 2 && (
                  <Box
                    position="absolute"
                    top="50%"
                    right="-30px"
                    w="30px"
                    h="2px"
                    bg={getFieldStatus(field) === 'success' ? 'brand.500' : 'border.primary'}
                    transition="all 300ms"
                    _before={{
                      content: '""',
                      position: 'absolute',
                      top: '50%',
                      right: '0',
                      w: '8px',
                      h: '8px',
                      borderRadius: 'full',
                      bg: 'currentColor',
                      transform: 'translate(50%, -50%)',
                      opacity: getFieldStatus(field) === 'success' ? 1 : 0.3
                    }}
                  />
                )}
              </VStack>
            ))}
          </HStack>
        </Box>

        {/* Contact Form with Enhanced Icons */}
        <Box>
          <HStack spacing={4} mb={8} justify="center">
            <Box
              p={2}
              borderRadius="full"
              bg="linear-gradient(135deg, rgba(0,209,143,0.1), rgba(0,194,255,0.1))"
              borderWidth="1px"
              borderColor="brand.500"
            >
              <Icon as={FaUser} color="brand.500" boxSize={6} />
            </Box>
            <Text fontSize="lg" fontWeight="semibold" color="brand.500">
              Contact Information
            </Text>
          </HStack>
          
          <VStack spacing={8}>
            {/* Name Field */}
            <FormControl isInvalid={!!errors.name}>
              <FormLabel fontSize="md" color="text.primary" mb={4}>
                <HStack spacing={3}>
                  <Text>Full Name</Text>
                  <Tooltip label={getFieldHint('name')} placement="top">
                    <Icon 
                      as={FaQuestionCircle} 
                      color="text.tertiary" 
                      cursor="help"
                      transition="all 200ms"
                      _hover={{
                        color: 'neon.500',
                        transform: 'scale(1.1)'
                      }}
                    />
                  </Tooltip>
                </HStack>
              </FormLabel>
              
              <InputGroup size="lg">
                <Input
                  placeholder="Enter your full legal name (e.g., John Michael Smith)"
                  value={bookingData.customer?.name || ''}
                  onChange={(e) => updateCustomerField('name', e.target.value)}
                  onFocus={() => setFocusedField('name')}
                  onBlur={() => setFocusedField('')}
                  onMouseEnter={() => setHoveredField('name')}
                  onMouseLeave={() => setHoveredField('')}
                  maxLength={50}
                  _focus={{
                    borderColor: getFieldStatus('name') === 'error' ? 'error.500' : 'neon.500',
                    boxShadow: getFieldStatus('name') === 'error' ? '0 0 20px rgba(239,68,68,0.3)' : '0 0 20px rgba(0,194,255,0.3)',
                    transform: 'scale(1.02)',
                  }}
                  _hover={{
                    borderColor: getFieldStatus('name') === 'error' ? 'error.400' : 'neon.400',
                    transform: 'translateY(-1px)',
                  }}
                  transition="all 300ms ease"
                  borderWidth="2px"
                  borderRadius="xl"
                  bg="bg.input"
                  _placeholder={{
                    color: 'text.tertiary',
                    opacity: 0.8,
                    fontSize: 'sm'
                  }}
                  fontSize="md"
                  fontWeight="medium"
                />
                <InputRightElement>
                  <Text fontSize="xs" color="text.tertiary" fontWeight="medium">
                    {getCharacterCount('name').current}/{getCharacterCount('name').max}
                  </Text>
                </InputRightElement>
              </InputGroup>
              <FormErrorMessage textAlign="center" fontSize="sm" fontWeight="medium">{errors.name}</FormErrorMessage>
              
              {/* Enhanced Character count indicator */}
              <HStack justify="space-between" mt={3}>
                <Text fontSize="xs" color="text.tertiary" fontWeight="medium">
                  {getCharacterCount('name').current < 2 ? '⚠️ Name must be at least 2 characters' : 
                   getCharacterCount('name').current > 40 ? '⚠️ Consider shortening your name' : 
                   '✅ Name length is perfect'}
                </Text>
                <Box
                  w="full"
                  maxW="120px"
                  h="3px"
                  bg="border.primary"
                  borderRadius="full"
                  overflow="hidden"
                  position="relative"
                >
                  <Box
                    h="full"
                    bg={getFieldStatus('name') === 'success' ? 'brand.500' : 'neon.500'}
                    w={`${(getCharacterCount('name').current / getCharacterCount('name').max) * 100}%`}
                    transition="width 500ms ease"
                    borderRadius="full"
                    position="relative"
                    _after={{
                      content: '""',
                      position: 'absolute',
                      top: '0',
                      right: '0',
                      width: '2px',
                      height: '100%',
                      bg: 'white',
                      opacity: 0.8
                    }}
                  />
                </Box>
              </HStack>
            </FormControl>

            {/* Email Field */}
            <FormControl isInvalid={!!errors.email}>
              <FormLabel fontSize="md" color="text.primary" mb={4}>
                <HStack spacing={3}>
                  <Text>Email Address</Text>
                  <Tooltip label={getFieldHint('email')} placement="top">
                    <Icon 
                      as={FaQuestionCircle} 
                      color="text.tertiary" 
                      cursor="help"
                      transition="all 200ms"
                      _hover={{
                        color: 'neon.500',
                        transform: 'scale(1.1)'
                      }}
                    />
                  </Tooltip>
                </HStack>
              </FormLabel>
              
              <EmailInputWithSuggestions
                value={bookingData.customer?.email || ''}
                onChange={(value) => updateCustomerField('email', value)}
                placeholder="Enter your email address (e.g., john.smith@company.com)"
                isInvalid={!!errors.email}
                size="lg"
              />
              <FormErrorMessage textAlign="center" fontSize="sm" fontWeight="medium">{errors.email}</FormErrorMessage>
              
              {/* Enhanced Email validation indicator */}
              {bookingData.customer?.email && (
                <Box mt={3} p={3} bg="bg.surface" borderRadius="lg" borderWidth="1px" borderColor="border.primary">
                  <HStack spacing={3} justify="center">
                    <Icon 
                      as={isFieldValid('email') ? FaCheckCircle : FaExclamationTriangle} 
                      color={isFieldValid('email') ? 'brand.500' : 'error.500'} 
                      boxSize={5} 
                    />
                    <Text fontSize="sm" color={isFieldValid('email') ? 'brand.500' : 'error.500'} fontWeight="medium">
                      {isFieldValid('email') ? '✅ Valid email format detected' : '❌ Please check your email format'}
                    </Text>
                  </HStack>
                  {isFieldValid('email') && (
                    <Text fontSize="xs" color="text.tertiary" textAlign="center" mt={2}>
                      We'll send booking confirmations to this address
                    </Text>
                  )}
                </Box>
              )}
            </FormControl>

            {/* Phone Field */}
            <FormControl isInvalid={!!errors.phone}>
              <FormLabel fontSize="md" color="text.primary" mb={4}>
                <HStack spacing={3}>
                  <Text>Phone Number</Text>
                  <Tooltip label={getFieldHint('phone')} placement="top">
                    <Icon 
                      as={FaQuestionCircle} 
                      color="text.tertiary" 
                      cursor="help"
                      transition="all 200ms"
                      _hover={{
                        color: 'neon.500',
                        transform: 'scale(1.1)'
                      }}
                    />
                  </Tooltip>
                </HStack>
              </FormLabel>
              
              <InputGroup size="lg">
                <Input
                  type="tel"
                  placeholder="Enter UK phone number (e.g., 07123 456789 or +44 7123 456789)"
                  value={bookingData.customer?.phone || ''}
                  onChange={(e) => handlePhoneChange(e.target.value)}
                  onFocus={() => setFocusedField('phone')}
                  onBlur={() => setFocusedField('')}
                  onMouseEnter={() => setHoveredField('phone')}
                  onMouseLeave={() => setHoveredField('')}
                  _focus={{
                    borderColor: getFieldStatus('phone') === 'error' ? 'error.500' : 'neon.500',
                    boxShadow: getFieldStatus('phone') === 'error' ? '0 0 20px rgba(239,68,68,0.3)' : '0 0 20px rgba(0,194,255,0.3)',
                    transform: 'scale(1.02)',
                  }}
                  _hover={{
                    borderColor: getFieldStatus('phone') === 'error' ? 'error.400' : 'neon.400',
                    transform: 'translateY(-1px)',
                  }}
                  transition="all 300ms ease"
                  borderWidth="2px"
                  borderRadius="xl"
                  bg="bg.input"
                  _placeholder={{
                    color: 'text.tertiary',
                    opacity: 0.8,
                    fontSize: 'sm'
                  }}
                  fontSize="md"
                  fontWeight="medium"
                />
              </InputGroup>
              <FormErrorMessage textAlign="center" fontSize="sm" fontWeight="medium">{errors.phone}</FormErrorMessage>
              
              {/* Enhanced Phone format examples */}
              <Box mt={3} p={4} bg="bg.surface" borderRadius="lg" borderWidth="1px" borderColor="border.primary">
                <HStack spacing={3} mb={3}>
                  <Icon as={FaPhone} color="neon.500" boxSize={4} />
                  <Text fontSize="sm" color="text.tertiary" fontWeight="medium">
                    📱 Accepted UK Phone Formats:
                  </Text>
                </HStack>
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={3}>
                  <Box p={2} bg="bg.card" borderRadius="md" borderWidth="1px" borderColor="border.primary">
                    <Text fontSize="xs" color="text.secondary" fontWeight="medium">• Mobile: 07123 456789</Text>
                  </Box>
                  <Box p={2} bg="bg.card" borderRadius="md" borderWidth="1px" borderColor="border.primary">
                    <Text fontSize="xs" color="text.secondary" fontWeight="medium">• International: +44 7123 456789</Text>
                  </Box>
                  <Box p={2} bg="bg.card" borderRadius="md" borderWidth="1px" borderColor="border.primary">
                    <Text fontSize="xs" color="text.secondary" fontWeight="medium">• Landline: 020 7946 0958</Text>
                  </Box>
                  <Box p={2} bg="bg.card" borderRadius="md" borderWidth="1px" borderColor="border.primary">
                    <Text fontSize="xs" color="text.secondary" fontWeight="medium">• Int'l Landline: +44 20 7946 0958</Text>
                  </Box>
                </SimpleGrid>
                <Text fontSize="xs" color="text.tertiary" mt={3} textAlign="center" fontStyle="italic">
                  We'll use this for urgent contact during your move
                </Text>
              </Box>
            </FormControl>
          </VStack>
        </Box>

        <Divider />

        {/* Enhanced Privacy Notice with Interactive Icons */}
        <Box 
          p={6} 
          borderWidth="1px" 
          borderRadius="xl" 
          bg="bg.surface" 
          borderColor="border.primary"
          position="relative"
          overflow="hidden"
          cursor="pointer"
          onClick={onToggle}
          _hover={{
            borderColor: 'neon.400',
            transform: 'translateY(-2px)',
            boxShadow: 'lg'
          }}
          transition="all 300ms"
        >
          {/* Background Pattern */}
          <Box
            position="absolute"
            top="0"
            left="0"
            right="0"
            bottom="0"
            bg="linear-gradient(135deg, rgba(0,194,255,0.05), rgba(0,209,143,0.05))"
            borderRadius="xl"
            zIndex={0}
          />
          
          <HStack spacing={4} position="relative" zIndex={1}>
            <Box
              p={3}
              borderRadius="full"
              bg="linear-gradient(135deg, rgba(0,194,255,0.2), rgba(0,209,143,0.2))"
              borderWidth="2px"
              borderColor="neon.500"
              transition="all 300ms"
              _hover={{
                transform: 'scale(1.1) rotate(5deg)',
                borderColor: 'neon.400'
              }}
            >
              <Icon as={FaShieldAlt} color="neon.500" boxSize={6} />
            </Box>
            <Box flex={1}>
              <HStack justify="space-between" align="center" mb={3}>
                <Text fontSize="lg" fontWeight="semibold" color="text.primary">
                  🔒 Privacy & Security
                </Text>
                <Icon 
                  as={isOpen ? FaEyeSlash : FaEye} 
                  color="neon.500" 
                  boxSize={5}
                  transition="all 300ms"
                  transform={isOpen ? 'rotate(180deg)' : 'rotate(0deg)'}
                  _hover={{
                    transform: isOpen ? 'rotate(180deg) scale(1.1)' : 'rotate(0deg) scale(1.1)',
                    color: 'neon.400'
                  }}
                />
              </HStack>
              <Text fontSize="sm" color="text.secondary" lineHeight="1.6">
                Your contact information is encrypted and will only be used to communicate about your move. 
                We never share your data with third parties.
              </Text>
            </Box>
          </HStack>
          
          {/* Expandable content */}
          <Collapse in={isOpen} animateOpacity>
            <Box mt={4} pt={4} borderTopWidth="1px" borderTopColor="border.primary">
              <VStack spacing={4} align="stretch">
                <HStack spacing={3}>
                  <Icon as={FaLock} color="brand.500" boxSize={5} />
                  <Text fontSize="sm" color="text.primary" fontWeight="medium">
                    🔐 Data Protection Details:
                  </Text>
                </HStack>
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                  <Box 
                    p={4} 
                    bg="bg.card" 
                    borderRadius="lg" 
                    borderWidth="1px" 
                    borderColor="border.primary"
                    transition="all 200ms"
                    _hover={{
                      transform: 'translateY(-2px)',
                      borderColor: 'brand.400',
                      boxShadow: 'md'
                    }}
                  >
                    <HStack spacing={3}>
                      <Icon as={FaLock} color="brand.500" boxSize={5} />
                      <Text fontSize="sm" color="text.secondary">End-to-end encryption</Text>
                    </HStack>
                  </Box>
                  <Box 
                    p={4} 
                    bg="bg.card" 
                    borderRadius="lg" 
                    borderWidth="1px" 
                    borderColor="border.primary"
                    transition="all 200ms"
                    _hover={{
                      transform: 'translateY(-2px)',
                      borderColor: 'neon.400',
                      boxShadow: 'md'
                    }}
                  >
                    <HStack spacing={3}>
                      <Icon as={FaShieldAlt} color="neon.500" boxSize={5} />
                      <Text fontSize="sm" color="text.secondary">GDPR compliant</Text>
                    </HStack>
                  </Box>
                  <Box 
                    p={4} 
                    bg="bg.card" 
                    borderRadius="lg" 
                    borderWidth="1px" 
                    borderColor="border.primary"
                    transition="all 200ms"
                    _hover={{
                      transform: 'translateY(-2px)',
                      borderColor: 'brand.400',
                      boxShadow: 'md'
                    }}
                  >
                    <HStack spacing={3}>
                      <Icon as={FaUserTie} color="brand.500" boxSize={5} />
                      <Text fontSize="sm" color="text.secondary">Professional handling</Text>
                    </HStack>
                  </Box>
                  <Box 
                    p={4} 
                    bg="bg.card" 
                    borderRadius="lg" 
                    borderWidth="1px" 
                    borderColor="border.primary"
                    transition="all 200ms"
                    _hover={{
                      transform: 'translateY(-2px)',
                      borderColor: 'neon.400',
                      boxShadow: 'md'
                    }}
                  >
                    <HStack spacing={3}>
                      <Icon as={FaCheckCircle} color="neon.500" boxSize={5} />
                      <Text fontSize="sm" color="text.secondary">Secure storage</Text>
                    </HStack>
                  </Box>
                </SimpleGrid>
              </VStack>
            </Box>
          </Collapse>
        </Box>

        {/* Enhanced Summary */}
        {isFormComplete() && (
          <Box 
            p={6} 
            borderWidth="1px" 
            borderRadius="xl" 
            bg="bg.surface" 
            borderColor="border.primary"
            position="relative"
            overflow="hidden"
          >
            {/* Background Pattern */}
            <Box
              position="absolute"
              top="0"
              left="0"
              right="0"
              bottom="0"
              bg="linear-gradient(135deg, rgba(0,194,255,0.05), rgba(0,209,143,0.05))"
              borderRadius="xl"
              zIndex={0}
            />
            
            <VStack spacing={4} position="relative" zIndex={1}>
              <HStack spacing={3}>
                <Box
                  p={2}
                  borderRadius="full"
                  bg="brand.500"
                  animation={`${bounce} 1s ease-in-out infinite`}
                >
                  <Icon as={FaCheckCircle} color="white" boxSize={5} />
                </Box>
                <Text fontSize="lg" fontWeight="semibold" color="brand.500">
                  ✅ Contact Summary Complete
                </Text>
              </HStack>
              
              <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4} w="full">
                {bookingData.customer?.name && (
                  <Box 
                    p={4} 
                    bg="bg.card" 
                    borderRadius="lg" 
                    borderWidth="1px" 
                    borderColor="border.primary"
                    transition="all 200ms"
                    _hover={{
                      transform: 'translateY(-2px)',
                      borderColor: 'brand.400',
                      boxShadow: 'md'
                    }}
                  >
                    <VStack spacing={3}>
                      <HStack>
                        <Icon as={FaCrown} color="brand.500" boxSize={5} />
                        <Text fontWeight="medium" color="text.primary" fontSize="sm">Name</Text>
                      </HStack>
                      <Text fontSize="sm" color="text.secondary" textAlign="center" fontWeight="medium">
                        {bookingData.customer.name}
                      </Text>
                    </VStack>
                  </Box>
                )}
                
                {bookingData.customer?.email && (
                  <Box 
                    p={4} 
                    bg="bg.card" 
                    borderRadius="lg" 
                    borderWidth="1px" 
                    borderColor="border.primary"
                    transition="all 200ms"
                    _hover={{
                      transform: 'translateY(-2px)',
                      borderColor: 'neon.400',
                      boxShadow: 'md'
                    }}
                  >
                    <VStack spacing={3}>
                      <HStack>
                        <Icon as={FaGem} color="neon.500" boxSize={5} />
                        <Text fontWeight="medium" color="text.primary" fontSize="sm">Email</Text>
                      </HStack>
                      <Text fontSize="sm" color="text.secondary" textAlign="center" fontWeight="medium">
                        {bookingData.customer.email}
                      </Text>
                    </VStack>
                  </Box>
                )}
                
                {bookingData.customer?.phone && (
                  <Box 
                    p={4} 
                    bg="bg.card" 
                    borderRadius="lg" 
                    borderWidth="1px" 
                    borderColor="border.primary"
                    transition="all 200ms"
                    _hover={{
                      transform: 'translateY(-2px)',
                      borderColor: 'neon.400',
                      boxShadow: 'md'
                    }}
                  >
                    <VStack spacing={3}>
                      <HStack>
                        <Icon as={FaStar} color="neon.500" boxSize={5} />
                        <Text fontWeight="medium" color="text.primary" fontSize="sm">Phone</Text>
                      </HStack>
                      <Text fontSize="sm" color="text.secondary" textAlign="center" fontWeight="medium">
                        {bookingData.customer.phone}
                      </Text>
                    </VStack>
                  </Box>
                )}
              </SimpleGrid>
              
              {/* Completion Badge */}
              <Badge 
                colorScheme="brand" 
                variant="outline" 
                size="lg" 
                mt={2}
                p={3}
                borderRadius="full"
                borderWidth="2px"
                transition="all 200ms"
                _hover={{
                  transform: 'scale(1.05)',
                  borderColor: 'brand.400'
                }}
              >
                <HStack spacing={2}>
                  <Icon as={FaRocket} color="brand.500" boxSize={4} />
                  <Text>All fields completed successfully!</Text>
                </HStack>
              </Badge>
            </VStack>
          </Box>
        )}

        {/* Navigation Buttons */}
        <BookingNavigationButtons
          onNext={handleNext}
          onBack={onBack}
          nextText="Continue to Crew Selection"
          nextDisabled={!isFormComplete()}
          backVariant="secondary"
        />
      </VStack>
    </Box>
  );
}
