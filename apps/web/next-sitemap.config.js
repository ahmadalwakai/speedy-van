/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_APP_URL || 'https://speedy-van.co.uk',
  generateRobotsTxt: true,
  generateIndexSitemap: true,
  sitemapSize: 7000,
  changefreq: 'daily',
  priority: 0.7,
  
  // Exclude admin and API routes
  exclude: [
    '/admin/*',
    '/api/*',
    '/auth/*',
    '/driver/*',
    '/customer-portal/*',
    '/driver-portal/*',
    '/portal/*',
    '/offline',
    '/404',
    '/500',
    '/sitemap.xml',
    '/sitemap-*.xml',
    '/robots.txt'
  ],

  // Custom transform for different page types
  transform: async (config, path) => {
    // High priority pages
    const highPriorityPages = [
      '/',
      '/book',
      '/contact',
      '/services',
      '/about',
      '/how-it-works'
    ];

    // Service pages
    const servicePages = [
      '/services/man-and-van',
      '/services/van-and-man',
      '/services/2-men-with-van',
      '/services/van-with-2-men',
      '/services/furniture-removal',
      '/services/house-removal',
      '/services/full-house-removal',
      '/services/1-bedroom-removal'
    ];

    // Location pages pattern
    const isLocationPage = path.startsWith('/uk/') || 
                          path.includes('man-and-van-') || 
                          path.includes('removals-');

    // Service location combinations
    const isServiceLocationPage = servicePages.some(service => 
      path.includes(service.replace('/services/', ''))
    ) && isLocationPage;

    let priority = 0.5;
    let changefreq = 'weekly';

    if (highPriorityPages.includes(path)) {
      priority = 1.0;
      changefreq = 'daily';
    } else if (servicePages.includes(path)) {
      priority = 0.9;
      changefreq = 'daily';
    } else if (isServiceLocationPage) {
      priority = 0.8;
      changefreq = 'daily';
    } else if (isLocationPage) {
      priority = 0.7;
      changefreq = 'weekly';
    } else if (path.startsWith('/blog/')) {
      priority = 0.6;
      changefreq = 'weekly';
    }

    return {
      loc: path,
      changefreq,
      priority,
      lastmod: config.autoLastmod ? new Date().toISOString() : undefined,
      alternateRefs: [
        {
          href: `${config.siteUrl}${path}`,
          hreflang: 'en-GB',
        },
        {
          href: `${config.siteUrl}${path}`,
          hreflang: 'en',
        },
        {
          href: `${config.siteUrl}${path}`,
          hreflang: 'x-default',
        }
      ]
    };
  },

  // Additional paths for dynamic routes
  additionalPaths: async (config) => {
    const paths = [];

    // Major UK cities for location-based services
    const majorCities = [
      'london', 'birmingham', 'manchester', 'leeds', 'glasgow',
      'liverpool', 'bristol', 'sheffield', 'edinburgh', 'cardiff',
      'belfast', 'leicester', 'brighton', 'nottingham', 'reading',
      'newcastle', 'coventry', 'southampton', 'oxford', 'cambridge'
    ];

    // Core services
    const coreServices = [
      'man-and-van',
      'van-and-man', 
      '2-men-with-van',
      'van-with-2-men',
      'furniture-removal',
      'house-removal',
      'full-house-removal',
      '1-bedroom-removal'
    ];

    // Generate service pages
    coreServices.forEach(service => {
      paths.push({
        loc: `/services/${service}`,
        changefreq: 'daily',
        priority: 0.9,
        lastmod: new Date().toISOString()
      });
    });

    // Generate location-based service pages
    majorCities.forEach(city => {
      // Main location pages
      paths.push({
        loc: `/uk/${city}`,
        changefreq: 'weekly',
        priority: 0.7,
        lastmod: new Date().toISOString()
      });

      // Service + location combinations
      coreServices.forEach(service => {
        paths.push({
          loc: `/uk/${city}/${service}`,
          changefreq: 'daily',
          priority: 0.8,
          lastmod: new Date().toISOString()
        });
      });

      // Alternative URL patterns
      paths.push({
        loc: `/${service.replace('services/', '')}-${city}`,
        changefreq: 'daily',
        priority: 0.8,
        lastmod: new Date().toISOString()
      });
    });

    return paths;
  },

  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin/',
          '/api/',
          '/auth/',
          '/driver/',
          '/customer-portal/',
          '/driver-portal/',
          '/portal/',
          '/offline',
          '/_next/',
          '/uploads/driver-applications/',
          '*.json$'
        ]
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: [
          '/admin/',
          '/api/',
          '/auth/',
          '/driver/',
          '/customer-portal/',
          '/driver-portal/',
          '/portal/',
          '/offline'
        ]
      }
    ],
    additionalSitemaps: [
      `${process.env.NEXT_PUBLIC_APP_URL || 'https://speedy-van.co.uk'}/sitemap.xml`,
      `${process.env.NEXT_PUBLIC_APP_URL || 'https://speedy-van.co.uk'}/sitemap-0.xml`
    ]
  }
};

