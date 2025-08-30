import { chromium, FullConfig } from '@playwright/test';

async function globalSetup(config: FullConfig) {
  console.log('🚀 Starting global test setup...');
  
  // Launch browser for setup
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  try {
    // Wait for the dev server to be ready
    console.log('⏳ Waiting for dev server...');
    await page.goto(config.projects[0].use.baseURL || 'http://localhost:3000');
    await page.waitForLoadState('networkidle');
    console.log('✅ Dev server is ready');
    
    // Set up test data if needed
    console.log('📊 Setting up test data...');
    
    // Mock external services for testing
    await page.addInitScript(() => {
      // Mock Mapbox API
      window.fetch = new Proxy(window.fetch, {
        apply: (target, thisArg, argumentsList) => {
          const [url] = argumentsList;
          
          if (typeof url === 'string' && url.includes('mapbox.com')) {
            return Promise.resolve(new Response(JSON.stringify({
              features: [
                {
                  place_name: 'Test Address, London, UK',
                  center: [-0.1278, 51.5074],
                  properties: { accuracy: 'high' },
                  context: [
                    { id: 'postcode', text: 'SW1A 1AA' },
                    { id: 'place', text: 'London' },
                    { id: 'country', text: 'United Kingdom' },
                  ],
                },
              ],
            }), {
              status: 200,
              headers: { 'Content-Type': 'application/json' },
            }));
          }
          
          return Reflect.apply(target, thisArg, argumentsList);
        },
      });
      
      // Mock geolocation
      Object.defineProperty(navigator, 'geolocation', {
        value: {
          getCurrentPosition: (success: PositionCallback) => {
            success({
              coords: {
                latitude: 51.5074,
                longitude: -0.1278,
                accuracy: 10,
                altitude: null,
                altitudeAccuracy: null,
                heading: null,
                speed: null,
              },
              timestamp: Date.now(),
            });
          },
          watchPosition: () => 1,
          clearWatch: () => {},
        },
        writable: true,
      });
      
      // Mock performance API for testing
      if (!window.performance.memory) {
        Object.defineProperty(window.performance, 'memory', {
          value: {
            usedJSHeapSize: 10 * 1024 * 1024, // 10MB
            totalJSHeapSize: 20 * 1024 * 1024, // 20MB
            jsHeapSizeLimit: 100 * 1024 * 1024, // 100MB
          },
          writable: true,
        });
      }
    });
    
    // Clear any existing test data
    await page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });
    
    console.log('✅ Test setup completed');
    
  } catch (error) {
    console.error('❌ Global setup failed:', error);
    throw error;
  } finally {
    await browser.close();
  }
}

export default globalSetup;

