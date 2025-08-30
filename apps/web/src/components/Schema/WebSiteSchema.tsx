'use client';

import { WebSite, WithContext } from 'schema-dts';

interface WebSiteSchemaProps {
  className?: string;
}

export default function WebSiteSchema({ className }: WebSiteSchemaProps) {
  const websiteSchema: WithContext<WebSite> = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': 'https://speedy-van.co.uk/#website',
    name: 'Speedy Van - Professional Moving Services',
    alternateName: 'Speedy Van UK',
    url: 'https://speedy-van.co.uk',
    description: 'Professional moving and delivery services across the UK. Book online, get instant quotes, and track your move in real-time.',
    inLanguage: 'en-GB',
    isAccessibleForFree: true,
    isFamilyFriendly: true,
    publisher: {
      '@type': 'Organization',
      '@id': 'https://speedy-van.co.uk/#organization'
    },
    copyrightHolder: {
      '@type': 'Organization',
      '@id': 'https://speedy-van.co.uk/#organization'
    },
    copyrightYear: 2024,
    potentialAction: [
      {
        '@type': 'SearchAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: 'https://speedy-van.co.uk/search?q={search_term_string}',
          actionPlatform: [
            'https://schema.org/DesktopWebPlatform',
            'https://schema.org/MobileWebPlatform'
          ]
        },
        'query-input': {
          '@type': 'PropertyValueSpecification',
          valueRequired: true,
          valueName: 'search_term_string',
          description: 'Search for moving services, locations, or help topics'
        }
      },
      {
        '@type': 'ReadAction',
        target: 'https://speedy-van.co.uk',
        object: {
          '@type': 'WebPage',
          name: 'Speedy Van Homepage'
        }
      }
    ],
    mainEntity: {
      '@type': 'Organization',
      '@id': 'https://speedy-van.co.uk/#organization'
    },
    about: [
      {
        '@type': 'Thing',
        name: 'Moving Services',
        description: 'Professional moving and relocation services'
      },
      {
        '@type': 'Thing',
        name: 'Man and Van',
        description: 'Man and van hire services across the UK'
      },
      {
        '@type': 'Thing',
        name: 'House Removals',
        description: 'Complete house removal and relocation services'
      },
      {
        '@type': 'Thing',
        name: 'Furniture Delivery',
        description: 'Furniture delivery and assembly services'
      }
    ],
    keywords: [
      'man and van',
      'house removals',
      'furniture delivery',
      'moving services',
      'van hire',
      'removal company',
      'professional movers',
      'UK moving services'
    ],
    audience: {
      '@type': 'Audience',
      audienceType: 'Homeowners, Renters, Businesses',
      geographicArea: {
        '@type': 'Country',
        name: 'United Kingdom'
      }
    },
    hasPart: [
      {
        '@type': 'WebPage',
        '@id': 'https://speedy-van.co.uk/services',
        name: 'Services',
        description: 'Complete range of moving and delivery services'
      },
      {
        '@type': 'WebPage',
        '@id': 'https://speedy-van.co.uk/book',
        name: 'Book Now',
        description: 'Book your moving service online'
      },
      {
        '@type': 'WebPage',
        '@id': 'https://speedy-van.co.uk/contact',
        name: 'Contact Us',
        description: 'Get in touch for quotes and support'
      },
      {
        '@type': 'WebPage',
        '@id': 'https://speedy-van.co.uk/about',
        name: 'About Us',
        description: 'Learn about our professional moving team'
      },
      {
        '@type': 'WebPage',
        '@id': 'https://speedy-van.co.uk/reviews',
        name: 'Customer Reviews',
        description: 'Read verified customer reviews and testimonials'
      }
    ],
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: 'https://speedy-van.co.uk'
        }
      ]
    }
  };

  return (
    <script
      type="application/ld+json"
      className={className}
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(websiteSchema, null, 2)
      }}
    />
  );
}

