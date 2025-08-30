import { useCallback, useMemo, useRef, useEffect, useState } from 'react';
import { debounce, throttle } from 'lodash';

// Performance monitoring utilities
export class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: Map<string, number[]> = new Map();
  private observers: Map<string, PerformanceObserver> = new Map();

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  // Measure component render time
  measureRender(componentName: string, renderFn: () => void): void {
    const startTime = performance.now();
    renderFn();
    const endTime = performance.now();
    
    this.recordMetric(`render-${componentName}`, endTime - startTime);
  }

  // Measure async operation time
  async measureAsync<T>(operationName: string, asyncFn: () => Promise<T>): Promise<T> {
    const startTime = performance.now();
    try {
      const result = await asyncFn();
      const endTime = performance.now();
      this.recordMetric(`async-${operationName}`, endTime - startTime);
      return result;
    } catch (error) {
      const endTime = performance.now();
      this.recordMetric(`async-${operationName}-error`, endTime - startTime);
      throw error;
    }
  }

  // Record custom metric
  recordMetric(name: string, value: number): void {
    if (!this.metrics.has(name)) {
      this.metrics.set(name, []);
    }
    
    const values = this.metrics.get(name)!;
    values.push(value);
    
    // Keep only last 100 measurements
    if (values.length > 100) {
      values.shift();
    }
  }

  // Get metric statistics
  getMetricStats(name: string): {
    count: number;
    average: number;
    min: number;
    max: number;
    p95: number;
  } | null {
    const values = this.metrics.get(name);
    if (!values || values.length === 0) return null;

    const sorted = [...values].sort((a, b) => a - b);
    const count = values.length;
    const sum = values.reduce((a, b) => a + b, 0);
    const average = sum / count;
    const min = sorted[0];
    const max = sorted[count - 1];
    const p95Index = Math.floor(count * 0.95);
    const p95 = sorted[p95Index];

    return { count, average, min, max, p95 };
  }

  // Start observing Core Web Vitals
  observeCoreWebVitals(): void {
    if (typeof window === 'undefined') return;

    // Largest Contentful Paint (LCP)
    if ('PerformanceObserver' in window) {
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1] as any;
        this.recordMetric('lcp', lastEntry.startTime);
      });
      
      try {
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
        this.observers.set('lcp', lcpObserver);
      } catch (e) {
        console.warn('LCP observation not supported');
      }
    }

    // First Input Delay (FID)
    if ('PerformanceObserver' in window) {
      const fidObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry: any) => {
          this.recordMetric('fid', entry.processingStart - entry.startTime);
        });
      });
      
      try {
        fidObserver.observe({ entryTypes: ['first-input'] });
        this.observers.set('fid', fidObserver);
      } catch (e) {
        console.warn('FID observation not supported');
      }
    }

    // Cumulative Layout Shift (CLS)
    if ('PerformanceObserver' in window) {
      let clsValue = 0;
      const clsObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry: any) => {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
            this.recordMetric('cls', clsValue);
          }
        });
      });
      
      try {
        clsObserver.observe({ entryTypes: ['layout-shift'] });
        this.observers.set('cls', clsObserver);
      } catch (e) {
        console.warn('CLS observation not supported');
      }
    }
  }

  // Get Core Web Vitals summary
  getCoreWebVitalsReport(): {
    lcp?: { value: number; rating: 'good' | 'needs-improvement' | 'poor' };
    fid?: { value: number; rating: 'good' | 'needs-improvement' | 'poor' };
    cls?: { value: number; rating: 'good' | 'needs-improvement' | 'poor' };
  } {
    const report: any = {};

    // LCP thresholds: good < 2.5s, needs improvement < 4s, poor >= 4s
    const lcpStats = this.getMetricStats('lcp');
    if (lcpStats) {
      const lcpValue = lcpStats.p95 / 1000; // Convert to seconds
      report.lcp = {
        value: lcpValue,
        rating: lcpValue < 2.5 ? 'good' : lcpValue < 4 ? 'needs-improvement' : 'poor',
      };
    }

    // FID thresholds: good < 100ms, needs improvement < 300ms, poor >= 300ms
    const fidStats = this.getMetricStats('fid');
    if (fidStats) {
      const fidValue = fidStats.p95;
      report.fid = {
        value: fidValue,
        rating: fidValue < 100 ? 'good' : fidValue < 300 ? 'needs-improvement' : 'poor',
      };
    }

    // CLS thresholds: good < 0.1, needs improvement < 0.25, poor >= 0.25
    const clsStats = this.getMetricStats('cls');
    if (clsStats) {
      const clsValue = clsStats.max;
      report.cls = {
        value: clsValue,
        rating: clsValue < 0.1 ? 'good' : clsValue < 0.25 ? 'needs-improvement' : 'poor',
      };
    }

    return report;
  }

  // Cleanup observers
  cleanup(): void {
    this.observers.forEach((observer) => {
      observer.disconnect();
    });
    this.observers.clear();
  }
}

// React hooks for performance optimization

// Debounced value hook
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

// Throttled callback hook
export function useThrottle<T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): T {
  const throttledCallback = useMemo(
    () => throttle(callback, delay, { leading: true, trailing: true }),
    [callback, delay]
  );

  useEffect(() => {
    return () => {
      throttledCallback.cancel();
    };
  }, [throttledCallback]);

  return throttledCallback as T;
}

// Intersection observer hook for lazy loading
export function useIntersectionObserver(
  ref: React.RefObject<Element>,
  options: IntersectionObserverInit = {}
): IntersectionObserverEntry | null {
  const [entry, setEntry] = useState<IntersectionObserverEntry | null>(null);

  useEffect(() => {
    if (!ref.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => setEntry(entry),
      options
    );

    observer.observe(ref.current);

    return () => {
      observer.disconnect();
    };
  }, [ref, options]);

  return entry;
}

// Virtual scrolling hook for large lists
export function useVirtualScroll<T>({
  items,
  itemHeight,
  containerHeight,
  overscan = 5,
}: {
  items: T[];
  itemHeight: number;
  containerHeight: number;
  overscan?: number;
}) {
  const [scrollTop, setScrollTop] = useState(0);

  const visibleRange = useMemo(() => {
    const start = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
    const visibleCount = Math.ceil(containerHeight / itemHeight);
    const end = Math.min(items.length, start + visibleCount + overscan * 2);

    return { start, end };
  }, [scrollTop, itemHeight, containerHeight, overscan, items.length]);

  const visibleItems = useMemo(() => {
    return items.slice(visibleRange.start, visibleRange.end).map((item, index) => ({
      item,
      index: visibleRange.start + index,
    }));
  }, [items, visibleRange]);

  const totalHeight = items.length * itemHeight;
  const offsetY = visibleRange.start * itemHeight;

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  }, []);

  return {
    visibleItems,
    totalHeight,
    offsetY,
    handleScroll,
  };
}

// Memory usage monitor hook
export function useMemoryMonitor(): {
  usedJSHeapSize?: number;
  totalJSHeapSize?: number;
  jsHeapSizeLimit?: number;
} {
  const [memoryInfo, setMemoryInfo] = useState<{
    usedJSHeapSize?: number;
    totalJSHeapSize?: number;
    jsHeapSizeLimit?: number;
  }>({});

  useEffect(() => {
    const updateMemoryInfo = () => {
      if ('memory' in performance) {
        const memory = (performance as any).memory;
        setMemoryInfo({
          usedJSHeapSize: memory.usedJSHeapSize,
          totalJSHeapSize: memory.totalJSHeapSize,
          jsHeapSizeLimit: memory.jsHeapSizeLimit,
        });
      }
    };

    updateMemoryInfo();
    const interval = setInterval(updateMemoryInfo, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, []);

  return memoryInfo;
}

// Image lazy loading hook
export function useLazyImage(src: string, placeholder?: string) {
  const [imageSrc, setImageSrc] = useState(placeholder || '');
  const [isLoaded, setIsLoaded] = useState(false);
  const [isError, setIsError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  const entry = useIntersectionObserver(imgRef, {
    threshold: 0.1,
    rootMargin: '50px',
  });

  useEffect(() => {
    if (entry?.isIntersecting && !isLoaded && !isError) {
      const img = new Image();
      
      img.onload = () => {
        setImageSrc(src);
        setIsLoaded(true);
      };
      
      img.onerror = () => {
        setIsError(true);
      };
      
      img.src = src;
    }
  }, [entry?.isIntersecting, src, isLoaded, isError]);

  return {
    imgRef,
    imageSrc,
    isLoaded,
    isError,
  };
}

// Component performance wrapper
export function withPerformanceMonitoring<P extends object>(
  Component: React.ComponentType<P>,
  componentName: string
) {
  return React.memo((props: P) => {
    const monitor = PerformanceMonitor.getInstance();
    
    useEffect(() => {
      const startTime = performance.now();
      
      return () => {
        const endTime = performance.now();
        monitor.recordMetric(`component-${componentName}-lifetime`, endTime - startTime);
      };
    }, [monitor]);

    const wrappedRender = useCallback(() => {
      return <Component {...props} />;
    }, [props]);

    monitor.measureRender(componentName, wrappedRender);
    
    return wrappedRender();
  });
}

// Bundle splitting utilities
export const loadComponent = (importFn: () => Promise<any>) => {
  return React.lazy(() => 
    importFn().then(module => ({
      default: module.default || module
    }))
  );
};

// Preload critical resources
export function preloadResource(href: string, as: string, crossorigin?: string) {
  if (typeof document === 'undefined') return;

  const link = document.createElement('link');
  link.rel = 'preload';
  link.href = href;
  link.as = as;
  if (crossorigin) link.crossOrigin = crossorigin;
  
  document.head.appendChild(link);
}

// Service worker registration for caching
export function registerServiceWorker(swPath: string = '/sw.js') {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    return Promise.resolve(null);
  }

  return navigator.serviceWorker
    .register(swPath)
    .then((registration) => {
      console.log('SW registered: ', registration);
      return registration;
    })
    .catch((registrationError) => {
      console.log('SW registration failed: ', registrationError);
      return null;
    });
}

// Critical CSS inlining utility
export function inlineCriticalCSS(css: string) {
  if (typeof document === 'undefined') return;

  const style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);
}

// Resource hints utilities
export function addResourceHints(hints: Array<{
  rel: 'dns-prefetch' | 'preconnect' | 'prefetch' | 'preload';
  href: string;
  as?: string;
  crossorigin?: string;
}>) {
  if (typeof document === 'undefined') return;

  hints.forEach(({ rel, href, as, crossorigin }) => {
    const link = document.createElement('link');
    link.rel = rel;
    link.href = href;
    if (as) link.as = as;
    if (crossorigin) link.crossOrigin = crossorigin;
    
    document.head.appendChild(link);
  });
}

// Performance budget checker
export class PerformanceBudget {
  private budgets: Map<string, number> = new Map();

  setBudget(metric: string, limit: number) {
    this.budgets.set(metric, limit);
  }

  checkBudget(metric: string, value: number): {
    withinBudget: boolean;
    budget: number;
    actual: number;
    percentage: number;
  } {
    const budget = this.budgets.get(metric);
    if (!budget) {
      throw new Error(`No budget set for metric: ${metric}`);
    }

    const withinBudget = value <= budget;
    const percentage = (value / budget) * 100;

    return {
      withinBudget,
      budget,
      actual: value,
      percentage,
    };
  }

  getAllBudgetStatus(monitor: PerformanceMonitor): Array<{
    metric: string;
    status: 'pass' | 'fail' | 'no-data';
    budget: number;
    actual?: number;
    percentage?: number;
  }> {
    const results: Array<{
      metric: string;
      status: 'pass' | 'fail' | 'no-data';
      budget: number;
      actual?: number;
      percentage?: number;
    }> = [];

    this.budgets.forEach((budget, metric) => {
      const stats = monitor.getMetricStats(metric);
      
      if (!stats) {
        results.push({
          metric,
          status: 'no-data',
          budget,
        });
        return;
      }

      const actual = stats.p95;
      const withinBudget = actual <= budget;
      const percentage = (actual / budget) * 100;

      results.push({
        metric,
        status: withinBudget ? 'pass' : 'fail',
        budget,
        actual,
        percentage,
      });
    });

    return results;
  }
}

// Initialize performance monitoring
export function initializePerformanceMonitoring() {
  const monitor = PerformanceMonitor.getInstance();
  
  // Start observing Core Web Vitals
  monitor.observeCoreWebVitals();
  
  // Set up performance budgets
  const budget = new PerformanceBudget();
  budget.setBudget('lcp', 2500); // 2.5 seconds
  budget.setBudget('fid', 100); // 100ms
  budget.setBudget('cls', 0.05); // 0.05
  budget.setBudget('render-BookingSummary', 16); // 16ms (60fps)
  budget.setBudget('async-pricing-calculation', 100); // 100ms
  
  // Add resource hints for critical resources
  addResourceHints([
    { rel: 'dns-prefetch', href: 'https://api.mapbox.com' },
    { rel: 'preconnect', href: 'https://fonts.googleapis.com', crossorigin: 'anonymous' },
    { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: 'anonymous' },
  ]);
  
  return { monitor, budget };
}

export default PerformanceMonitor;

