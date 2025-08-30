// Enhanced Analytics Utility for GA4 Event Tracking
// Supports phone clicks, form submissions, WhatsApp interactions, and more

declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
  }
}

export interface AnalyticsEvent {
  action: string;
  category: string;
  label?: string;
  value?: number;
  custom_parameters?: Record<string, any>;
}

// Core event tracking function
export const trackEvent = (event: AnalyticsEvent) => {
  try {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', event.action, {
        event_category: event.category,
        event_label: event.label,
        value: event.value,
        ...event.custom_parameters,
      });
    }
  } catch (error) {
    console.warn('Analytics tracking error:', error);
  }
};

// Phone click tracking
export const trackPhoneClick = (phoneNumber: string, location: string = 'unknown') => {
  trackEvent({
    action: 'phone_click',
    category: 'engagement',
    label: `${phoneNumber}_${location}`,
    custom_parameters: {
      phone_number: phoneNumber,
      click_location: location,
      timestamp: new Date().toISOString(),
    },
  });
};

// WhatsApp click tracking
export const trackWhatsAppClick = (location: string = 'unknown', message?: string) => {
  trackEvent({
    action: 'whatsapp_click',
    category: 'engagement',
    label: location,
    custom_parameters: {
      click_location: location,
      message_preview: message?.substring(0, 50),
      timestamp: new Date().toISOString(),
    },
  });
};

// Form submission tracking
export const trackFormSubmission = (
  formName: string,
  success: boolean = true,
  errorMessage?: string
) => {
  trackEvent({
    action: success ? 'form_submit_success' : 'form_submit_error',
    category: 'conversion',
    label: formName,
    value: success ? 1 : 0,
    custom_parameters: {
      form_name: formName,
      success,
      error_message: errorMessage,
      timestamp: new Date().toISOString(),
    },
  });
};

// Quote request tracking
export const trackQuoteRequest = (
  quoteType: string,
  estimatedValue?: number,
  location?: string
) => {
  trackEvent({
    action: 'quote_request',
    category: 'conversion',
    label: quoteType,
    value: estimatedValue,
    custom_parameters: {
      quote_type: quoteType,
      estimated_value: estimatedValue,
      pickup_location: location,
      timestamp: new Date().toISOString(),
    },
  });
};

// Booking tracking
export const trackBookingStart = (serviceType: string) => {
  trackEvent({
    action: 'booking_start',
    category: 'conversion',
    label: serviceType,
    custom_parameters: {
      service_type: serviceType,
      timestamp: new Date().toISOString(),
    },
  });
};

export const trackBookingComplete = (
  bookingId: string,
  serviceType: string,
  totalValue: number
) => {
  trackEvent({
    action: 'booking_complete',
    category: 'conversion',
    label: serviceType,
    value: totalValue,
    custom_parameters: {
      booking_id: bookingId,
      service_type: serviceType,
      total_value: totalValue,
      timestamp: new Date().toISOString(),
    },
  });
};

// Page view tracking with enhanced data
export const trackPageView = (
  pagePath: string,
  pageTitle: string,
  customParameters?: Record<string, any>
) => {
  try {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('config', process.env.NEXT_PUBLIC_GA_ID, {
        page_path: pagePath,
        page_title: pageTitle,
        ...customParameters,
      });
    }
  } catch (error) {
    console.warn('Page view tracking error:', error);
  }
};

// Service page tracking
export const trackServicePageView = (serviceName: string, location?: string) => {
  trackEvent({
    action: 'service_page_view',
    category: 'engagement',
    label: serviceName,
    custom_parameters: {
      service_name: serviceName,
      location,
      timestamp: new Date().toISOString(),
    },
  });
};

// CTA button tracking
export const trackCTAClick = (
  ctaText: string,
  location: string,
  destination?: string
) => {
  trackEvent({
    action: 'cta_click',
    category: 'engagement',
    label: `${ctaText}_${location}`,
    custom_parameters: {
      cta_text: ctaText,
      click_location: location,
      destination,
      timestamp: new Date().toISOString(),
    },
  });
};

// Search tracking
export const trackSearch = (searchTerm: string, resultsCount?: number) => {
  trackEvent({
    action: 'search',
    category: 'engagement',
    label: searchTerm,
    value: resultsCount,
    custom_parameters: {
      search_term: searchTerm,
      results_count: resultsCount,
      timestamp: new Date().toISOString(),
    },
  });
};

// Error tracking
export const trackError = (
  errorType: string,
  errorMessage: string,
  location: string
) => {
  trackEvent({
    action: 'error',
    category: 'technical',
    label: errorType,
    custom_parameters: {
      error_type: errorType,
      error_message: errorMessage,
      error_location: location,
      timestamp: new Date().toISOString(),
    },
  });
};

// Performance tracking
export const trackPerformance = (
  metricName: string,
  value: number,
  unit: string = 'ms'
) => {
  trackEvent({
    action: 'performance_metric',
    category: 'technical',
    label: metricName,
    value,
    custom_parameters: {
      metric_name: metricName,
      metric_value: value,
      unit,
      timestamp: new Date().toISOString(),
    },
  });
};

// Enhanced consent tracking
export const trackConsentUpdate = (
  consentType: string,
  granted: boolean,
  source: string = 'banner'
) => {
  trackEvent({
    action: 'consent_update',
    category: 'privacy',
    label: `${consentType}_${granted ? 'granted' : 'denied'}`,
    custom_parameters: {
      consent_type: consentType,
      granted,
      source,
      timestamp: new Date().toISOString(),
    },
  });
};

