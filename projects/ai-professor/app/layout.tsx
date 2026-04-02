import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';
import { OrganizationJsonLd, WebSiteJsonLd } from '@/components/seo';
import BackToTop from '@/components/ui/BackToTop';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const viewport: Viewport = {
  themeColor: '#0d9488',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
};

export const metadata: Metadata = {
  title: {
    default: 'Pulse + AI Professor | Stay Current. Get Smarter.',
    template: '%s | Pulse + AI Professor',
  },
  description:
    'Real-time AI news aggregation meets AI-powered learning. Stay current with the latest AI developments and get smarter with expert-led courses.',
  keywords: [
    'AI news',
    'AI courses',
    'machine learning',
    'deep learning',
    'data science',
    'online learning',
    'artificial intelligence',
    'ML courses',
    'AI education',
    'Pulse News',
    'AI Professor',
  ],
  authors: [{ name: 'Pulse + AI Professor' }],
  creator: 'Pulse + AI Professor',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'AI Professor',
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://ai-professor-app.vercel.app',
    siteName: 'Pulse + AI Professor',
    title: 'Pulse + AI Professor | Stay Current. Get Smarter.',
    description:
      'Real-time AI news aggregation meets AI-powered learning. Stay current with the latest AI developments and get smarter with expert-led courses.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Pulse + AI Professor',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Pulse + AI Professor | Stay Current. Get Smarter.',
    description:
      'Real-time AI news aggregation meets AI-powered learning. Stay current with the latest AI developments and get smarter with expert-led courses.',
    images: ['/og-image.png'],
    creator: '@pulseaiprof',
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
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* PWA Icons */}
        <link rel="icon" href="/icons/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/icons/icon.svg" />
        
        {/* PWA Meta Tags */}
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="AI Professor" />
        <meta name="application-name" content="AI Professor" />
        <meta name="msapplication-TileColor" content="#0d9488" />
        <meta name="msapplication-tap-highlight" content="no" />
      </head>
      <body className={`${inter.variable} font-sans antialiased`}>
        {/* SEO & AEO Structured Data */}
        <OrganizationJsonLd />
        <WebSiteJsonLd />
        
        <Providers>{children}</Providers>
        
        {/* Back to Top Button */}
        <BackToTop />
        
        {/* Service Worker Registration */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js').then(
                    function(registration) {
                      console.log('SW registered: ', registration);
                    },
                    function(registrationError) {
                      console.log('SW registration failed: ', registrationError);
                    }
                  );
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}
