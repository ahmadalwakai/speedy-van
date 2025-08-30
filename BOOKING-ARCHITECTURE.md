# Booking Experience Architecture

## 🎯 Overview

This document outlines the architecture for the radical booking flow upgrade, designed to be blazing-fast, intuitive, and error-proof.

## 🏗️ System Architecture

### Core Principles
- **Mobile-first design** with progressive enhancement
- **Finite-state machine** for robust state management
- **Performance-first** with CLS < 0.05 and optimized loading
- **Accessibility-first** with WCAG 2.1 AA compliance
- **Error-proof** with comprehensive validation and recovery

### Technology Stack
- **Frontend**: Next.js 14 + React 18 + TypeScript
- **State Management**: XState (finite-state machine)
- **Validation**: Zod schemas with real-time validation
- **Styling**: Chakra UI + Custom mobile-first theme
- **Storage**: localStorage + sessionStorage for persistence
- **Testing**: Jest + React Testing Library + Playwright
- **Analytics**: Custom hooks with A/B testing support

## 📱 Booking Flow Stages

### Stage 1: Items Selection
**Route**: `/booking/items`
**Purpose**: One-tap item selection with instant volume/price preview

**Features**:
- One-tap add/remove with haptic feedback
- Quick quantity adjustments
- Search and category filtering
- Drag-to-reorder functionality
- Real-time volume calculation
- Instant price preview
- Popular items suggestions

**State Schema**:
```typescript
interface ItemsState {
  selectedItems: BookingItem[];
  searchQuery: string;
  selectedCategory: string;
  totalVolume: number;
  estimatedPrice: number;
  isLoading: boolean;
  errors: ValidationError[];
}
```

### Stage 2: Addresses
**Route**: `/booking/addresses`
**Purpose**: UK-only address autocomplete with postcode-first approach

**Features**:
- UK postcode validation and autocomplete
- Current location detection
- Address verification with Mapbox
- Elevator/floor options
- Distance and time estimation
- Interactive map preview
- Property type selection

**State Schema**:
```typescript
interface AddressesState {
  pickup: Address;
  dropoff: Address;
  distance: number;
  estimatedTime: number;
  mapData: MapData;
  isValidating: boolean;
  errors: ValidationError[];
}
```

### Stage 3: Schedule
**Route**: `/booking/schedule`
**Purpose**: Smart time slot selection with validation

**Features**:
- Smart time slot suggestions
- Travel time validation
- Blackout dates and holiday rules
- Timezone safety
- Weather considerations
- Availability checking
- Flexible vs exact timing

**State Schema**:
```typescript
interface ScheduleState {
  selectedDate: Date;
  selectedTimeSlot: TimeSlot;
  availableSlots: TimeSlot[];
  flexibility: 'exact' | 'flexible' | 'asap';
  weatherWarnings: WeatherAlert[];
  isLoading: boolean;
  errors: ValidationError[];
}
```

### Stage 4: Service Type
**Route**: `/booking/service`
**Purpose**: Clear service options with transparent pricing

**Features**:
- Concise service type choices
- Upfront fee display
- Transparent surcharge breakdown
- ETA calculations
- Service recommendations
- Add-on services
- Insurance options

**State Schema**:
```typescript
interface ServiceState {
  serviceType: ServiceType;
  addOns: AddOnService[];
  insurance: InsuranceOption;
  pricing: PricingBreakdown;
  eta: string;
  recommendations: ServiceRecommendation[];
  errors: ValidationError[];
}
```

### Stage 5: Contact
**Route**: `/booking/contact`
**Purpose**: Minimal contact form with smart autofill

**Features**:
- Minimal required fields
- One-tap autofill from browser/device
- Live validation with debouncing
- TOTP-ready phone verification
- Emergency contact options
- Communication preferences
- Marketing consent

**State Schema**:
```typescript
interface ContactState {
  customer: CustomerDetails;
  emergencyContact: EmergencyContact;
  preferences: CommunicationPreferences;
  isValidating: boolean;
  verificationStatus: VerificationStatus;
  errors: ValidationError[];
}
```

### Stage 6: Review
**Route**: `/booking/review`
**Purpose**: Final review with editable summaries

**Features**:
- Editable summary sections
- Detailed price breakdown
- Coupon/promo code application
- Deposit options
- Terms and conditions
- Final preflight checks
- Payment processing

**State Schema**:
```typescript
interface ReviewState {
  summary: BookingSummary;
  pricing: DetailedPricing;
  promoCode: string;
  deposit: DepositOption;
  paymentMethod: PaymentMethod;
  termsAccepted: boolean;
  isProcessing: boolean;
  errors: ValidationError[];
}
```

## 🔄 State Management Architecture

### Finite State Machine Design

```typescript
// Main booking machine states
type BookingState = 
  | 'idle'
  | 'items'
  | 'addresses' 
  | 'schedule'
  | 'service'
  | 'contact'
  | 'review'
  | 'processing'
  | 'success'
  | 'error';

// State transitions
const bookingMachine = createMachine({
  id: 'booking',
  initial: 'idle',
  context: {
    currentStep: 1,
    totalSteps: 6,
    data: {},
    errors: {},
    isLoading: false,
    lastSaved: null,
  },
  states: {
    idle: {
      on: {
        START: 'items'
      }
    },
    items: {
      on: {
        NEXT: 'addresses',
        SAVE_DRAFT: { actions: 'saveDraft' }
      }
    },
    // ... other states
  }
});
```

### Persistence Strategy

**localStorage**: Long-term draft storage
- Booking drafts (30 days retention)
- User preferences
- Recently used addresses

**sessionStorage**: Session-specific data
- Current booking state
- Temporary calculations
- Navigation history

**IndexedDB**: Offline support
- Cached item catalog
- Address suggestions
- Service availability

## 🎨 Component Architecture

### Atomic Design Structure

```
components/
├── atoms/
│   ├── Button/
│   ├── Input/
│   ├── Badge/
│   └── Icon/
├── molecules/
│   ├── ItemCard/
│   ├── AddressInput/
│   ├── TimeSlot/
│   └── PriceDisplay/
├── organisms/
│   ├── ItemSelector/
│   ├── AddressForm/
│   ├── SchedulePicker/
│   └── ReviewSummary/
└── templates/
    ├── BookingStep/
    ├── ProgressIndicator/
    └── NavigationBar/
```

### Performance Optimizations

**Code Splitting**:
```typescript
// Step-based code splitting
const ItemsStep = lazy(() => import('./steps/ItemsStep'));
const AddressesStep = lazy(() => import('./steps/AddressesStep'));
// ... other steps

// Feature-based splitting
const MapComponent = lazy(() => import('./components/Map'));
const PaymentForm = lazy(() => import('./components/PaymentForm'));
```

**Memoization Strategy**:
```typescript
// Expensive calculations
const totalPrice = useMemo(() => 
  calculateTotalPrice(items, distance, serviceType), 
  [items, distance, serviceType]
);

// Component memoization
const ItemCard = memo(({ item, onSelect }) => {
  // Component implementation
});
```

## 🔒 Validation Architecture

### Schema-based Validation (Zod)

```typescript
// Item selection schema
const itemsSchema = z.object({
  selectedItems: z.array(z.object({
    id: z.string(),
    quantity: z.number().min(1).max(10),
    volume: z.number().positive(),
  })).min(1, "Please select at least one item"),
  totalVolume: z.number().positive(),
});

// Address schema
const addressSchema = z.object({
  postcode: z.string().regex(/^[A-Z]{1,2}[0-9][A-Z0-9]? ?[0-9][A-Z]{2}$/i, "Invalid UK postcode"),
  addressLine1: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  coordinates: z.object({
    lat: z.number(),
    lng: z.number(),
  }),
});
```

### Real-time Validation

```typescript
// Debounced validation hook
const useValidation = (schema, data, delay = 300) => {
  const [errors, setErrors] = useState({});
  const [isValidating, setIsValidating] = useState(false);

  const debouncedValidate = useMemo(
    () => debounce(async (data) => {
      setIsValidating(true);
      try {
        await schema.parseAsync(data);
        setErrors({});
      } catch (error) {
        setErrors(formatZodErrors(error));
      } finally {
        setIsValidating(false);
      }
    }, delay),
    [schema, delay]
  );

  useEffect(() => {
    debouncedValidate(data);
  }, [data, debouncedValidate]);

  return { errors, isValidating };
};
```

## 🚀 Performance Targets

### Core Web Vitals
- **LCP (Largest Contentful Paint)**: < 2.5s
- **FID (First Input Delay)**: < 100ms
- **CLS (Cumulative Layout Shift)**: < 0.05

### Custom Metrics
- **Time to Interactive**: < 3s
- **Step Transition Time**: < 200ms
- **Form Validation Response**: < 100ms
- **API Response Time**: < 500ms

### Optimization Strategies

**Image Optimization**:
```typescript
// Next.js Image with proper sizing
<Image
  src={item.imageUrl}
  alt={item.name}
  width={200}
  height={150}
  sizes="(max-width: 768px) 100vw, 50vw"
  priority={index < 4} // Prioritize first 4 items
  placeholder="blur"
  blurDataURL="data:image/jpeg;base64,..."
/>
```

**Bundle Optimization**:
```typescript
// Dynamic imports for heavy libraries
const MapboxGL = dynamic(() => import('mapbox-gl'), {
  loading: () => <MapSkeleton />,
  ssr: false,
});
```

## ♿ Accessibility Architecture

### WCAG 2.1 AA Compliance

**Keyboard Navigation**:
- Tab order management
- Skip links for screen readers
- Arrow key navigation for grids
- Enter/Space activation

**Touch Targets**:
- Minimum 44px × 44px
- Adequate spacing (8px minimum)
- Clear focus indicators
- Haptic feedback on mobile

**Screen Reader Support**:
```typescript
// ARIA labels and descriptions
<button
  aria-label={`Add ${item.name} to booking`}
  aria-describedby={`${item.id}-description`}
  onClick={() => addItem(item)}
>
  Add Item
</button>

// Live regions for dynamic updates
<div aria-live="polite" aria-atomic="true">
  {totalItems} items selected, total volume: {totalVolume}m³
</div>
```

**Reduced Motion Support**:
```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

## 🧪 Testing Strategy

### Test Pyramid

**Unit Tests (Jest + RTL)**:
- Component rendering
- State management logic
- Validation functions
- Utility functions

**Integration Tests**:
- Step-to-step navigation
- State persistence
- API integration
- Form submissions

**E2E Tests (Playwright)**:
- Complete booking flows
- Error scenarios
- Mobile responsiveness
- Accessibility compliance

### Test Coverage Targets
- **Unit Tests**: > 90%
- **Integration Tests**: > 80%
- **E2E Tests**: 100% critical paths

## 📊 Analytics Architecture

### Event Tracking

```typescript
// Booking funnel events
enum BookingEvents {
  STEP_STARTED = 'booking_step_started',
  STEP_COMPLETED = 'booking_step_completed',
  ITEM_ADDED = 'booking_item_added',
  ADDRESS_VALIDATED = 'booking_address_validated',
  SLOT_SELECTED = 'booking_slot_selected',
  BOOKING_COMPLETED = 'booking_completed',
  ERROR_OCCURRED = 'booking_error_occurred',
}

// Analytics hook
const useAnalytics = () => {
  const trackEvent = useCallback((event: BookingEvents, properties: any) => {
    // Send to analytics service
    analytics.track(event, {
      ...properties,
      timestamp: Date.now(),
      sessionId: getSessionId(),
      userId: getUserId(),
    });
  }, []);

  return { trackEvent };
};
```

### A/B Testing Support

```typescript
// Feature flag hook
const useFeatureFlag = (flagName: string) => {
  const [isEnabled, setIsEnabled] = useState(false);
  
  useEffect(() => {
    const variant = getABTestVariant(flagName);
    setIsEnabled(variant === 'enabled');
  }, [flagName]);

  return isEnabled;
};

// Usage in components
const ItemsStep = () => {
  const showDragReorder = useFeatureFlag('drag_reorder_items');
  
  return (
    <div>
      {showDragReorder ? <DragReorderList /> : <StandardList />}
    </div>
  );
};
```

## 🔄 Error Handling & Recovery

### Error Boundaries

```typescript
class BookingErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Log error to monitoring service
    logError(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <ErrorRecoveryScreen error={this.state.error} />;
    }

    return this.props.children;
  }
}
```

### Retry Mechanisms

```typescript
// Retry hook for API calls
const useRetryableAPI = (apiCall, maxRetries = 3) => {
  const [state, setState] = useState({
    data: null,
    loading: false,
    error: null,
    retryCount: 0,
  });

  const execute = useCallback(async (...args) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        const data = await apiCall(...args);
        setState({ data, loading: false, error: null, retryCount: attempt });
        return data;
      } catch (error) {
        if (attempt === maxRetries) {
          setState(prev => ({ 
            ...prev, 
            loading: false, 
            error, 
            retryCount: attempt 
          }));
          throw error;
        }
        // Exponential backoff
        await new Promise(resolve => 
          setTimeout(resolve, Math.pow(2, attempt) * 1000)
        );
      }
    }
  }, [apiCall, maxRetries]);

  return { ...state, execute };
};
```

## 📁 File Structure

```
src/
├── components/
│   ├── booking/
│   │   ├── steps/
│   │   │   ├── ItemsStep/
│   │   │   ├── AddressesStep/
│   │   │   ├── ScheduleStep/
│   │   │   ├── ServiceStep/
│   │   │   ├── ContactStep/
│   │   │   └── ReviewStep/
│   │   ├── shared/
│   │   │   ├── ProgressIndicator/
│   │   │   ├── NavigationButtons/
│   │   │   └── ErrorBoundary/
│   │   └── BookingWizard.tsx
│   └── ui/ (reusable components)
├── hooks/
│   ├── useBookingState.ts
│   ├── useValidation.ts
│   ├── useAnalytics.ts
│   └── useFeatureFlag.ts
├── lib/
│   ├── booking/
│   │   ├── state-machine.ts
│   │   ├── validation.ts
│   │   ├── persistence.ts
│   │   └── analytics.ts
│   ├── api/
│   └── utils/
├── types/
│   ├── booking.ts
│   ├── api.ts
│   └── analytics.ts
└── tests/
    ├── unit/
    ├── integration/
    └── e2e/
```

## 🚀 Deployment Strategy

### Environment Configuration
- **Development**: Full debugging, mock APIs
- **Staging**: Production-like, real APIs, A/B testing
- **Production**: Optimized builds, monitoring, analytics

### Performance Monitoring
- **Core Web Vitals** tracking
- **Error rate** monitoring  
- **Conversion funnel** analysis
- **User experience** metrics

### Rollout Strategy
1. **Feature flags** for gradual rollout
2. **A/B testing** for UX variations
3. **Canary deployment** for risk mitigation
4. **Rollback procedures** for quick recovery

---

This architecture provides a solid foundation for building a world-class booking experience that is fast, accessible, and maintainable.

