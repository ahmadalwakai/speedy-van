import { v4 as uuidv4 } from 'uuid';

// Define the analytics event types
export type AnalyticsEvent = 
  | { type: 'booking_started'; payload: { bookingId: string; timestamp: number; } }
  | { type: 'step_viewed'; payload: { step: number; bookingId: string; timestamp: number; } }
  | { type: 'step_completed'; payload: { step: number; bookingId: string; duration: number; } }
  | { type: 'item_added'; payload: { itemId: string; quantity: number; bookingId: string; } }
  | { type: 'item_removed'; payload: { itemId: string; bookingId: string; } }
  | { type: 'address_selected'; payload: { addressType: 'pickup' | 'dropoff'; bookingId: string; } }
  | { type: 'schedule_selected'; payload: { date: string; timeSlot: string; bookingId: string; } }
  | { type: 'service_selected'; payload: { serviceType: string; bookingId: string; } }
  | { type: 'promo_code_applied'; payload: { promoCode: string; discount: number; bookingId: string; } }
  | { type: 'booking_confirmed'; payload: { bookingId: string; totalPrice: number; timestamp: number; } }
  | { type: 'booking_failed'; payload: { bookingId: string; error: string; timestamp: number; } }
  | { type: 'funnel_dropout'; payload: { step: number; bookingId: string; reason: string; } };

// Define the analytics provider interface
interface AnalyticsProvider {
  trackEvent(event: AnalyticsEvent): void;
  setUser(userId: string): void;
  setSession(sessionId: string): void;
}

// Google Analytics implementation
class GoogleAnalyticsProvider implements AnalyticsProvider {
  constructor(private trackingId: string) {
    // Initialize Google Analytics
    if (typeof window !== 'undefined' && !(window as any).ga) {
      (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
      (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
      m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
      })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');
      
      (window as any).ga('create', this.trackingId, 'auto');
      (window as any).ga('send', 'pageview');
    }
  }

  trackEvent(event: AnalyticsEvent) {
    if (typeof (window as any).ga === 'undefined') return;

    switch (event.type) {
      case 'booking_started':
        (window as any).ga('send', 'event', 'Booking', 'Started', event.payload.bookingId);
        break;
      case 'step_viewed':
        (window as any).ga('send', 'event', 'Booking', `Step ${event.payload.step} Viewed`, event.payload.bookingId);
        break;
      case 'step_completed':
        (window as any).ga('send', 'event', 'Booking', `Step ${event.payload.step} Completed`, event.payload.bookingId, {
          eventValue: event.payload.duration,
        });
        break;
      case 'item_added':
        (window as any).ga('send', 'event', 'Booking', 'Item Added', event.payload.itemId, {
          eventValue: event.payload.quantity,
        });
        break;
      case 'promo_code_applied':
        (window as any).ga('send', 'event', 'Booking', 'Promo Applied', event.payload.promoCode, {
          eventValue: event.payload.discount,
        });
        break;
      case 'booking_confirmed':
        (window as any).ga('send', 'event', 'Booking', 'Confirmed', event.payload.bookingId, {
          eventValue: event.payload.totalPrice,
        });
        break;
      case 'booking_failed':
        (window as any).ga('send', 'event', 'Booking', 'Failed', event.payload.error);
        break;
      case 'funnel_dropout':
        (window as any).ga('send', 'event', 'Booking', `Dropout at Step ${event.payload.step}`, event.payload.reason);
        break;
      default:
        break;
    }
  }

  setUser(userId: string) {
    if (typeof (window as any).ga === 'undefined') return;
    (window as any).ga('set', 'userId', userId);
  }

  setSession(sessionId: string) {
    if (typeof (window as any).ga === 'undefined') return;
    (window as any).ga('set', 'sessionId', sessionId);
  }
}

// Mixpanel implementation
class MixpanelProvider implements AnalyticsProvider {
  constructor(private token: string) {
    // Initialize Mixpanel
    if (typeof window !== 'undefined' && !(window as any).mixpanel) {
      (function(e,a){if(!a.__SV){var b=window;try{var c,l,i,j=b.location,g=j.hash;c=function(a,b){return(l=a.match(new RegExp(b+"=([^","&]*)")))?l[1]:null};g&&c(g,"state")&&(i=JSON.parse(decodeURIComponent(c(g,"state"))),"mpeditor"===i.action&&(b.sessionStorage.setItem("_mpcehash",g),history.replaceState(i.state,null,j.pathname+j.search)))}catch(m){}var k,h;
window.mixpanel=a;a._i=[];a.init=function(b,c,f){function d(a,b){var c=b.split(".");2==c.length&&(a=a[c[0]],b=c[1]);a[b]=function(){a.push([b].concat(Array.prototype.slice.call(arguments,0)))}}var e=a;"undefined"!==typeof f?e=a[f]=[]:f="mixpanel";e.people=e.people||[];e.toString=function(b){var a="mixpanel";"mixpanel"!==f&&(a+="["+f+"]");b||(a+=" (stub)");return a};e.people.toString=function(){return e.toString(1)+".people (stub)"};k="disable track track_pageview track_links track_forms register register_once alias unregister identify name_tag set_config reset people.set people.set_once people.increment people.append people.union people.track_charge people.clear_charges people.delete_user".split(" ");
for(h=0;h<k.length;h++)d(e,k[h]);a._i.push([b,c,f])};a.__SV=1.2;b=e.createElement("script");b.type="text/javascript";b.async=!0;b.src="undefined"!==typeof MIXPANEL_CUSTOM_LIB_URL?MIXPANEL_CUSTOM_LIB_URL:"file:"===e.location.protocol&&"//cdn.mxpnl.com/libs/mixpanel-2-latest.min.js".match(/^\/\//)?"https://cdn.mxpnl.com/libs/mixpanel-2-latest.min.js":"//cdn.mxpnl.com/libs/mixpanel-2-latest.min.js";c=e.getElementsByTagName("script")[0];c.parentNode.insertBefore(b,c)}})(document,window.mixpanel||[]);
      (window as any).mixpanel.init(this.token);
    }
  }

  trackEvent(event: AnalyticsEvent) {
    if (typeof (window as any).mixpanel === 'undefined') return;
    (window as any).mixpanel.track(event.type, event.payload);
  }

  setUser(userId: string) {
    if (typeof (window as any).mixpanel === 'undefined') return;
    (window as any).mixpanel.identify(userId);
  }

  setSession(sessionId: string) {
    // Mixpanel handles sessions automatically
  }
}

// Analytics service to manage multiple providers
export class AnalyticsService {
  private providers: AnalyticsProvider[] = [];
  private bookingId: string | null = null;
  private sessionId: string;

  constructor() {
    this.sessionId = uuidv4();
    
    // Initialize providers based on environment variables
    if (process.env.NEXT_PUBLIC_GA_TRACKING_ID) {
      this.providers.push(new GoogleAnalyticsProvider(process.env.NEXT_PUBLIC_GA_TRACKING_ID));
    }
    if (process.env.NEXT_PUBLIC_MIXPANEL_TOKEN) {
      this.providers.push(new MixpanelProvider(process.env.NEXT_PUBLIC_MIXPANEL_TOKEN));
    }
    
    this.setSession(this.sessionId);
  }

  private track(event: AnalyticsEvent) {
    this.providers.forEach(provider => provider.trackEvent(event));
  }

  public setUser(userId: string) {
    this.providers.forEach(provider => provider.setUser(userId));
  }

  public setSession(sessionId: string) {
    this.providers.forEach(provider => provider.setSession(sessionId));
  }

  // Booking funnel events
  public startBooking() {
    this.bookingId = uuidv4();
    this.track({ type: 'booking_started', payload: { bookingId: this.bookingId, timestamp: Date.now() } });
    return this.bookingId;
  }

  public viewStep(step: number) {
    if (!this.bookingId) return;
    this.track({ type: 'step_viewed', payload: { step, bookingId: this.bookingId, timestamp: Date.now() } });
  }

  public completeStep(step: number, duration: number) {
    if (!this.bookingId) return;
    this.track({ type: 'step_completed', payload: { step, bookingId: this.bookingId, duration } });
  }

  public addItem(itemId: string, quantity: number) {
    if (!this.bookingId) return;
    this.track({ type: 'item_added', payload: { itemId, quantity, bookingId: this.bookingId } });
  }

  public removeItem(itemId: string) {
    if (!this.bookingId) return;
    this.track({ type: 'item_removed', payload: { itemId, bookingId: this.bookingId } });
  }

  public selectAddress(addressType: 'pickup' | 'dropoff') {
    if (!this.bookingId) return;
    this.track({ type: 'address_selected', payload: { addressType, bookingId: this.bookingId } });
  }

  public selectSchedule(date: string, timeSlot: string) {
    if (!this.bookingId) return;
    this.track({ type: 'schedule_selected', payload: { date, timeSlot, bookingId: this.bookingId } });
  }

  public selectService(serviceType: string) {
    if (!this.bookingId) return;
    this.track({ type: 'service_selected', payload: { serviceType, bookingId: this.bookingId } });
  }

  public applyPromoCode(promoCode: string, discount: number) {
    if (!this.bookingId) return;
    this.track({ type: 'promo_code_applied', payload: { promoCode, discount, bookingId: this.bookingId } });
  }

  public confirmBooking(totalPrice: number) {
    if (!this.bookingId) return;
    this.track({ type: 'booking_confirmed', payload: { bookingId: this.bookingId, totalPrice, timestamp: Date.now() } });
    this.bookingId = null; // Reset after confirmation
  }

  public failBooking(error: string) {
    if (!this.bookingId) return;
    this.track({ type: 'booking_failed', payload: { bookingId: this.bookingId, error, timestamp: Date.now() } });
  }

  public trackDropout(step: number, reason: string) {
    if (!this.bookingId) return;
    this.track({ type: 'funnel_dropout', payload: { step, bookingId: this.bookingId, reason } });
  }
  
  // A/B testing integration
  public getExperimentVariant(experimentName: string): string {
    // Simple example: return 'A' or 'B' based on session ID
    return this.sessionId.charCodeAt(0) % 2 === 0 ? 'A' : 'B';
  }
  
  public trackExperiment(experimentName: string, variant: string) {
    if (typeof (window as any).ga === 'undefined') return;
    (window as any).ga('send', 'event', 'Experiment', experimentName, variant);
  }
}

// Singleton instance
export const analyticsService = new AnalyticsService();

// React hook for easy integration
import { useEffect } from 'react';

export const useAnalytics = () => {
  useEffect(() => {
    // Track initial page view
    analyticsService.viewStep(0); // Assuming step 0 is the initial page load
  }, []);

  return analyticsService;
};

// Example usage in a component:
// const analytics = useAnalytics();
// analytics.completeStep(1, 5000); // Step 1 completed in 5 seconds

