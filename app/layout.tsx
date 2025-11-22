import { ReactNode } from 'react';
import { Inter } from 'next/font/google';
import { Viewport } from 'next';
import Script from 'next/script';
import { getSEOTags } from '@/libs/seo';
import ClientLayout from '@/components/LayoutClient';
import config from '@/config';
import '@/libs/logger';
import './globals.css';
import { MessageProvider } from './contexts/MessageContext';
import { Analytics } from '@vercel/analytics/react';

const font = Inter({ subsets: ['latin'] });

export const viewport: Viewport = {
  // Will use the primary color of your theme to show a nice theme color in the URL bar of supported browsers
  themeColor: config.colors.main,
  width: 'device-width',
  initialScale: 1,
};

// This adds default SEO tags to all pages in our app.
// You can override them in each page passing params to getSOTags() function.
export const metadata = getSEOTags();

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang='en' data-theme={config.colors.theme} className={font.className}>
      <body>
        {/* Google tag (gtag.js) */}
        <Script
          src='https://www.googletagmanager.com/gtag/js?id=AW-17752172279'
          strategy='afterInteractive'
        />
        <Script id='google-analytics' strategy='afterInteractive'>
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'AW-17752172279');
          `}
        </Script>
        <MessageProvider>
          <ClientLayout>{children}</ClientLayout>
          <Analytics />
        </MessageProvider>
      </body>
    </html>
  );
}
