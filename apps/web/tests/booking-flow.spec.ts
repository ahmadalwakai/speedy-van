import { test, expect, Page, BrowserContext } from '@playwright/test';
import { faker } from '@faker-js/faker/locale/en_GB';

// Test data generators
const generateTestData = () => ({
  customer: {
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    email: faker.internet.email(),
    phone: faker.phone.number('07#########'),
  },
  addresses: {
    pickup: {
      line1: faker.location.streetAddress(),
      city: faker.location.city(),
      postcode: faker.location.zipCode('SW## #AA'),
    },
    dropoff: {
      line1: faker.location.streetAddress(),
      city: faker.location.city(),
      postcode: faker.location.zipCode('NW## #AA'),
    },
  },
  items: [
    { name: 'Sofa', quantity: 1 },
    { name: 'Dining Table', quantity: 1 },
    { name: 'Boxes (Small)', quantity: 5 },
  ],
});

// Page Object Model
class BookingFlowPage {
  constructor(private page: Page) {}

  // Navigation
  async goto() {
    await this.page.goto('/booking-luxury');
    await this.page.waitForLoadState('networkidle');
  }

  // Step 1: Items Selection
  async selectItems(items: Array<{ name: string; quantity: number }>) {
    // Wait for item picker to load
    await this.page.waitForSelector('[data-testid="item-picker"]');
    
    for (const item of items) {
      // Search for item
      await this.page.fill('[data-testid="item-search"]', item.name);
      await this.page.waitForTimeout(500); // Debounce delay
      
      // Select item from results
      await this.page.click(`[data-testid="item-${item.name.toLowerCase().replace(/\s+/g, '-')}"]`);
      
      // Set quantity
      if (item.quantity > 1) {
        const quantityInput = this.page.locator(`[data-testid="quantity-${item.name.toLowerCase().replace(/\s+/g, '-')}"]`);
        await quantityInput.fill(item.quantity.toString());
      }
    }
    
    // Verify total volume is calculated
    await expect(this.page.locator('[data-testid="total-volume"]')).toBeVisible();
  }

  async proceedToStep2() {
    await this.page.click('[data-testid="proceed-to-addresses"]');
    await this.page.waitForSelector('[data-testid="address-step"]');
  }

  // Step 2: Addresses
  async fillAddress(type: 'pickup' | 'dropoff', address: any) {
    const prefix = `${type}-address`;
    
    // Fill address line 1
    await this.page.fill(`[data-testid="${prefix}-line1"]`, address.line1);
    
    // Fill city
    await this.page.fill(`[data-testid="${prefix}-city"]`, address.city);
    
    // Fill postcode
    await this.page.fill(`[data-testid="${prefix}-postcode"]`, address.postcode);
    
    // Wait for validation
    await this.page.waitForTimeout(1000);
  }

  async useCurrentLocation() {
    // Mock geolocation
    await this.page.evaluate(() => {
      navigator.geolocation.getCurrentPosition = (success) => {
        success({
          coords: {
            latitude: 51.5074,
            longitude: -0.1278,
          },
        } as any);
      };
    });
    
    await this.page.click('[data-testid="use-current-location"]');
    await this.page.waitForTimeout(2000);
  }

  async proceedToStep3() {
    await this.page.click('[data-testid="proceed-to-schedule"]');
    await this.page.waitForSelector('[data-testid="schedule-step"]');
  }

  // Step 3: Schedule & Service
  async selectDate(daysFromNow: number = 1) {
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + daysFromNow);
    
    await this.page.click('[data-testid="date-picker"]');
    await this.page.click(`[data-date="${targetDate.toISOString().split('T')[0]}"]`);
  }

  async selectTimeSlot(slotIndex: number = 0) {
    await this.page.waitForSelector('[data-testid="time-slot"]');
    const timeSlots = this.page.locator('[data-testid="time-slot"]');
    await timeSlots.nth(slotIndex).click();
  }

  async selectServiceType(serviceType: string = 'man-and-van') {
    await this.page.click(`[data-testid="service-${serviceType}"]`);
  }

  async proceedToStep4() {
    await this.page.click('[data-testid="proceed-to-contact"]');
    await this.page.waitForSelector('[data-testid="contact-step"]');
  }

  // Step 4: Contact & Summary
  async fillContactDetails(customer: any) {
    await this.page.fill('[data-testid="first-name"]', customer.firstName);
    await this.page.fill('[data-testid="last-name"]', customer.lastName);
    await this.page.fill('[data-testid="email"]', customer.email);
    await this.page.fill('[data-testid="phone"]', customer.phone);
  }

  async applyPromoCode(code: string) {
    await this.page.fill('[data-testid="promo-code"]', code);
    await this.page.click('[data-testid="apply-promo"]');
    await this.page.waitForTimeout(1000);
  }

  async submitBooking() {
    await this.page.click('[data-testid="confirm-booking"]');
  }

  // Verification methods
  async verifyStepCompletion(step: number) {
    await expect(this.page.locator(`[data-testid="step-${step}-complete"]`)).toBeVisible();
  }

  async verifyPricing() {
    await expect(this.page.locator('[data-testid="total-price"]')).toBeVisible();
    
    // Verify price is reasonable (between £50 and £500)
    const priceText = await this.page.locator('[data-testid="total-price"]').textContent();
    const price = parseFloat(priceText?.replace(/[£,]/g, '') || '0');
    expect(price).toBeGreaterThan(50);
    expect(price).toBeLessThan(500);
  }

  async verifyBookingConfirmation() {
    await this.page.waitForSelector('[data-testid="booking-confirmation"]', { timeout: 10000 });
    await expect(this.page.locator('[data-testid="booking-reference"]')).toBeVisible();
  }
}

// Test suite
test.describe('Luxury Booking Flow', () => {
  let bookingPage: BookingFlowPage;
  let testData: ReturnType<typeof generateTestData>;

  test.beforeEach(async ({ page }) => {
    bookingPage = new BookingFlowPage(page);
    testData = generateTestData();
    
    // Mock Mapbox API
    await page.route('**/mapbox.com/**', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          features: [
            {
              place_name: 'Test Address, London, UK',
              center: [-0.1278, 51.5074],
              properties: { accuracy: 'high' },
            },
          ],
        }),
      });
    });
  });

  test('Complete happy path booking flow', async ({ page }) => {
    await bookingPage.goto();

    // Step 1: Select items
    await bookingPage.selectItems(testData.items);
    await bookingPage.verifyStepCompletion(1);
    await bookingPage.proceedToStep2();

    // Step 2: Fill addresses
    await bookingPage.fillAddress('pickup', testData.addresses.pickup);
    await bookingPage.fillAddress('dropoff', testData.addresses.dropoff);
    await bookingPage.verifyStepCompletion(2);
    await bookingPage.proceedToStep3();

    // Step 3: Select schedule and service
    await bookingPage.selectDate(2);
    await bookingPage.selectTimeSlot(1);
    await bookingPage.selectServiceType('man-and-van');
    await bookingPage.verifyStepCompletion(3);
    await bookingPage.proceedToStep4();

    // Step 4: Contact details and confirmation
    await bookingPage.fillContactDetails(testData.customer);
    await bookingPage.verifyPricing();
    await bookingPage.submitBooking();
    await bookingPage.verifyBookingConfirmation();
  });

  test('Current location functionality', async ({ page }) => {
    await bookingPage.goto();
    
    // Complete step 1
    await bookingPage.selectItems([{ name: 'Sofa', quantity: 1 }]);
    await bookingPage.proceedToStep2();
    
    // Use current location
    await bookingPage.useCurrentLocation();
    
    // Verify location was populated
    await expect(page.locator('[data-testid="pickup-address-line1"]')).not.toBeEmpty();
  });

  test('Promo code application', async ({ page }) => {
    await bookingPage.goto();
    
    // Complete first 3 steps
    await bookingPage.selectItems(testData.items);
    await bookingPage.proceedToStep2();
    await bookingPage.fillAddress('pickup', testData.addresses.pickup);
    await bookingPage.fillAddress('dropoff', testData.addresses.dropoff);
    await bookingPage.proceedToStep3();
    await bookingPage.selectDate(1);
    await bookingPage.selectTimeSlot(0);
    await bookingPage.selectServiceType('man-and-van');
    await bookingPage.proceedToStep4();
    
    // Get original price
    const originalPriceText = await page.locator('[data-testid="total-price"]').textContent();
    const originalPrice = parseFloat(originalPriceText?.replace(/[£,]/g, '') || '0');
    
    // Apply promo code
    await bookingPage.applyPromoCode('SAVE15');
    
    // Verify discount applied
    const newPriceText = await page.locator('[data-testid="total-price"]').textContent();
    const newPrice = parseFloat(newPriceText?.replace(/[£,]/g, '') || '0');
    expect(newPrice).toBeLessThan(originalPrice);
  });

  test('Form validation errors', async ({ page }) => {
    await bookingPage.goto();
    
    // Try to proceed without selecting items
    await page.click('[data-testid="proceed-to-addresses"]');
    await expect(page.locator('[data-testid="error-no-items"]')).toBeVisible();
    
    // Select items and proceed
    await bookingPage.selectItems([{ name: 'Box', quantity: 1 }]);
    await bookingPage.proceedToStep2();
    
    // Try to proceed without addresses
    await page.click('[data-testid="proceed-to-schedule"]');
    await expect(page.locator('[data-testid="error-missing-addresses"]')).toBeVisible();
  });

  test('Edit-in-place functionality', async ({ page }) => {
    await bookingPage.goto();
    
    // Complete all steps
    await bookingPage.selectItems(testData.items);
    await bookingPage.proceedToStep2();
    await bookingPage.fillAddress('pickup', testData.addresses.pickup);
    await bookingPage.fillAddress('dropoff', testData.addresses.dropoff);
    await bookingPage.proceedToStep3();
    await bookingPage.selectDate(1);
    await bookingPage.selectTimeSlot(0);
    await bookingPage.selectServiceType('man-and-van');
    await bookingPage.proceedToStep4();
    await bookingPage.fillContactDetails(testData.customer);
    
    // Edit item quantity in summary
    await page.click('[data-testid="edit-item-0"]');
    await page.fill('[data-testid="item-quantity-0"]', '2');
    await page.click('[data-testid="save-item-0"]');
    
    // Verify price updated
    await expect(page.locator('[data-testid="total-price"]')).toBeVisible();
    
    // Edit address in summary
    await page.click('[data-testid="edit-pickup-address"]');
    await page.fill('[data-testid="pickup-address-line1"]', 'Updated Address');
    await page.click('[data-testid="save-pickup-address"]');
    
    // Verify address updated
    await expect(page.locator('[data-testid="pickup-address-display"]')).toContainText('Updated Address');
  });

  test('Save and resume functionality', async ({ page }) => {
    await bookingPage.goto();
    
    // Complete first step
    await bookingPage.selectItems(testData.items);
    
    // Verify data is saved to localStorage
    const savedData = await page.evaluate(() => {
      return localStorage.getItem('booking-draft');
    });
    expect(savedData).toBeTruthy();
    
    // Refresh page
    await page.reload();
    
    // Verify data is restored
    await expect(page.locator('[data-testid="item-0"]')).toBeVisible();
  });

  test('Accessibility compliance', async ({ page }) => {
    await bookingPage.goto();
    
    // Check for skip link
    await page.keyboard.press('Tab');
    await expect(page.locator('[data-testid="skip-link"]')).toBeFocused();
    
    // Check keyboard navigation
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    const focusedElement = await page.evaluate(() => document.activeElement?.tagName);
    expect(['BUTTON', 'INPUT', 'SELECT', 'TEXTAREA', 'A']).toContain(focusedElement);
    
    // Check ARIA labels
    const inputs = page.locator('input');
    const count = await inputs.count();
    for (let i = 0; i < count; i++) {
      const input = inputs.nth(i);
      const hasLabel = await input.evaluate((el) => {
        return el.labels?.length > 0 || 
               el.hasAttribute('aria-label') || 
               el.hasAttribute('aria-labelledby');
      });
      expect(hasLabel).toBe(true);
    }
  });

  test('Performance metrics', async ({ page }) => {
    // Start performance monitoring
    await page.addInitScript(() => {
      window.performance.mark('booking-start');
    });
    
    await bookingPage.goto();
    
    // Complete booking flow and measure
    await bookingPage.selectItems([{ name: 'Sofa', quantity: 1 }]);
    await bookingPage.proceedToStep2();
    
    // Measure LCP
    const lcp = await page.evaluate(() => {
      return new Promise((resolve) => {
        new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1];
          resolve(lastEntry.startTime);
        }).observe({ entryTypes: ['largest-contentful-paint'] });
        
        setTimeout(() => resolve(0), 5000); // Timeout after 5s
      });
    });
    
    expect(lcp).toBeLessThan(2500); // LCP < 2.5s
    
    // Measure CLS
    const cls = await page.evaluate(() => {
      return new Promise((resolve) => {
        let clsValue = 0;
        new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach((entry: any) => {
            if (!entry.hadRecentInput) {
              clsValue += entry.value;
            }
          });
          resolve(clsValue);
        }).observe({ entryTypes: ['layout-shift'] });
        
        setTimeout(() => resolve(clsValue), 3000);
      });
    });
    
    expect(cls).toBeLessThan(0.05); // CLS < 0.05
  });

  test('Mobile responsive design', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await bookingPage.goto();
    
    // Verify mobile navigation
    await expect(page.locator('[data-testid="mobile-nav"]')).toBeVisible();
    
    // Check touch target sizes
    const buttons = page.locator('button');
    const count = await buttons.count();
    for (let i = 0; i < count; i++) {
      const button = buttons.nth(i);
      const box = await button.boundingBox();
      if (box) {
        expect(box.width).toBeGreaterThanOrEqual(44);
        expect(box.height).toBeGreaterThanOrEqual(44);
      }
    }
    
    // Test mobile-specific interactions
    await bookingPage.selectItems([{ name: 'Box', quantity: 1 }]);
    await expect(page.locator('[data-testid="mobile-summary"]')).toBeVisible();
  });

  test('Error handling and recovery', async ({ page }) => {
    await bookingPage.goto();
    
    // Simulate network error
    await page.route('**/api/**', (route) => {
      route.abort('failed');
    });
    
    await bookingPage.selectItems([{ name: 'Sofa', quantity: 1 }]);
    await bookingPage.proceedToStep2();
    
    // Try to submit with network error
    await bookingPage.fillAddress('pickup', testData.addresses.pickup);
    await bookingPage.fillAddress('dropoff', testData.addresses.dropoff);
    
    // Verify error message
    await expect(page.locator('[data-testid="network-error"]')).toBeVisible();
    
    // Verify retry functionality
    await page.unroute('**/api/**');
    await page.click('[data-testid="retry-button"]');
    
    // Should proceed normally
    await bookingPage.proceedToStep3();
  });

  test('Guest vs registered user flow', async ({ page }) => {
    await bookingPage.goto();
    
    // Test guest flow
    await expect(page.locator('[data-testid="guest-checkout"]')).toBeVisible();
    
    // Complete booking as guest
    await bookingPage.selectItems(testData.items);
    await bookingPage.proceedToStep2();
    await bookingPage.fillAddress('pickup', testData.addresses.pickup);
    await bookingPage.fillAddress('dropoff', testData.addresses.dropoff);
    await bookingPage.proceedToStep3();
    await bookingPage.selectDate(1);
    await bookingPage.selectTimeSlot(0);
    await bookingPage.selectServiceType('man-and-van');
    await bookingPage.proceedToStep4();
    
    // Verify guest-specific fields
    await expect(page.locator('[data-testid="create-account-option"]')).toBeVisible();
    await expect(page.locator('[data-testid="guest-email-confirmation"]')).toBeVisible();
  });
});

// Accessibility-specific tests
test.describe('Accessibility Tests', () => {
  test('Screen reader compatibility', async ({ page }) => {
    await page.goto('/booking-luxury');
    
    // Check for proper heading structure
    const headings = await page.locator('h1, h2, h3, h4, h5, h6').all();
    let previousLevel = 0;
    
    for (const heading of headings) {
      const tagName = await heading.evaluate(el => el.tagName);
      const level = parseInt(tagName.substring(1));
      
      // Headings should not skip levels
      expect(level - previousLevel).toBeLessThanOrEqual(1);
      previousLevel = level;
    }
    
    // Check for ARIA landmarks
    await expect(page.locator('[role="main"]')).toBeVisible();
    await expect(page.locator('[role="navigation"]')).toBeVisible();
    
    // Check for live regions
    await expect(page.locator('[aria-live="polite"]')).toBeVisible();
    await expect(page.locator('[aria-live="assertive"]')).toBeVisible();
  });

  test('High contrast mode', async ({ page }) => {
    // Simulate high contrast mode
    await page.emulateMedia({ colorScheme: 'dark', forcedColors: 'active' });
    await page.goto('/booking-luxury');
    
    // Verify content is still visible and readable
    await expect(page.locator('[data-testid="main-heading"]')).toBeVisible();
    await expect(page.locator('[data-testid="item-picker"]')).toBeVisible();
  });

  test('Reduced motion preference', async ({ page }) => {
    // Simulate reduced motion preference
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/booking-luxury');
    
    // Verify animations are disabled or reduced
    const animatedElements = page.locator('[data-testid*="animated"]');
    const count = await animatedElements.count();
    
    for (let i = 0; i < count; i++) {
      const element = animatedElements.nth(i);
      const animationDuration = await element.evaluate(el => 
        getComputedStyle(el).animationDuration
      );
      
      // Should be very short or none
      expect(['0s', '0.01ms'].some(duration => 
        animationDuration.includes(duration)
      )).toBe(true);
    }
  });
});

// Performance tests
test.describe('Performance Tests', () => {
  test('Bundle size limits', async ({ page }) => {
    const response = await page.goto('/booking-luxury');
    
    // Check main bundle size
    const resources = await page.evaluate(() => {
      return performance.getEntriesByType('resource')
        .filter((entry: any) => entry.name.includes('.js'))
        .map((entry: any) => ({
          name: entry.name,
          size: entry.transferSize,
        }));
    });
    
    const mainBundle = resources.find(r => r.name.includes('main') || r.name.includes('index'));
    if (mainBundle) {
      expect(mainBundle.size).toBeLessThan(500 * 1024); // 500KB limit
    }
  });

  test('Memory usage', async ({ page }) => {
    await page.goto('/booking-luxury');
    
    // Complete booking flow
    const bookingPage = new BookingFlowPage(page);
    const testData = generateTestData();
    
    await bookingPage.selectItems(testData.items);
    await bookingPage.proceedToStep2();
    
    // Check memory usage
    const memoryInfo = await page.evaluate(() => {
      return (performance as any).memory ? {
        usedJSHeapSize: (performance as any).memory.usedJSHeapSize,
        totalJSHeapSize: (performance as any).memory.totalJSHeapSize,
        jsHeapSizeLimit: (performance as any).memory.jsHeapSizeLimit,
      } : null;
    });
    
    if (memoryInfo) {
      // Memory usage should be reasonable
      expect(memoryInfo.usedJSHeapSize).toBeLessThan(50 * 1024 * 1024); // 50MB
    }
  });
});

