import { useEffect, useRef, useState, useCallback } from 'react';

// WCAG 2.2 AA Compliance Utilities

// Color contrast checker
export class ColorContrastChecker {
  // Calculate relative luminance
  private static getRelativeLuminance(rgb: [number, number, number]): number {
    const [r, g, b] = rgb.map(c => {
      c = c / 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  }

  // Convert hex to RGB
  private static hexToRgb(hex: string): [number, number, number] | null {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? [
      parseInt(result[1], 16),
      parseInt(result[2], 16),
      parseInt(result[3], 16)
    ] : null;
  }

  // Calculate contrast ratio
  static getContrastRatio(color1: string, color2: string): number {
    const rgb1 = this.hexToRgb(color1);
    const rgb2 = this.hexToRgb(color2);
    
    if (!rgb1 || !rgb2) return 0;
    
    const lum1 = this.getRelativeLuminance(rgb1);
    const lum2 = this.getRelativeLuminance(rgb2);
    
    const brightest = Math.max(lum1, lum2);
    const darkest = Math.min(lum1, lum2);
    
    return (brightest + 0.05) / (darkest + 0.05);
  }

  // Check WCAG compliance
  static checkWCAGCompliance(
    foreground: string,
    background: string,
    level: 'AA' | 'AAA' = 'AA',
    size: 'normal' | 'large' = 'normal'
  ): {
    ratio: number;
    isCompliant: boolean;
    requiredRatio: number;
  } {
    const ratio = this.getContrastRatio(foreground, background);
    
    let requiredRatio: number;
    if (level === 'AAA') {
      requiredRatio = size === 'large' ? 4.5 : 7;
    } else {
      requiredRatio = size === 'large' ? 3 : 4.5;
    }
    
    return {
      ratio,
      isCompliant: ratio >= requiredRatio,
      requiredRatio,
    };
  }
}

// Touch target size checker
export function checkTouchTargetSize(element: HTMLElement): {
  width: number;
  height: number;
  isCompliant: boolean;
  minSize: number;
} {
  const rect = element.getBoundingClientRect();
  const minSize = 44; // WCAG 2.2 AA minimum touch target size in pixels
  
  return {
    width: rect.width,
    height: rect.height,
    isCompliant: rect.width >= minSize && rect.height >= minSize,
    minSize,
  };
}

// Focus management utilities
export class FocusManager {
  private static focusStack: HTMLElement[] = [];
  
  // Trap focus within an element
  static trapFocus(element: HTMLElement): () => void {
    const focusableElements = this.getFocusableElements(element);
    if (focusableElements.length === 0) return () => {};
    
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;
      
      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };
    
    element.addEventListener('keydown', handleKeyDown);
    firstElement.focus();
    
    return () => {
      element.removeEventListener('keydown', handleKeyDown);
    };
  }
  
  // Get all focusable elements within a container
  static getFocusableElements(container: HTMLElement): HTMLElement[] {
    const focusableSelectors = [
      'button:not([disabled])',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      'a[href]',
      '[tabindex]:not([tabindex="-1"])',
      '[contenteditable="true"]',
    ].join(', ');
    
    return Array.from(container.querySelectorAll(focusableSelectors)) as HTMLElement[];
  }
  
  // Save current focus
  static saveFocus(): void {
    const activeElement = document.activeElement as HTMLElement;
    if (activeElement) {
      this.focusStack.push(activeElement);
    }
  }
  
  // Restore previous focus
  static restoreFocus(): void {
    const previousElement = this.focusStack.pop();
    if (previousElement && document.contains(previousElement)) {
      previousElement.focus();
    }
  }
  
  // Move focus to element
  static moveFocusTo(element: HTMLElement): void {
    element.focus();
    
    // Ensure the element is visible
    element.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'nearest',
    });
  }
}

// Screen reader utilities
export class ScreenReaderUtils {
  // Announce message to screen readers
  static announce(message: string, priority: 'polite' | 'assertive' = 'polite'): void {
    const announcer = document.createElement('div');
    announcer.setAttribute('aria-live', priority);
    announcer.setAttribute('aria-atomic', 'true');
    announcer.className = 'sr-only';
    announcer.textContent = message;
    
    document.body.appendChild(announcer);
    
    // Remove after announcement
    setTimeout(() => {
      document.body.removeChild(announcer);
    }, 1000);
  }
  
  // Create visually hidden but screen reader accessible text
  static createSROnlyText(text: string): HTMLSpanElement {
    const span = document.createElement('span');
    span.className = 'sr-only';
    span.textContent = text;
    return span;
  }
  
  // Update aria-live region
  static updateLiveRegion(regionId: string, message: string): void {
    const region = document.getElementById(regionId);
    if (region) {
      region.textContent = message;
    }
  }
}

// Keyboard navigation utilities
export class KeyboardNavigation {
  // Handle arrow key navigation in a list
  static handleArrowNavigation(
    event: KeyboardEvent,
    items: HTMLElement[],
    currentIndex: number,
    orientation: 'horizontal' | 'vertical' = 'vertical'
  ): number {
    const { key } = event;
    let newIndex = currentIndex;
    
    if (orientation === 'vertical') {
      if (key === 'ArrowDown') {
        newIndex = (currentIndex + 1) % items.length;
      } else if (key === 'ArrowUp') {
        newIndex = currentIndex === 0 ? items.length - 1 : currentIndex - 1;
      }
    } else {
      if (key === 'ArrowRight') {
        newIndex = (currentIndex + 1) % items.length;
      } else if (key === 'ArrowLeft') {
        newIndex = currentIndex === 0 ? items.length - 1 : currentIndex - 1;
      }
    }
    
    if (newIndex !== currentIndex) {
      event.preventDefault();
      items[newIndex].focus();
    }
    
    return newIndex;
  }
  
  // Handle escape key
  static handleEscape(event: KeyboardEvent, callback: () => void): void {
    if (event.key === 'Escape') {
      event.preventDefault();
      callback();
    }
  }
  
  // Handle enter/space activation
  static handleActivation(event: KeyboardEvent, callback: () => void): void {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      callback();
    }
  }
}

// React hooks for accessibility

// Focus trap hook
export function useFocusTrap(isActive: boolean): React.RefObject<HTMLDivElement> {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!isActive || !containerRef.current) return;
    
    const cleanup = FocusManager.trapFocus(containerRef.current);
    return cleanup;
  }, [isActive]);
  
  return containerRef;
}

// Announce hook for screen readers
export function useAnnounce(): (message: string, priority?: 'polite' | 'assertive') => void {
  return useCallback((message: string, priority: 'polite' | 'assertive' = 'polite') => {
    ScreenReaderUtils.announce(message, priority);
  }, []);
}

// Keyboard navigation hook
export function useKeyboardNavigation<T extends HTMLElement>(
  items: T[],
  orientation: 'horizontal' | 'vertical' = 'vertical'
) {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    const newIndex = KeyboardNavigation.handleArrowNavigation(
      event,
      items,
      currentIndex,
      orientation
    );
    setCurrentIndex(newIndex);
  }, [items, currentIndex, orientation]);
  
  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
  
  return { currentIndex, setCurrentIndex };
}

// Reduced motion hook
export function useReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    
    const handleChange = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);
  
  return prefersReducedMotion;
}

// High contrast mode detection
export function useHighContrast(): boolean {
  const [isHighContrast, setIsHighContrast] = useState(false);
  
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-contrast: high)');
    setIsHighContrast(mediaQuery.matches);
    
    const handleChange = (event: MediaQueryListEvent) => {
      setIsHighContrast(event.matches);
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);
  
  return isHighContrast;
}

// Focus visible hook
export function useFocusVisible(): {
  isFocusVisible: boolean;
  onFocus: () => void;
  onBlur: () => void;
  onMouseDown: () => void;
  onKeyDown: (event: KeyboardEvent) => void;
} {
  const [isFocusVisible, setIsFocusVisible] = useState(false);
  const [hadKeyboardEvent, setHadKeyboardEvent] = useState(false);
  
  const onFocus = useCallback(() => {
    if (hadKeyboardEvent) {
      setIsFocusVisible(true);
    }
  }, [hadKeyboardEvent]);
  
  const onBlur = useCallback(() => {
    setIsFocusVisible(false);
    setHadKeyboardEvent(false);
  }, []);
  
  const onMouseDown = useCallback(() => {
    setHadKeyboardEvent(false);
  }, []);
  
  const onKeyDown = useCallback((event: KeyboardEvent) => {
    if (event.key === 'Tab' || event.key === 'Enter' || event.key === ' ') {
      setHadKeyboardEvent(true);
    }
  }, []);
  
  return {
    isFocusVisible,
    onFocus,
    onBlur,
    onMouseDown,
    onKeyDown,
  };
}

// ARIA attributes helper
export class ARIAHelper {
  // Generate unique ID for ARIA relationships
  static generateId(prefix: string = 'aria'): string {
    return `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
  }
  
  // Create ARIA description
  static createDescription(text: string, id?: string): {
    id: string;
    element: HTMLDivElement;
  } {
    const descId = id || this.generateId('desc');
    const element = document.createElement('div');
    element.id = descId;
    element.className = 'sr-only';
    element.textContent = text;
    
    return { id: descId, element };
  }
  
  // Create ARIA label
  static createLabel(text: string, id?: string): {
    id: string;
    element: HTMLDivElement;
  } {
    const labelId = id || this.generateId('label');
    const element = document.createElement('div');
    element.id = labelId;
    element.className = 'sr-only';
    element.textContent = text;
    
    return { id: labelId, element };
  }
}

// Form accessibility utilities
export class FormAccessibility {
  // Validate form accessibility
  static validateFormAccessibility(form: HTMLFormElement): {
    issues: Array<{
      element: HTMLElement;
      issue: string;
      severity: 'error' | 'warning';
    }>;
    isAccessible: boolean;
  } {
    const issues: Array<{
      element: HTMLElement;
      issue: string;
      severity: 'error' | 'warning';
    }> = [];
    
    // Check for labels
    const inputs = form.querySelectorAll('input, select, textarea');
    inputs.forEach((input) => {
      const element = input as HTMLElement;
      const hasLabel = element.labels && element.labels.length > 0;
      const hasAriaLabel = element.hasAttribute('aria-label');
      const hasAriaLabelledBy = element.hasAttribute('aria-labelledby');
      
      if (!hasLabel && !hasAriaLabel && !hasAriaLabelledBy) {
        issues.push({
          element,
          issue: 'Input missing accessible label',
          severity: 'error',
        });
      }
    });
    
    // Check for error messages
    const errorElements = form.querySelectorAll('[aria-invalid="true"]');
    errorElements.forEach((element) => {
      const hasErrorDescription = element.hasAttribute('aria-describedby');
      if (!hasErrorDescription) {
        issues.push({
          element: element as HTMLElement,
          issue: 'Invalid input missing error description',
          severity: 'error',
        });
      }
    });
    
    // Check touch target sizes
    const interactiveElements = form.querySelectorAll('button, input, select, textarea, [role="button"]');
    interactiveElements.forEach((element) => {
      const { isCompliant } = checkTouchTargetSize(element as HTMLElement);
      if (!isCompliant) {
        issues.push({
          element: element as HTMLElement,
          issue: 'Touch target too small (minimum 44px)',
          severity: 'warning',
        });
      }
    });
    
    return {
      issues,
      isAccessible: issues.filter(issue => issue.severity === 'error').length === 0,
    };
  }
  
  // Add error announcement
  static announceFormErrors(errors: string[]): void {
    if (errors.length === 0) return;
    
    const message = errors.length === 1
      ? `Error: ${errors[0]}`
      : `${errors.length} errors found: ${errors.join(', ')}`;
    
    ScreenReaderUtils.announce(message, 'assertive');
  }
}

// CSS classes for accessibility
export const accessibilityClasses = {
  srOnly: 'sr-only',
  focusVisible: 'focus-visible',
  skipLink: 'skip-link',
  highContrast: 'high-contrast',
  reducedMotion: 'reduced-motion',
};

// CSS-in-JS styles for accessibility
export const accessibilityStyles = {
  srOnly: {
    position: 'absolute' as const,
    width: '1px',
    height: '1px',
    padding: 0,
    margin: '-1px',
    overflow: 'hidden',
    clip: 'rect(0, 0, 0, 0)',
    whiteSpace: 'nowrap' as const,
    border: 0,
  },
  
  focusVisible: {
    outline: '2px solid #005fcc',
    outlineOffset: '2px',
  },
  
  skipLink: {
    position: 'absolute' as const,
    top: '-40px',
    left: '6px',
    background: '#000',
    color: '#fff',
    padding: '8px',
    textDecoration: 'none',
    zIndex: 1000,
    '&:focus': {
      top: '6px',
    },
  },
  
  touchTarget: {
    minWidth: '44px',
    minHeight: '44px',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
};

// Initialize accessibility features
export function initializeAccessibility() {
  // Add skip link
  const skipLink = document.createElement('a');
  skipLink.href = '#main-content';
  skipLink.textContent = 'Skip to main content';
  skipLink.className = 'skip-link';
  skipLink.style.cssText = `
    position: absolute;
    top: -40px;
    left: 6px;
    background: #000;
    color: #fff;
    padding: 8px;
    text-decoration: none;
    z-index: 1000;
  `;
  skipLink.addEventListener('focus', () => {
    skipLink.style.top = '6px';
  });
  skipLink.addEventListener('blur', () => {
    skipLink.style.top = '-40px';
  });
  
  document.body.insertBefore(skipLink, document.body.firstChild);
  
  // Add screen reader only styles
  const style = document.createElement('style');
  style.textContent = `
    .sr-only {
      position: absolute !important;
      width: 1px !important;
      height: 1px !important;
      padding: 0 !important;
      margin: -1px !important;
      overflow: hidden !important;
      clip: rect(0, 0, 0, 0) !important;
      white-space: nowrap !important;
      border: 0 !important;
    }
    
    .focus-visible {
      outline: 2px solid #005fcc !important;
      outline-offset: 2px !important;
    }
    
    @media (prefers-reduced-motion: reduce) {
      .reduced-motion * {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
      }
    }
    
    @media (prefers-contrast: high) {
      .high-contrast {
        filter: contrast(150%);
      }
    }
  `;
  
  document.head.appendChild(style);
  
  // Add ARIA live regions
  const politeRegion = document.createElement('div');
  politeRegion.id = 'aria-live-polite';
  politeRegion.setAttribute('aria-live', 'polite');
  politeRegion.setAttribute('aria-atomic', 'true');
  politeRegion.className = 'sr-only';
  document.body.appendChild(politeRegion);
  
  const assertiveRegion = document.createElement('div');
  assertiveRegion.id = 'aria-live-assertive';
  assertiveRegion.setAttribute('aria-live', 'assertive');
  assertiveRegion.setAttribute('aria-atomic', 'true');
  assertiveRegion.className = 'sr-only';
  document.body.appendChild(assertiveRegion);
}

export default {
  ColorContrastChecker,
  FocusManager,
  ScreenReaderUtils,
  KeyboardNavigation,
  ARIAHelper,
  FormAccessibility,
  checkTouchTargetSize,
  useFocusTrap,
  useAnnounce,
  useKeyboardNavigation,
  useReducedMotion,
  useHighContrast,
  useFocusVisible,
  accessibilityClasses,
  accessibilityStyles,
  initializeAccessibility,
};

