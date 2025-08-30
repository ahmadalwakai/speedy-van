'use client';

import { ContactPoint, WithContext } from 'schema-dts';

interface ContactPointSchemaProps {
  className?: string;
  contactType?: 'customer service' | 'sales' | 'support' | 'billing';
  telephone?: string;
  email?: string;
  location?: string;
}

export default function ContactPointSchema({ 
  className,
  contactType = 'customer service',
  telephone = '+44-20-XXXX-XXXX',
  email = 'hello@speedy-van.co.uk',
  location = 'United Kingdom'
}: ContactPointSchemaProps) {
  const contactPointSchema: WithContext<ContactPoint> = {
    '@context': 'https://schema.org',
    '@type': 'ContactPoint',
    '@id': `https://speedy-van.co.uk/#contact-${contactType.replace(' ', '-')}`,
    contactType,
    telephone,
    email,
    url: 'https://speedy-van.co.uk/contact',
    availableLanguage: ['English', 'en-GB'],
    areaServed: [
      {
        '@type': 'Country',
        name: 'United Kingdom'
      },
      {
        '@type': 'Place',
        name: location
      }
    ],
    hoursAvailable: [
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
        closes: '22:00',
        validFrom: '2024-01-01',
        validThrough: '2024-12-31'
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Saturday'],
        opens: '07:00',
        closes: '20:00',
        validFrom: '2024-01-01',
        validThrough: '2024-12-31'
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Sunday'],
        opens: '08:00',
        closes: '18:00',
        validFrom: '2024-01-01',
        validThrough: '2024-12-31'
      }
    ],
    serviceType: [
      'Moving Services',
      'Man and Van',
      'House Removals',
      'Furniture Delivery',
      'Customer Support'
    ],
    productSupported: [
      {
        '@type': 'Service',
        name: 'Man and Van Service'
      },
      {
        '@type': 'Service',
        name: 'House Removal Service'
      },
      {
        '@type': 'Service',
        name: 'Furniture Delivery Service'
      },
      {
        '@type': 'Service',
        name: 'Office Relocation Service'
      }
    ]
  };

  return (
    <script
      type="application/ld+json"
      className={className}
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(contactPointSchema, null, 2)
      }}
    />
  );
}

