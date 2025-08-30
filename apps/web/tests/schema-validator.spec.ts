import { test, expect, Page } from '@playwright/test';

interface SchemaValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  schemaType: string;
}

class SchemaValidator {
  private page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async extractJsonLdSchemas(): Promise<any[]> {
    return await this.page.evaluate(() => {
      const scripts = Array.from(document.querySelectorAll('script[type="application/ld+json"]'));
      return scripts.map(script => {
        try {
          return JSON.parse(script.textContent || '');
        } catch (e) {
          return null;
        }
      }).filter(Boolean);
    });
  }

  async validateOrganizationSchema(schema: any): Promise<SchemaValidationResult> {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Required fields for Organization schema
    if (!schema['@type'] || schema['@type'] !== 'Organization') {
      errors.push('Missing or incorrect @type for Organization schema');
    }

    if (!schema.name) {
      errors.push('Organization schema missing required "name" field');
    }

    if (!schema.url) {
      errors.push('Organization schema missing required "url" field');
    }

    if (!schema.logo) {
      warnings.push('Organization schema missing "logo" field (recommended for rich results)');
    }

    if (!schema.contactPoint) {
      warnings.push('Organization schema missing "contactPoint" field (recommended for rich results)');
    }

    if (!schema.address) {
      warnings.push('Organization schema missing "address" field (recommended for local business)');
    }

    if (!schema.foundingDate) {
      warnings.push('Organization schema missing "foundingDate" field');
    }

    if (!schema.founders) {
      warnings.push('Organization schema missing "founders" field');
    }

    if (!schema.sameAs || !Array.isArray(schema.sameAs) || schema.sameAs.length === 0) {
      warnings.push('Organization schema missing "sameAs" field (social media profiles)');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      schemaType: 'Organization'
    };
  }

  async validateWebSiteSchema(schema: any): Promise<SchemaValidationResult> {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (!schema['@type'] || schema['@type'] !== 'WebSite') {
      errors.push('Missing or incorrect @type for WebSite schema');
    }

    if (!schema.name) {
      errors.push('WebSite schema missing required "name" field');
    }

    if (!schema.url) {
      errors.push('WebSite schema missing required "url" field');
    }

    if (!schema.potentialAction) {
      warnings.push('WebSite schema missing "potentialAction" (SearchAction) for sitelinks searchbox');
    } else if (schema.potentialAction['@type'] !== 'SearchAction') {
      warnings.push('WebSite schema potentialAction should be of type "SearchAction"');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      schemaType: 'WebSite'
    };
  }

  async validateLocalBusinessSchema(schema: any): Promise<SchemaValidationResult> {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (!schema['@type'] || !schema['@type'].includes('LocalBusiness')) {
      errors.push('Missing or incorrect @type for LocalBusiness schema');
    }

    if (!schema.name) {
      errors.push('LocalBusiness schema missing required "name" field');
    }

    if (!schema.address) {
      errors.push('LocalBusiness schema missing required "address" field');
    }

    if (!schema.telephone) {
      errors.push('LocalBusiness schema missing required "telephone" field');
    }

    if (!schema.aggregateRating) {
      warnings.push('LocalBusiness schema missing "aggregateRating" (Trustpilot reviews)');
    } else {
      const rating = schema.aggregateRating;
      if (!rating.ratingValue || !rating.ratingCount || !rating.bestRating) {
        warnings.push('aggregateRating missing required fields (ratingValue, ratingCount, bestRating)');
      }
    }

    if (!schema.openingHours) {
      warnings.push('LocalBusiness schema missing "openingHours" field');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      schemaType: 'LocalBusiness'
    };
  }

  async validateServiceSchema(schema: any): Promise<SchemaValidationResult> {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (!schema['@type'] || schema['@type'] !== 'Service') {
      errors.push('Missing or incorrect @type for Service schema');
    }

    if (!schema.name) {
      errors.push('Service schema missing required "name" field');
    }

    if (!schema.description) {
      errors.push('Service schema missing required "description" field');
    }

    if (!schema.provider) {
      warnings.push('Service schema missing "provider" field');
    }

    if (!schema.areaServed) {
      warnings.push('Service schema missing "areaServed" field (geographic coverage)');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      schemaType: 'Service'
    };
  }

  async validateBreadcrumbSchema(schema: any): Promise<SchemaValidationResult> {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (!schema['@type'] || schema['@type'] !== 'BreadcrumbList') {
      errors.push('Missing or incorrect @type for BreadcrumbList schema');
    }

    if (!schema.itemListElement || !Array.isArray(schema.itemListElement)) {
      errors.push('BreadcrumbList schema missing required "itemListElement" array');
    } else {
      schema.itemListElement.forEach((item: any, index: number) => {
        if (!item['@type'] || item['@type'] !== 'ListItem') {
          errors.push(`BreadcrumbList item ${index} missing @type "ListItem"`);
        }
        if (!item.position) {
          errors.push(`BreadcrumbList item ${index} missing "position" field`);
        }
        if (!item.name) {
          errors.push(`BreadcrumbList item ${index} missing "name" field`);
        }
        if (!item.item) {
          errors.push(`BreadcrumbList item ${index} missing "item" URL field`);
        }
      });
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      schemaType: 'BreadcrumbList'
    };
  }
}

test.describe('Schema Validation for Rich Results', () => {
  let validator: SchemaValidator;

  test.beforeEach(async ({ page }) => {
    validator = new SchemaValidator(page);
  });

  test('Homepage should have valid Organization schema', async ({ page }) => {
    await page.goto('/');
    
    const schemas = await validator.extractJsonLdSchemas();
    const organizationSchema = schemas.find(s => s['@type'] === 'Organization');
    
    expect(organizationSchema).toBeTruthy();
    
    const result = await validator.validateOrganizationSchema(organizationSchema);
    
    // Log warnings but don't fail the test
    if (result.warnings.length > 0) {
      console.warn('Organization schema warnings:', result.warnings);
    }
    
    // Fail test on errors
    expect(result.errors).toHaveLength(0);
    expect(result.isValid).toBe(true);
  });

  test('Homepage should have valid WebSite schema with SearchAction', async ({ page }) => {
    await page.goto('/');
    
    const schemas = await validator.extractJsonLdSchemas();
    const websiteSchema = schemas.find(s => s['@type'] === 'WebSite');
    
    expect(websiteSchema).toBeTruthy();
    
    const result = await validator.validateWebSiteSchema(websiteSchema);
    
    if (result.warnings.length > 0) {
      console.warn('WebSite schema warnings:', result.warnings);
    }
    
    expect(result.errors).toHaveLength(0);
    expect(result.isValid).toBe(true);
  });

  test('Contact page should have valid LocalBusiness schema', async ({ page }) => {
    await page.goto('/contact');
    
    const schemas = await validator.extractJsonLdSchemas();
    const localBusinessSchema = schemas.find(s => 
      s['@type'] && (s['@type'].includes('LocalBusiness') || s['@type'] === 'MovingCompany')
    );
    
    expect(localBusinessSchema).toBeTruthy();
    
    const result = await validator.validateLocalBusinessSchema(localBusinessSchema);
    
    if (result.warnings.length > 0) {
      console.warn('LocalBusiness schema warnings:', result.warnings);
    }
    
    expect(result.errors).toHaveLength(0);
    expect(result.isValid).toBe(true);
  });

  test('Service pages should have valid Service schema', async ({ page }) => {
    const servicePages = [
      '/services/man-and-van',
      '/services/house-removal',
      '/services/furniture-removal'
    ];

    for (const servicePage of servicePages) {
      await page.goto(servicePage);
      
      const schemas = await validator.extractJsonLdSchemas();
      const serviceSchema = schemas.find(s => s['@type'] === 'Service');
      
      expect(serviceSchema, `Service schema not found on ${servicePage}`).toBeTruthy();
      
      const result = await validator.validateServiceSchema(serviceSchema);
      
      if (result.warnings.length > 0) {
        console.warn(`Service schema warnings for ${servicePage}:`, result.warnings);
      }
      
      expect(result.errors, `Service schema errors on ${servicePage}: ${result.errors.join(', ')}`).toHaveLength(0);
      expect(result.isValid).toBe(true);
    }
  });

  test('All pages should have valid breadcrumb schema', async ({ page }) => {
    const pages = [
      '/',
      '/about',
      '/services',
      '/contact',
      '/how-it-works'
    ];

    for (const pagePath of pages) {
      await page.goto(pagePath);
      
      const schemas = await validator.extractJsonLdSchemas();
      const breadcrumbSchema = schemas.find(s => s['@type'] === 'BreadcrumbList');
      
      if (breadcrumbSchema) {
        const result = await validator.validateBreadcrumbSchema(breadcrumbSchema);
        
        if (result.warnings.length > 0) {
          console.warn(`Breadcrumb schema warnings for ${pagePath}:`, result.warnings);
        }
        
        expect(result.errors, `Breadcrumb schema errors on ${pagePath}: ${result.errors.join(', ')}`).toHaveLength(0);
        expect(result.isValid).toBe(true);
      }
    }
  });

  test('Schema markup should be valid JSON-LD', async ({ page }) => {
    const pages = ['/', '/about', '/contact', '/services'];

    for (const pagePath of pages) {
      await page.goto(pagePath);
      
      const schemas = await validator.extractJsonLdSchemas();
      
      expect(schemas.length, `No JSON-LD schemas found on ${pagePath}`).toBeGreaterThan(0);
      
      schemas.forEach((schema, index) => {
        expect(schema, `Invalid JSON-LD schema ${index} on ${pagePath}`).toBeTruthy();
        expect(schema['@context'], `Missing @context in schema ${index} on ${pagePath}`).toBeTruthy();
        expect(schema['@type'], `Missing @type in schema ${index} on ${pagePath}`).toBeTruthy();
      });
    }
  });

  test('Rich Results eligibility check', async ({ page }) => {
    await page.goto('/');
    
    const schemas = await validator.extractJsonLdSchemas();
    
    // Check for required schemas for rich results
    const hasOrganization = schemas.some(s => s['@type'] === 'Organization');
    const hasWebSite = schemas.some(s => s['@type'] === 'WebSite');
    const hasLocalBusiness = schemas.some(s => s['@type'] && s['@type'].includes('LocalBusiness'));
    
    expect(hasOrganization, 'Missing Organization schema for rich results').toBe(true);
    expect(hasWebSite, 'Missing WebSite schema for sitelinks searchbox').toBe(true);
    
    // Log rich results eligibility
    console.log('Rich Results Eligibility Check:');
    console.log('✓ Organization schema:', hasOrganization);
    console.log('✓ WebSite schema:', hasWebSite);
    console.log('✓ LocalBusiness schema:', hasLocalBusiness);
  });
});

