import React from "react";
import ChakraProviders from "@/components/ChakraProviders";
import "@/styles/globals.css";
import "@/styles/mobile-enhancements.css";
import "@/styles/mobile-fixes.css";
import "@/styles/booking-fixes.css";
import "@/styles/ios-safari-fixes.css";
import "@/styles/video-background.css";
import "@/styles/charts.css";
import "@/styles/mobile-chat-improvements.css";
// import "mapbox-gl/dist/mapbox-gl.css"; // Removed to fix CSS error
import { ConsentProvider } from "@/components/Consent/ConsentProvider";
import CookieBanner from "@/components/Consent/CookieBanner";
import CookiePreferencesModal from "@/components/Consent/CookiePreferencesModal";
import { parseConsentCookie } from "@/lib/consent";
import { cookies, headers } from "next/headers";
import AnalyticsScripts from "@/components/Consent/AnalyticsScripts";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import Providers from "@/components/Providers";
import { MotionProvider } from "@/components/MotionProvider";
import GuestChatWrapper from "@/components/Chat/GuestChatWrapper";
import SchemaProvider from "@/components/Schema/SchemaProvider";

export const metadata = {
  title: "Speedy Van — Premium Moving & Delivery Services",
  description: "Fast, reliable moving and delivery services. Get instant quotes, book online, and experience premium service with our professional team. Available 24/7 across the city.",
  keywords: "moving services, delivery, logistics, premium moving, instant quotes, online booking, professional movers",
  authors: [{ name: "Speedy Van" }],
  creator: "Speedy Van",
  publisher: "Speedy Van",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    siteName: 'Speedy Van',
    title: 'Speedy Van — Premium Moving & Delivery Services',
    description: 'Fast, reliable moving and delivery services. Get instant quotes, book online, and experience premium service.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Speedy Van - Premium Moving Services',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Speedy Van — Premium Moving & Delivery Services',
    description: 'Fast, reliable moving and delivery services. Get instant quotes, book online, and experience premium service.',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#2563EB',
  colorScheme: 'light dark',
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const initialConsent = parseConsentCookie(cookies().get("sv_consent")?.value);
  const session = await getServerSession(authOptions);
  
  return (
    <html lang="en" dir="ltr">
      <head>
        {/* Favicon and App Icons */}
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="apple-touch-icon" sizes="152x152" href="/apple-touch-icon-152x152.png" />
        <link rel="apple-touch-icon" sizes="144x144" href="/apple-touch-icon-144x144.png" />
        <link rel="apple-touch-icon" sizes="120x120" href="/apple-touch-icon-120x120.png" />
        <link rel="apple-touch-icon" sizes="114x114" href="/apple-touch-icon-114x114.png" />
        <link rel="apple-touch-icon" sizes="76x76" href="/apple-touch-icon-76x76.png" />
        <link rel="apple-touch-icon" sizes="72x72" href="/apple-touch-icon-72x72.png" />
        <link rel="apple-touch-icon" sizes="60x60" href="/apple-touch-icon-60x60.png" />
        <link rel="apple-touch-icon" sizes="57x57" href="/apple-touch-icon-57x57.png" />

        {/* Web App Manifest */}
        <link rel="manifest" href="/site.webmanifest" />

        {/* Windows Tiles */}
        <meta name="msapplication-TileColor" content="#2563EB" />
        <meta name="msapplication-config" content="/browserconfig.xml" />

        {/* Theme Colors */}
        <meta name="theme-color" content="#2563EB" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-title" content="Speedy Van" />

        {/* Safari Pinned Tab */}
        <link rel="mask-icon" href="/favicon.svg" color="#2563EB" />

        {/* Mobile and PWA Meta */}
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        
        {/* Optimized Font Loading */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link 
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" 
          rel="stylesheet" 
        />
        
        {/* Preload critical resources */}
        <link rel="preload" href="/favicon.svg" as="image" type="image/svg+xml" />
      </head>
      <body>
        <SchemaProvider>
          <ChakraProviders>
            <Providers session={session}>
              <MotionProvider>
                <ConsentProvider initialConsent={initialConsent}>
                  {children}
                  <GuestChatWrapper />
                  <CookieBanner />
                  <CookiePreferencesModal />
                  <AnalyticsScripts />
                  <script
                    dangerouslySetInnerHTML={{
                      __html: `
                        (function() {
                          const bar = document.getElementById('cookie-bar');
                          if (!bar) return;
                          
                          const onResize = () => {
                            const vv = window.visualViewport;
                            if (vv && vv.height < 520) {
                              bar.style.display = 'none';
                            } else {
                              bar.style.display = '';
                            }
                          };
                          
                          if (window.visualViewport) {
                            window.visualViewport.addEventListener('resize', onResize);
                          }
                        })();
                      `
                    }}
                  />
                </ConsentProvider>
              </MotionProvider>
            </Providers>
          </ChakraProviders>
        </SchemaProvider>
      </body>
    </html>
  );
}


