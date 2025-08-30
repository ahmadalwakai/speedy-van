'use client';

import { LocalBusiness, WithContext } from 'schema-dts';

interface LocalBusinessSchemaProps {
  className?: string;
  location?: {
    city: string;
    region: string;
    postalCode?: string;
    streetAddress?: string;
  };
}

export default function LocalBusinessSchema({ 
  className,
  location = {
    city: 'London',
    region: 'England'
  }
}: LocalBusinessSchemaProps) {
  const localBusinessSchema: WithContext<LocalBusiness> = {
    '@context': 'https://schema.org',
    '@type': ['LocalBusiness', 'MovingCompany'],
    '@id': `https://speedy-van.co.uk/#localbusiness-${location.city.toLowerCase()}`,
    name: `Speedy Van - ${location.city}`,
    image: [
      {
        '@type': 'ImageObject',
        url: 'https://speedy-van.co.uk/images/speedy-van-service.jpg',
        width: 1200,
        height: 630,
        caption: `Speedy Van moving service in ${location.city}`
      }
    ],
    description: `Professional man and van services in ${location.city}. Fast, reliable house removals, furniture delivery, and moving services with live tracking.`,
    url: `https://speedy-van.co.uk/uk/${location.city.toLowerCase()}`,
    telephone: '+44-20-XXXX-XXXX',
    email: 'hello@speedy-van.co.uk',
    address: {
      '@type': 'PostalAddress',
      streetAddress: location.streetAddress || '',
      addressLocality: location.city,
      addressRegion: location.region,
      postalCode: location.postalCode || '',
      addressCountry: 'GB'
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: location.city === 'London' ? 51.5074 : 52.4862,
      longitude: location.city === 'London' ? -0.1278 : -1.8904
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: [
          'Monday',
          'Tuesday',
          'Wednesday', 
          'Thursday',
          'Friday'
        ],
        opens: '06:00',
        closes: '22:00'
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Saturday'],
        opens: '07:00',
        closes: '20:00'
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Sunday'],
        opens: '08:00',
        closes: '18:00'
      }
    ],
    priceRange: '££',
    currenciesAccepted: 'GBP',
    paymentAccepted: [
      'Cash',
      'Credit Card',
      'Debit Card',
      'Bank Transfer',
      'PayPal'
    ],
    areaServed: [
      {
        '@type': 'City',
        name: location.city
      },
      {
        '@type': 'State',
        name: location.region
      },
      {
        '@type': 'Country',
        name: 'United Kingdom'
      }
    ],
    serviceArea: {
      '@type': 'GeoCircle',
      geoMidpoint: {
        '@type': 'GeoCoordinates',
        latitude: location.city === 'London' ? 51.5074 : 52.4862,
        longitude: location.city === 'London' ? -0.1278 : -1.8904
      },
      geoRadius: '50000'
    },
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: `Moving Services in ${location.city}`,
      itemListElement: [
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Man and Van Service',
            description: `Professional man and van hire in ${location.city}`,
            areaServed: location.city
          },
          priceSpecification: {
            '@type': 'PriceSpecification',
            priceCurrency: 'GBP',
            price: '25.00',
            unitText: 'per hour'
          }
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'House Removal Service',
            description: `Complete house removals in ${location.city}`,
            areaServed: location.city
          },
          priceSpecification: {
            '@type': 'PriceSpecification',
            priceCurrency: 'GBP',
            price: '150.00',
            unitText: 'starting from'
          }
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Furniture Delivery',
            description: `Furniture delivery and assembly in ${location.city}`,
            areaServed: location.city
          },
          priceSpecification: {
            '@type': 'PriceSpecification',
            priceCurrency: 'GBP',
            price: '35.00',
            unitText: 'per hour'
          }
        }
      ]
    },
    // Trustpilot aggregateRating
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      ratingCount: '247',
      bestRating: '5',
      worstRating: '1',
      reviewCount: '247'
    },
    // Sample reviews (would be dynamically populated from Trustpilot API)
    review: [
      {
        '@type': 'Review',
        reviewRating: {
          '@type': 'Rating',
          ratingValue: '5',
          bestRating: '5'
        },
        author: {
          '@type': 'Person',
          name: 'Sarah M.'
        },
        reviewBody: 'Excellent service! The team was professional, punctual, and handled our furniture with great care. Highly recommended.',
        datePublished: '2024-08-15'
      },
      {
        '@type': 'Review',
        reviewRating: {
          '@type': 'Rating',
          ratingValue: '5',
          bestRating: '5'
        },
        author: {
          '@type': 'Person',
          name: 'James T.'
        },
        reviewBody: 'Fast and reliable service. The van was clean and the driver was very helpful. Great value for money.',
        datePublished: '2024-08-10'
      }
    ],
    sameAs: [
      'https://uk.trustpilot.com/review/speedy-van.co.uk',
      'https://www.facebook.com/speedyvanuk',
      'https://www.google.com/maps/place/speedy-van'
    ],
    parentOrganization: {
      '@type': 'Organization',
      '@id': 'https://speedy-van.co.uk/#organization'
    },
    brand: {
      '@type': 'Brand',
      name: 'Speedy Van'
    },
    slogan: `Fast, Reliable Moving Services in ${location.city}`,
    knowsAbout: [
      'House Moving',
      'Office Relocation',
      'Furniture Delivery',
      'Man and Van Services',
      'Local Moving',
      'Long Distance Moving'
    ]
  };

  return (
    <script
      type="application/ld+json"
      className={className}
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(localBusinessSchema, null, 2)
      }}
    />
  );
}

