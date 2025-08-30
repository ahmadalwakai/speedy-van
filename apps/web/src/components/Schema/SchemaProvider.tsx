'use client';

import { usePathname } from 'next/navigation';
import OrganizationSchema from './OrganizationSchema';
import WebSiteSchema from './WebSiteSchema';
import LocalBusinessSchema from './LocalBusinessSchema';
import ContactPointSchema from './ContactPointSchema';

interface SchemaProviderProps {
  children?: React.ReactNode;
}

export default function SchemaProvider({ children }: SchemaProviderProps) {
  const pathname = usePathname();
  
  // Determine if we should show local business schema based on path
  const isLocationPage = pathname?.includes('/uk/') || 
                        pathname?.includes('man-and-van-') ||
                        pathname?.includes('removals-') ||
                        pathname === '/contact';
  
  // Extract location from pathname if available
  const getLocationFromPath = () => {
    if (pathname?.includes('/uk/')) {
      const parts = pathname.split('/uk/');
      if (parts[1]) {
        const city = parts[1].split('/')[0];
        return {
          city: city.charAt(0).toUpperCase() + city.slice(1),
          region: 'England'
        };
      }
    }
    
    // Default location for contact page and general local business
    return {
      city: 'London',
      region: 'England'
    };
  };

  const location = getLocationFromPath();

  return (
    <>
      {/* Core schemas - always present */}
      <OrganizationSchema />
      <WebSiteSchema />
      
      {/* Location-specific schemas */}
      {isLocationPage && (
        <LocalBusinessSchema location={location} />
      )}
      
      {/* Contact point schema for contact and service pages */}
      {(pathname === '/contact' || pathname?.startsWith('/services/')) && (
        <ContactPointSchema location={location.city} />
      )}
      
      {children}
    </>
  );
}

