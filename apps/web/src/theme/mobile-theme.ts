import { extendTheme, type ThemeConfig } from '@chakra-ui/react';

// Mobile-first breakpoints
const breakpoints = {
  base: '0px',      // Mobile first (320px+)
  sm: '360px',      // Small mobile (iPhone SE, etc.)
  md: '414px',      // Large mobile (iPhone 12 Pro, etc.)
  lg: '768px',      // Tablet
  xl: '1024px',     // Desktop
  '2xl': '1440px',  // Large desktop
};

// Mobile-optimized spacing scale
const space = {
  px: '1px',
  0.5: '0.125rem',  // 2px
  1: '0.25rem',     // 4px
  1.5: '0.375rem',  // 6px
  2: '0.5rem',      // 8px
  2.5: '0.625rem',  // 10px
  3: '0.75rem',     // 12px
  3.5: '0.875rem',  // 14px
  4: '1rem',        // 16px
  5: '1.25rem',     // 20px
  6: '1.5rem',      // 24px
  7: '1.75rem',     // 28px
  8: '2rem',        // 32px
  9: '2.25rem',     // 36px
  10: '2.5rem',     // 40px
  11: '2.75rem',    // 44px - Minimum touch target
  12: '3rem',       // 48px - Recommended touch target
  14: '3.5rem',     // 56px
  16: '4rem',       // 64px
  20: '5rem',       // 80px
  24: '6rem',       // 96px
  28: '7rem',       // 112px
  32: '8rem',       // 128px
  36: '9rem',       // 144px
  40: '10rem',      // 160px
  44: '11rem',      // 176px
  48: '12rem',      // 192px
  52: '13rem',      // 208px
  56: '14rem',      // 224px
  60: '15rem',      // 240px
  64: '16rem',      // 256px
  72: '18rem',      // 288px
  80: '20rem',      // 320px
  96: '24rem',      // 384px
};

// Mobile-optimized font sizes (iOS zoom prevention)
const fontSizes = {
  '2xs': '0.625rem',   // 10px
  xs: '0.75rem',       // 12px
  sm: '0.875rem',      // 14px
  md: '1rem',          // 16px - Minimum for iOS inputs
  lg: '1.125rem',      // 18px
  xl: '1.25rem',       // 20px
  '2xl': '1.5rem',     // 24px
  '3xl': '1.875rem',   // 30px
  '4xl': '2.25rem',    // 36px
  '5xl': '3rem',       // 48px
  '6xl': '3.75rem',    // 60px
  '7xl': '4.5rem',     // 72px
  '8xl': '6rem',       // 96px
  '9xl': '8rem',       // 128px
};

// Mobile-optimized line heights
const lineHeights = {
  normal: 'normal',
  none: 1,
  shorter: 1.25,
  short: 1.375,
  base: 1.5,
  tall: 1.625,
  taller: 2,
  3: '.75rem',
  4: '1rem',
  5: '1.25rem',
  6: '1.5rem',
  7: '1.75rem',
  8: '2rem',
  9: '2.25rem',
  10: '2.5rem',
};

// Mobile touch target sizes
const sizes = {
  ...space,
  max: 'max-content',
  min: 'min-content',
  full: '100%',
  '3xs': '14rem',
  '2xs': '16rem',
  xs: '20rem',
  sm: '24rem',
  md: '28rem',
  lg: '32rem',
  xl: '36rem',
  '2xl': '42rem',
  '3xl': '48rem',
  '4xl': '56rem',
  '5xl': '64rem',
  '6xl': '72rem',
  '7xl': '80rem',
  '8xl': '90rem',
  container: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
  },
  // Touch target sizes
  touchTarget: '2.75rem',      // 44px minimum
  touchTargetLg: '3rem',       // 48px recommended
  touchTargetXl: '3.5rem',     // 56px large
};

// Mobile-optimized colors with better contrast
const colors = {
  // Brand colors
  brand: {
    50: '#E6FFFA',
    100: '#B2F5EA',
    200: '#81E6D9',
    300: '#4FD1C7',
    400: '#38B2AC',
    500: '#319795',
    600: '#2C7A7B',
    700: '#285E61',
    800: '#234E52',
    900: '#1D4044',
  },
  
  // Neon accent colors
  neon: {
    50: '#E6F7FF',
    100: '#B3E5FF',
    200: '#80D4FF',
    300: '#4DC2FF',
    400: '#1AB0FF',
    500: '#00C2FF',    // Primary neon blue
    600: '#0099CC',
    700: '#007399',
    800: '#004D66',
    900: '#002633',
  },
  
  // Success colors
  success: {
    50: '#F0FFF4',
    100: '#C6F6D5',
    200: '#9AE6B4',
    300: '#68D391',
    400: '#48BB78',
    500: '#38A169',
    600: '#2F855A',
    700: '#276749',
    800: '#22543D',
    900: '#1C4532',
  },
  
  // Mobile-optimized grays with better contrast
  gray: {
    50: '#F9FAFB',
    100: '#F3F4F6',
    200: '#E5E7EB',
    300: '#D1D5DB',
    400: '#9CA3AF',
    500: '#6B7280',
    600: '#4B5563',
    700: '#374151',
    800: '#1F2937',
    900: '#111827',
  },
  
  // Dark mode colors
  dark: {
    50: '#F7FAFC',
    100: '#EDF2F7',
    200: '#E2E8F0',
    300: '#CBD5E0',
    400: '#A0AEC0',
    500: '#718096',
    600: '#4A5568',
    700: '#2D3748',
    800: '#1A202C',
    900: '#171923',
  },
  
  // Background colors
  bg: {
    canvas: '#0F1114',      // Main background
    card: '#1A1D23',        // Card background
    surface: '#242930',     // Surface background
    overlay: 'rgba(0, 0, 0, 0.8)',
  },
  
  // Border colors
  border: {
    primary: '#2D3748',
    secondary: '#4A5568',
    neon: '#00C2FF',
  },
  
  // Text colors
  text: {
    primary: '#F7FAFC',
    secondary: '#CBD5E0',
    tertiary: '#A0AEC0',
    muted: '#718096',
  },
};

// Mobile-optimized component styles
const components = {
  // Button component with touch targets
  Button: {
    baseStyle: {
      fontWeight: 'semibold',
      borderRadius: 'lg',
      _focus: {
        boxShadow: '0 0 0 3px rgba(0, 194, 255, 0.6)',
      },
      _active: {
        transform: 'scale(0.98)',
      },
    },
    sizes: {
      xs: {
        h: 8,
        minW: 8,
        fontSize: 'xs',
        px: 2,
      },
      sm: {
        h: 10,
        minW: 10,
        fontSize: 'sm',
        px: 3,
      },
      md: {
        h: 11,        // 44px - minimum touch target
        minW: 11,
        fontSize: 'md',
        px: 4,
      },
      lg: {
        h: 12,        // 48px - recommended touch target
        minW: 12,
        fontSize: 'lg',
        px: 6,
      },
      xl: {
        h: 14,        // 56px - large touch target
        minW: 14,
        fontSize: 'xl',
        px: 8,
      },
    },
    variants: {
      solid: {
        bg: 'neon.500',
        color: 'white',
        _hover: {
          bg: 'neon.600',
          transform: 'translateY(-2px)',
          boxShadow: '0 8px 25px rgba(0, 194, 255, 0.4)',
        },
        _active: {
          bg: 'neon.700',
          transform: 'translateY(0)',
        },
      },
      outline: {
        borderColor: 'border.primary',
        color: 'text.primary',
        _hover: {
          borderColor: 'neon.400',
          color: 'neon.400',
          bg: 'bg.surface',
        },
      },
      ghost: {
        color: 'text.secondary',
        _hover: {
          bg: 'bg.surface',
          color: 'text.primary',
        },
      },
    },
    defaultProps: {
      size: 'md',
      variant: 'solid',
    },
  },

  // Input component with iOS zoom prevention
  Input: {
    baseStyle: {
      field: {
        fontSize: 'md',      // 16px minimum for iOS
        borderRadius: 'lg',
        borderColor: 'border.primary',
        bg: 'bg.surface',
        color: 'text.primary',
        _placeholder: {
          color: 'text.tertiary',
        },
        _focus: {
          borderColor: 'neon.400',
          boxShadow: '0 0 0 1px var(--chakra-colors-neon-400)',
        },
        _hover: {
          borderColor: 'border.secondary',
        },
      },
    },
    sizes: {
      sm: {
        field: {
          h: 10,
          px: 3,
          fontSize: 'md',    // Still 16px for iOS
        },
      },
      md: {
        field: {
          h: 11,             // 44px touch target
          px: 4,
          fontSize: 'md',
        },
      },
      lg: {
        field: {
          h: 12,             // 48px touch target
          px: 4,
          fontSize: 'lg',
        },
      },
    },
    defaultProps: {
      size: 'md',
    },
  },

  // Card component
  Card: {
    baseStyle: {
      container: {
        bg: 'bg.card',
        borderRadius: '2xl',
        borderWidth: '2px',
        borderColor: 'border.primary',
        boxShadow: 'xl',
        overflow: 'hidden',
      },
      header: {
        p: { base: 4, md: 6 },
      },
      body: {
        p: { base: 4, md: 6 },
      },
      footer: {
        p: { base: 4, md: 6 },
      },
    },
  },

  // Container component with mobile-first approach
  Container: {
    baseStyle: {
      maxW: 'container.xl',
      px: { base: 4, sm: 6, lg: 8 },
    },
  },

  // Heading component with responsive sizing
  Heading: {
    baseStyle: {
      fontWeight: 'bold',
      lineHeight: 'shorter',
      color: 'text.primary',
    },
    sizes: {
      xs: {
        fontSize: { base: 'md', md: 'lg' },
      },
      sm: {
        fontSize: { base: 'lg', md: 'xl' },
      },
      md: {
        fontSize: { base: 'xl', md: '2xl' },
      },
      lg: {
        fontSize: { base: '2xl', md: '3xl' },
      },
      xl: {
        fontSize: { base: '3xl', md: '4xl' },
      },
      '2xl': {
        fontSize: { base: '4xl', md: '5xl' },
      },
    },
    defaultProps: {
      size: 'md',
    },
  },

  // Text component
  Text: {
    baseStyle: {
      color: 'text.secondary',
      lineHeight: 'base',
    },
  },

  // IconButton with proper touch targets
  IconButton: {
    baseStyle: {
      borderRadius: 'lg',
      _focus: {
        boxShadow: '0 0 0 3px rgba(0, 194, 255, 0.6)',
      },
    },
    sizes: {
      xs: {
        h: 8,
        w: 8,
        minW: 8,
      },
      sm: {
        h: 10,
        w: 10,
        minW: 10,
      },
      md: {
        h: 11,        // 44px touch target
        w: 11,
        minW: 11,
      },
      lg: {
        h: 12,        // 48px touch target
        w: 12,
        minW: 12,
      },
    },
    defaultProps: {
      size: 'md',
    },
  },

  // Modal with mobile optimizations
  Modal: {
    baseStyle: {
      dialog: {
        bg: 'bg.card',
        borderRadius: { base: 'none', md: '2xl' },
        mx: { base: 0, md: 4 },
        my: { base: 0, md: 16 },
        maxH: { base: '100vh', md: 'calc(100vh - 8rem)' },
      },
      header: {
        p: { base: 4, md: 6 },
        borderBottomWidth: '1px',
        borderColor: 'border.primary',
      },
      body: {
        p: { base: 4, md: 6 },
      },
      footer: {
        p: { base: 4, md: 6 },
        borderTopWidth: '1px',
        borderColor: 'border.primary',
      },
    },
    sizes: {
      xs: {
        dialog: { maxW: { base: '100vw', md: 'xs' } },
      },
      sm: {
        dialog: { maxW: { base: '100vw', md: 'sm' } },
      },
      md: {
        dialog: { maxW: { base: '100vw', md: 'md' } },
      },
      lg: {
        dialog: { maxW: { base: '100vw', md: 'lg' } },
      },
      xl: {
        dialog: { maxW: { base: '100vw', md: 'xl' } },
      },
      full: {
        dialog: { maxW: '100vw', h: '100vh' },
      },
    },
  },

  // Drawer for mobile navigation
  Drawer: {
    baseStyle: {
      dialog: {
        bg: 'bg.card',
      },
      header: {
        p: 4,
        borderBottomWidth: '1px',
        borderColor: 'border.primary',
      },
      body: {
        p: 4,
      },
      footer: {
        p: 4,
        borderTopWidth: '1px',
        borderColor: 'border.primary',
      },
    },
  },
};

// Theme configuration
const config: ThemeConfig = {
  initialColorMode: 'dark',
  useSystemColorMode: false,
  disableTransitionOnChange: false,
};

// Global styles with mobile optimizations
const styles = {
  global: {
    // CSS custom properties for safe area insets
    ':root': {
      '--safe-area-inset-top': 'env(safe-area-inset-top)',
      '--safe-area-inset-right': 'env(safe-area-inset-right)',
      '--safe-area-inset-bottom': 'env(safe-area-inset-bottom)',
      '--safe-area-inset-left': 'env(safe-area-inset-left)',
    },
    
    // Base styles
    'html, body': {
      bg: 'bg.canvas',
      color: 'text.primary',
      fontSize: 'md',
      lineHeight: 'base',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      // Prevent iOS zoom on input focus
      '-webkit-text-size-adjust': '100%',
      // Smooth scrolling
      scrollBehavior: 'smooth',
      // Better font rendering
      '-webkit-font-smoothing': 'antialiased',
      '-moz-osx-font-smoothing': 'grayscale',
    },
    
    // Remove default margins and paddings
    '*': {
      margin: 0,
      padding: 0,
      boxSizing: 'border-box',
    },
    
    // Better focus styles for accessibility
    '*:focus': {
      outline: 'none',
    },
    
    // Improve touch targets on mobile
    'button, [role="button"], input, select, textarea': {
      minHeight: { base: '44px', md: 'auto' },
      minWidth: { base: '44px', md: 'auto' },
    },
    
    // Prevent horizontal scroll
    'html, body, #__next': {
      overflowX: 'hidden',
      width: '100%',
    },
    
    // Safe area padding for iOS
    '.safe-area-top': {
      paddingTop: 'var(--safe-area-inset-top)',
    },
    '.safe-area-bottom': {
      paddingBottom: 'var(--safe-area-inset-bottom)',
    },
    '.safe-area-left': {
      paddingLeft: 'var(--safe-area-inset-left)',
    },
    '.safe-area-right': {
      paddingRight: 'var(--safe-area-inset-right)',
    },
    '.safe-area-all': {
      paddingTop: 'var(--safe-area-inset-top)',
      paddingRight: 'var(--safe-area-inset-right)',
      paddingBottom: 'var(--safe-area-inset-bottom)',
      paddingLeft: 'var(--safe-area-inset-left)',
    },
    
    // Reduce motion for users who prefer it
    '@media (prefers-reduced-motion: reduce)': {
      '*': {
        animationDuration: '0.01ms !important',
        animationIterationCount: '1 !important',
        transitionDuration: '0.01ms !important',
        scrollBehavior: 'auto !important',
      },
    },
    
    // High contrast mode support
    '@media (prefers-contrast: high)': {
      '*': {
        borderColor: 'currentColor !important',
      },
    },
    
    // Print styles
    '@media print': {
      '*': {
        background: 'white !important',
        color: 'black !important',
        boxShadow: 'none !important',
        textShadow: 'none !important',
      },
    },
  },
};

// Create and export the mobile-first theme
export const mobileTheme = extendTheme({
  config,
  breakpoints,
  space,
  sizes,
  fontSizes,
  lineHeights,
  colors,
  components,
  styles,
});

export default mobileTheme;

