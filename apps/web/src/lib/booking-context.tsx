'use client';

import React, { createContext, useContext, useReducer, useCallback, useEffect } from 'react';
import { BookingFormData, defaultBookingData, validateStep } from './booking-schemas';

// Booking state interface
interface BookingState {
  currentStep: number;
  data: Partial<BookingFormData>;
  errors: Record<string, string[]> | null;
  isLoading: boolean;
  isDraftSaved: boolean;
  lastSavedAt: Date | null;
  analytics: {
    stepStartTimes: Record<number, Date>;
    stepCompletionTimes: Record<number, Date>;
    totalTimeSpent: number;
    abandonmentPoints: string[];
  };
}

// Action types
type BookingAction =
  | { type: 'SET_STEP'; payload: number }
  | { type: 'UPDATE_DATA'; payload: Partial<BookingFormData> }
  | { type: 'SET_ERRORS'; payload: Record<string, string[]> | null }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SAVE_DRAFT'; payload: { data: Partial<BookingFormData>; timestamp: Date } }
  | { type: 'LOAD_DRAFT'; payload: Partial<BookingFormData> }
  | { type: 'CLEAR_DRAFT' }
  | { type: 'TRACK_STEP_START'; payload: number }
  | { type: 'TRACK_STEP_COMPLETION'; payload: number }
  | { type: 'TRACK_ABANDONMENT'; payload: string }
  | { type: 'RESET_BOOKING' };

// Initial state
const initialState: BookingState = {
  currentStep: 1,
  data: defaultBookingData,
  errors: null,
  isLoading: false,
  isDraftSaved: false,
  lastSavedAt: null,
  analytics: {
    stepStartTimes: {},
    stepCompletionTimes: {},
    totalTimeSpent: 0,
    abandonmentPoints: [],
  },
};

// Reducer function
const bookingReducer = (state: BookingState, action: BookingAction): BookingState => {
  switch (action.type) {
    case 'SET_STEP':
      return {
        ...state,
        currentStep: action.payload,
        errors: null, // Clear errors when moving to new step
      };

    case 'UPDATE_DATA':
      return {
        ...state,
        data: { ...state.data, ...action.payload },
        isDraftSaved: false, // Mark as unsaved when data changes
      };

    case 'SET_ERRORS':
      return {
        ...state,
        errors: action.payload,
      };

    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      };

    case 'SAVE_DRAFT':
      return {
        ...state,
        data: action.payload.data,
        isDraftSaved: true,
        lastSavedAt: action.payload.timestamp,
      };

    case 'LOAD_DRAFT':
      return {
        ...state,
        data: { ...defaultBookingData, ...action.payload },
        isDraftSaved: true,
      };

    case 'CLEAR_DRAFT':
      return {
        ...state,
        data: defaultBookingData,
        isDraftSaved: false,
        lastSavedAt: null,
      };

    case 'TRACK_STEP_START':
      return {
        ...state,
        analytics: {
          ...state.analytics,
          stepStartTimes: {
            ...state.analytics.stepStartTimes,
            [action.payload]: new Date(),
          },
        },
      };

    case 'TRACK_STEP_COMPLETION':
      const startTime = state.analytics.stepStartTimes[action.payload];
      const completionTime = new Date();
      const timeSpent = startTime ? completionTime.getTime() - startTime.getTime() : 0;

      return {
        ...state,
        analytics: {
          ...state.analytics,
          stepCompletionTimes: {
            ...state.analytics.stepCompletionTimes,
            [action.payload]: completionTime,
          },
          totalTimeSpent: state.analytics.totalTimeSpent + timeSpent,
        },
      };

    case 'TRACK_ABANDONMENT':
      return {
        ...state,
        analytics: {
          ...state.analytics,
          abandonmentPoints: [...state.analytics.abandonmentPoints, action.payload],
        },
      };

    case 'RESET_BOOKING':
      return {
        ...initialState,
        analytics: {
          stepStartTimes: {},
          stepCompletionTimes: {},
          totalTimeSpent: 0,
          abandonmentPoints: [],
        },
      };

    default:
      return state;
  }
};

// Context interface
interface BookingContextType {
  state: BookingState;
  dispatch: React.Dispatch<BookingAction>;
  
  // Helper functions
  goToStep: (step: number) => void;
  nextStep: () => Promise<boolean>;
  prevStep: () => void;
  updateData: (data: Partial<BookingFormData>) => void;
  validateCurrentStep: () => Promise<boolean>;
  saveDraft: () => Promise<void>;
  loadDraft: () => Promise<void>;
  clearDraft: () => void;
  resetBooking: () => void;
  
  // Analytics functions
  trackStepStart: (step: number) => void;
  trackStepCompletion: (step: number) => void;
  trackAbandonment: (point: string) => void;
  getAnalytics: () => BookingState['analytics'];
}

// Create context
const BookingContext = createContext<BookingContextType | undefined>(undefined);

// Draft storage keys
const DRAFT_STORAGE_KEY = 'speedy-van-booking-draft';
const DRAFT_TIMESTAMP_KEY = 'speedy-van-booking-draft-timestamp';

// Provider component
export const BookingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(bookingReducer, initialState);

  // Load draft on mount
  useEffect(() => {
    loadDraft();
  }, []);

  // Auto-save draft every 30 seconds if there are changes
  useEffect(() => {
    if (!state.isDraftSaved && Object.keys(state.data).length > 0) {
      const timer = setTimeout(() => {
        saveDraft();
      }, 30000); // 30 seconds

      return () => clearTimeout(timer);
    }
  }, [state.data, state.isDraftSaved]);

  // Helper functions
  const goToStep = useCallback((step: number) => {
    if (step >= 1 && step <= 4) {
      dispatch({ type: 'TRACK_STEP_START', payload: step });
      dispatch({ type: 'SET_STEP', payload: step });
    }
  }, []);

  const nextStep = useCallback(async (): Promise<boolean> => {
    const isValid = await validateCurrentStep();
    if (isValid && state.currentStep < 4) {
      dispatch({ type: 'TRACK_STEP_COMPLETION', payload: state.currentStep });
      dispatch({ type: 'SET_STEP', payload: state.currentStep + 1 });
      dispatch({ type: 'TRACK_STEP_START', payload: state.currentStep + 1 });
      return true;
    }
    return false;
  }, [state.currentStep]);

  const prevStep = useCallback(() => {
    if (state.currentStep > 1) {
      dispatch({ type: 'SET_STEP', payload: state.currentStep - 1 });
      dispatch({ type: 'TRACK_STEP_START', payload: state.currentStep - 1 });
    }
  }, [state.currentStep]);

  const updateData = useCallback((data: Partial<BookingFormData>) => {
    dispatch({ type: 'UPDATE_DATA', payload: data });
  }, []);

  const validateCurrentStep = useCallback(async (): Promise<boolean> => {
    dispatch({ type: 'SET_LOADING', payload: true });
    
    try {
      const validation = validateStep(state.currentStep, state.data);
      
      if (validation.success) {
        dispatch({ type: 'SET_ERRORS', payload: null });
        return true;
      } else {
        dispatch({ type: 'SET_ERRORS', payload: validation.errors });
        return false;
      }
    } catch (error) {
      console.error('Validation error:', error);
      dispatch({ type: 'SET_ERRORS', payload: { general: ['Validation failed'] } });
      return false;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [state.currentStep, state.data]);

  const saveDraft = useCallback(async () => {
    try {
      const timestamp = new Date();
      localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(state.data));
      localStorage.setItem(DRAFT_TIMESTAMP_KEY, timestamp.toISOString());
      dispatch({ type: 'SAVE_DRAFT', payload: { data: state.data, timestamp } });
      
      // Track draft save event
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'booking_draft_saved', {
          step: state.currentStep,
          items_count: state.data.items?.length || 0,
        });
      }
    } catch (error) {
      console.error('Failed to save draft:', error);
    }
  }, [state.data, state.currentStep]);

  const loadDraft = useCallback(async () => {
    try {
      const draftData = localStorage.getItem(DRAFT_STORAGE_KEY);
      const draftTimestamp = localStorage.getItem(DRAFT_TIMESTAMP_KEY);
      
      if (draftData && draftTimestamp) {
        const timestamp = new Date(draftTimestamp);
        const now = new Date();
        const hoursSinceLastSave = (now.getTime() - timestamp.getTime()) / (1000 * 60 * 60);
        
        // Only load draft if it's less than 24 hours old
        if (hoursSinceLastSave < 24) {
          const parsedData = JSON.parse(draftData);
          dispatch({ type: 'LOAD_DRAFT', payload: parsedData });
          
          // Track draft load event
          if (typeof window !== 'undefined' && window.gtag) {
            window.gtag('event', 'booking_draft_loaded', {
              hours_since_save: Math.round(hoursSinceLastSave),
              items_count: parsedData.items?.length || 0,
            });
          }
        } else {
          // Clear old draft
          clearDraft();
        }
      }
    } catch (error) {
      console.error('Failed to load draft:', error);
      clearDraft();
    }
  }, []);

  const clearDraft = useCallback(() => {
    try {
      localStorage.removeItem(DRAFT_STORAGE_KEY);
      localStorage.removeItem(DRAFT_TIMESTAMP_KEY);
      dispatch({ type: 'CLEAR_DRAFT' });
    } catch (error) {
      console.error('Failed to clear draft:', error);
    }
  }, []);

  const resetBooking = useCallback(() => {
    clearDraft();
    dispatch({ type: 'RESET_BOOKING' });
  }, [clearDraft]);

  // Analytics functions
  const trackStepStart = useCallback((step: number) => {
    dispatch({ type: 'TRACK_STEP_START', payload: step });
    
    // Track with Google Analytics
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'booking_step_start', {
        step_number: step,
        step_name: getStepName(step),
      });
    }
  }, []);

  const trackStepCompletion = useCallback((step: number) => {
    dispatch({ type: 'TRACK_STEP_COMPLETION', payload: step });
    
    // Track with Google Analytics
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'booking_step_complete', {
        step_number: step,
        step_name: getStepName(step),
      });
    }
  }, []);

  const trackAbandonment = useCallback((point: string) => {
    dispatch({ type: 'TRACK_ABANDONMENT', payload: point });
    
    // Track with Google Analytics
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'booking_abandonment', {
        abandonment_point: point,
        current_step: state.currentStep,
      });
    }
  }, [state.currentStep]);

  const getAnalytics = useCallback(() => state.analytics, [state.analytics]);

  // Context value
  const contextValue: BookingContextType = {
    state,
    dispatch,
    goToStep,
    nextStep,
    prevStep,
    updateData,
    validateCurrentStep,
    saveDraft,
    loadDraft,
    clearDraft,
    resetBooking,
    trackStepStart,
    trackStepCompletion,
    trackAbandonment,
    getAnalytics,
  };

  return (
    <BookingContext.Provider value={contextValue}>
      {children}
    </BookingContext.Provider>
  );
};

// Hook to use booking context
export const useBooking = (): BookingContextType => {
  const context = useContext(BookingContext);
  if (context === undefined) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
};

// Helper function to get step names
const getStepName = (step: number): string => {
  const stepNames = {
    1: 'where_and_what',
    2: 'when_and_how',
    3: 'who_and_payment',
    4: 'confirmation',
  };
  return stepNames[step as keyof typeof stepNames] || 'unknown';
};

// Hook for step-specific data
export const useStepData = <T extends keyof BookingFormData>(
  fields: T[]
): Pick<BookingFormData, T> => {
  const { state } = useBooking();
  
  const stepData = {} as Pick<BookingFormData, T>;
  fields.forEach(field => {
    if (state.data[field] !== undefined) {
      stepData[field] = state.data[field] as BookingFormData[T];
    }
  });
  
  return stepData;
};

// Hook for form errors
export const useFormErrors = () => {
  const { state } = useBooking();
  
  const getFieldError = (fieldPath: string): string | null => {
    if (!state.errors) return null;
    
    const pathParts = fieldPath.split('.');
    let current: any = state.errors;
    
    for (const part of pathParts) {
      if (current?.[part]) {
        current = current[part];
      } else {
        return null;
      }
    }
    
    return Array.isArray(current) ? current[0] : current;
  };
  
  return { errors: state.errors, getFieldError };
};

// Performance tracking hook
export const useBookingPerformance = () => {
  const { state, getAnalytics } = useBooking();
  
  const getStepDuration = (step: number): number => {
    const analytics = getAnalytics();
    const startTime = analytics.stepStartTimes[step];
    const completionTime = analytics.stepCompletionTimes[step];
    
    if (startTime && completionTime) {
      return completionTime.getTime() - startTime.getTime();
    }
    
    return 0;
  };
  
  const getTotalDuration = (): number => {
    return getAnalytics().totalTimeSpent;
  };
  
  const getConversionFunnel = () => {
    const analytics = getAnalytics();
    const completedSteps = Object.keys(analytics.stepCompletionTimes).length;
    const totalSteps = 4;
    
    return {
      completedSteps,
      totalSteps,
      conversionRate: (completedSteps / totalSteps) * 100,
      abandonmentPoints: analytics.abandonmentPoints,
    };
  };
  
  return {
    getStepDuration,
    getTotalDuration,
    getConversionFunnel,
    isLoading: state.isLoading,
  };
};

