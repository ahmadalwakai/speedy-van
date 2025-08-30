'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Button,
  IconButton,
  Input,
  Select,
  Textarea,
  Switch,
  Checkbox,
  Radio,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  FormControl,
  FormLabel,
  FormErrorMessage,
  HStack,
  VStack,
  Text,
  Badge,
  useToast,
  Flex,
} from '@chakra-ui/react';
import { motion, PanInfo } from 'framer-motion';
import {
  FaPlus,
  FaMinus,
  FaChevronDown,
  FaChevronUp,
  FaTimes,
  FaCheck,
  FaEye,
  FaEyeSlash,
} from 'react-icons/fa';

// Touch-optimized button with haptic feedback simulation
export const TouchButton: React.FC<{
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'solid' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  colorScheme?: string;
  isLoading?: boolean;
  isDisabled?: boolean;
  leftIcon?: React.ReactElement;
  rightIcon?: React.ReactElement;
  fullWidth?: boolean;
  [key: string]: any;
}> = ({
  children,
  onClick,
  variant = 'solid',
  size = 'md',
  colorScheme = 'neon',
  isLoading = false,
  isDisabled = false,
  leftIcon,
  rightIcon,
  fullWidth = false,
  ...props
}) => {
  const [isPressed, setIsPressed] = useState(false);

  const handleTouchStart = () => {
    setIsPressed(true);
    // Simulate haptic feedback
    if (navigator.vibrate) {
      navigator.vibrate(10);
    }
  };

  const handleTouchEnd = () => {
    setIsPressed(false);
  };

  return (
    <Button
      variant={variant}
      size={size}
      colorScheme={colorScheme}
      isLoading={isLoading}
      isDisabled={isDisabled}
      leftIcon={leftIcon}
      rightIcon={rightIcon}
      w={fullWidth ? 'full' : 'auto'}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleTouchStart}
      onMouseUp={handleTouchEnd}
      onMouseLeave={handleTouchEnd}
      onClick={onClick}
      transform={isPressed ? 'scale(0.98)' : 'scale(1)'}
      transition="transform 0.1s ease"
      {...props}
    >
      {children}
    </Button>
  );
};

// Touch-optimized icon button
export const TouchIconButton: React.FC<{
  'aria-label': string;
  icon: React.ReactElement;
  onClick?: () => void;
  variant?: 'solid' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  colorScheme?: string;
  isDisabled?: boolean;
  [key: string]: any;
}> = ({
  'aria-label': ariaLabel,
  icon,
  onClick,
  variant = 'ghost',
  size = 'md',
  colorScheme = 'gray',
  isDisabled = false,
  ...props
}) => {
  const [isPressed, setIsPressed] = useState(false);

  const handleTouchStart = () => {
    setIsPressed(true);
    if (navigator.vibrate) {
      navigator.vibrate(5);
    }
  };

  const handleTouchEnd = () => {
    setIsPressed(false);
  };

  return (
    <IconButton
      aria-label={ariaLabel}
      icon={icon}
      variant={variant}
      size={size}
      colorScheme={colorScheme}
      isDisabled={isDisabled}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleTouchStart}
      onMouseUp={handleTouchEnd}
      onMouseLeave={handleTouchEnd}
      onClick={onClick}
      transform={isPressed ? 'scale(0.95)' : 'scale(1)'}
      transition="transform 0.1s ease"
      {...props}
    />
  );
};

// Mobile-optimized input with iOS zoom prevention
export const MobileInput: React.FC<{
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  type?: string;
  isInvalid?: boolean;
  isDisabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  [key: string]: any;
}> = ({
  placeholder,
  value,
  onChange,
  type = 'text',
  isInvalid = false,
  isDisabled = false,
  size = 'md',
  ...props
}) => {
  return (
    <Input
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange?.(e.target.value)}
      type={type}
      isInvalid={isInvalid}
      isDisabled={isDisabled}
      size={size}
      fontSize="16px" // Prevent iOS zoom
      autoComplete="off"
      autoCorrect="off"
      autoCapitalize="off"
      spellCheck="false"
      {...props}
    />
  );
};

// Password input with show/hide toggle
export const MobilePasswordInput: React.FC<{
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  isInvalid?: boolean;
  isDisabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  [key: string]: any;
}> = ({
  placeholder = 'Enter password',
  value,
  onChange,
  isInvalid = false,
  isDisabled = false,
  size = 'md',
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <Box position="relative">
      <MobileInput
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        type={showPassword ? 'text' : 'password'}
        isInvalid={isInvalid}
        isDisabled={isDisabled}
        size={size}
        pr="48px"
        {...props}
      />
      <TouchIconButton
        aria-label={showPassword ? 'Hide password' : 'Show password'}
        icon={showPassword ? <FaEyeSlash /> : <FaEye />}
        position="absolute"
        right="2"
        top="50%"
        transform="translateY(-50%)"
        size="sm"
        onClick={() => setShowPassword(!showPassword)}
        zIndex={2}
      />
    </Box>
  );
};

// Mobile-optimized select with large touch targets
export const MobileSelect: React.FC<{
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  options: Array<{ value: string; label: string }>;
  isInvalid?: boolean;
  isDisabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  [key: string]: any;
}> = ({
  placeholder = 'Select option',
  value,
  onChange,
  options,
  isInvalid = false,
  isDisabled = false,
  size = 'md',
  ...props
}) => {
  return (
    <Select
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange?.(e.target.value)}
      isInvalid={isInvalid}
      isDisabled={isDisabled}
      size={size}
      fontSize="16px" // Prevent iOS zoom
      {...props}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </Select>
  );
};

// Touch-optimized textarea
export const MobileTextarea: React.FC<{
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  rows?: number;
  isInvalid?: boolean;
  isDisabled?: boolean;
  resize?: 'none' | 'both' | 'horizontal' | 'vertical';
  [key: string]: any;
}> = ({
  placeholder,
  value,
  onChange,
  rows = 4,
  isInvalid = false,
  isDisabled = false,
  resize = 'vertical',
  ...props
}) => {
  return (
    <Textarea
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange?.(e.target.value)}
      rows={rows}
      isInvalid={isInvalid}
      isDisabled={isDisabled}
      resize={resize}
      fontSize="16px" // Prevent iOS zoom
      minH="88px" // Ensure adequate touch area
      {...props}
    />
  );
};

// Touch-optimized switch with larger touch area
export const MobileSwitch: React.FC<{
  isChecked?: boolean;
  onChange?: (checked: boolean) => void;
  isDisabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  colorScheme?: string;
  children?: React.ReactNode;
  [key: string]: any;
}> = ({
  isChecked = false,
  onChange,
  isDisabled = false,
  size = 'lg',
  colorScheme = 'neon',
  children,
  ...props
}) => {
  return (
    <HStack spacing={3} align="center">
      <Switch
        isChecked={isChecked}
        onChange={(e) => onChange?.(e.target.checked)}
        isDisabled={isDisabled}
        size={size}
        colorScheme={colorScheme}
        {...props}
      />
      {children && (
        <Text fontSize="md" color="text.primary">
          {children}
        </Text>
      )}
    </HStack>
  );
};

// Touch-optimized checkbox
export const MobileCheckbox: React.FC<{
  isChecked?: boolean;
  onChange?: (checked: boolean) => void;
  isDisabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  colorScheme?: string;
  children?: React.ReactNode;
  [key: string]: any;
}> = ({
  isChecked = false,
  onChange,
  isDisabled = false,
  size = 'lg',
  colorScheme = 'neon',
  children,
  ...props
}) => {
  return (
    <Checkbox
      isChecked={isChecked}
      onChange={(e) => onChange?.(e.target.checked)}
      isDisabled={isDisabled}
      size={size}
      colorScheme={colorScheme}
      spacing={3}
      {...props}
    >
      {children && (
        <Text fontSize="md" color="text.primary">
          {children}
        </Text>
      )}
    </Checkbox>
  );
};

// Touch-optimized radio button
export const MobileRadio: React.FC<{
  value: string;
  isChecked?: boolean;
  onChange?: (value: string) => void;
  isDisabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  colorScheme?: string;
  children?: React.ReactNode;
  [key: string]: any;
}> = ({
  value,
  isChecked = false,
  onChange,
  isDisabled = false,
  size = 'lg',
  colorScheme = 'neon',
  children,
  ...props
}) => {
  return (
    <Radio
      value={value}
      isChecked={isChecked}
      onChange={() => onChange?.(value)}
      isDisabled={isDisabled}
      size={size}
      colorScheme={colorScheme}
      spacing={3}
      {...props}
    >
      {children && (
        <Text fontSize="md" color="text.primary">
          {children}
        </Text>
      )}
    </Radio>
  );
};

// Touch-optimized quantity selector
export const QuantitySelector: React.FC<{
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  isDisabled?: boolean;
}> = ({
  value,
  onChange,
  min = 0,
  max = 99,
  step = 1,
  isDisabled = false,
}) => {
  const handleDecrease = () => {
    const newValue = Math.max(min, value - step);
    onChange(newValue);
  };

  const handleIncrease = () => {
    const newValue = Math.min(max, value + step);
    onChange(newValue);
  };

  return (
    <HStack spacing={0} bg="bg.surface" borderRadius="lg" p={1}>
      <TouchIconButton
        aria-label="Decrease quantity"
        icon={<FaMinus />}
        size="md"
        variant="ghost"
        onClick={handleDecrease}
        isDisabled={isDisabled || value <= min}
        borderRadius="md"
      />
      
      <Box
        minW="60px"
        textAlign="center"
        py={2}
        px={3}
        fontSize="lg"
        fontWeight="bold"
        color="text.primary"
      >
        {value}
      </Box>
      
      <TouchIconButton
        aria-label="Increase quantity"
        icon={<FaPlus />}
        size="md"
        variant="ghost"
        onClick={handleIncrease}
        isDisabled={isDisabled || value >= max}
        borderRadius="md"
      />
    </HStack>
  );
};

// Swipeable card component
export const SwipeableCard: React.FC<{
  children: React.ReactNode;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  swipeThreshold?: number;
  [key: string]: any;
}> = ({
  children,
  onSwipeLeft,
  onSwipeRight,
  swipeThreshold = 100,
  ...props
}) => {
  const [dragX, setDragX] = useState(0);
  const constraintsRef = useRef(null);

  const handleDragEnd = (event: any, info: PanInfo) => {
    const { offset } = info;
    
    if (Math.abs(offset.x) > swipeThreshold) {
      if (offset.x > 0 && onSwipeRight) {
        onSwipeRight();
      } else if (offset.x < 0 && onSwipeLeft) {
        onSwipeLeft();
      }
    }
    
    setDragX(0);
  };

  return (
    <Box ref={constraintsRef} overflow="hidden" {...props}>
      <motion.div
        drag="x"
        dragConstraints={constraintsRef}
        dragElastic={0.2}
        onDrag={(event, info) => setDragX(info.offset.x)}
        onDragEnd={handleDragEnd}
        style={{
          x: dragX,
          opacity: 1 - Math.abs(dragX) / 300,
        }}
      >
        {children}
      </motion.div>
    </Box>
  );
};

// Touch-optimized slider
export const MobileSlider: React.FC<{
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  isDisabled?: boolean;
  colorScheme?: string;
  showValue?: boolean;
  [key: string]: any;
}> = ({
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  isDisabled = false,
  colorScheme = 'neon',
  showValue = true,
  ...props
}) => {
  return (
    <VStack spacing={2} align="stretch">
      {showValue && (
        <HStack justify="space-between">
          <Text fontSize="sm" color="text.secondary">
            {min}
          </Text>
          <Badge colorScheme={colorScheme} fontSize="sm" px={2} py={1}>
            {value}
          </Badge>
          <Text fontSize="sm" color="text.secondary">
            {max}
          </Text>
        </HStack>
      )}
      
      <Slider
        value={value}
        onChange={onChange}
        min={min}
        max={max}
        step={step}
        isDisabled={isDisabled}
        colorScheme={colorScheme}
        {...props}
      >
        <SliderTrack h="6px" borderRadius="full">
          <SliderFilledTrack />
        </SliderTrack>
        <SliderThumb boxSize="24px" borderWidth="2px" borderColor="white">
          <Box w="12px" h="12px" bg={`${colorScheme}.500`} borderRadius="full" />
        </SliderThumb>
      </Slider>
    </VStack>
  );
};

// Form field wrapper with touch-optimized layout
export const MobileFormField: React.FC<{
  label?: string;
  error?: string;
  isRequired?: boolean;
  children: React.ReactNode;
  [key: string]: any;
}> = ({
  label,
  error,
  isRequired = false,
  children,
  ...props
}) => {
  return (
    <FormControl isInvalid={!!error} isRequired={isRequired} {...props}>
      {label && (
        <FormLabel
          fontSize="md"
          fontWeight="medium"
          color="text.primary"
          mb={2}
        >
          {label}
          {isRequired && (
            <Text as="span" color="red.400" ml={1}>
              *
            </Text>
          )}
        </FormLabel>
      )}
      
      {children}
      
      {error && (
        <FormErrorMessage fontSize="sm" mt={2}>
          {error}
        </FormErrorMessage>
      )}
    </FormControl>
  );
};

// Touch-optimized tag selector
export const TouchTagSelector: React.FC<{
  options: Array<{ value: string; label: string; color?: string }>;
  selectedValues: string[];
  onChange: (values: string[]) => void;
  maxSelections?: number;
  isDisabled?: boolean;
}> = ({
  options,
  selectedValues,
  onChange,
  maxSelections,
  isDisabled = false,
}) => {
  const handleToggle = (value: string) => {
    if (selectedValues.includes(value)) {
      onChange(selectedValues.filter(v => v !== value));
    } else {
      if (maxSelections && selectedValues.length >= maxSelections) {
        return; // Don't allow more selections
      }
      onChange([...selectedValues, value]);
    }
  };

  return (
    <Flex wrap="wrap" gap={2}>
      {options.map((option) => {
        const isSelected = selectedValues.includes(option.value);
        const canSelect = !maxSelections || selectedValues.length < maxSelections || isSelected;

        return (
          <TouchButton
            key={option.value}
            size="sm"
            variant={isSelected ? 'solid' : 'outline'}
            colorScheme={option.color || 'neon'}
            onClick={() => handleToggle(option.value)}
            isDisabled={isDisabled || !canSelect}
            rightIcon={isSelected ? <FaCheck size={12} /> : undefined}
          >
            {option.label}
          </TouchButton>
        );
      })}
    </Flex>
  );
};

export {
  TouchButton as default,
  TouchIconButton,
  MobileInput,
  MobilePasswordInput,
  MobileSelect,
  MobileTextarea,
  MobileSwitch,
  MobileCheckbox,
  MobileRadio,
  QuantitySelector,
  SwipeableCard,
  MobileSlider,
  MobileFormField,
  TouchTagSelector,
};

