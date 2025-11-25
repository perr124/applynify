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

        {/* TikTok Pixel Code */}
        <Script id='tiktok-pixel' strategy='afterInteractive'>
          {`
            !function (w, d, t) {
              w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie","holdConsent","revokeConsent","grantConsent"],ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(
              var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e},ttq.load=function(e,n){var r="https://analytics.tiktok.com/i18n/pixel/events.js",o=n&&n.partner;ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=r,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};n=document.createElement("script")
              ;n.type="text/javascript",n.async=!0,n.src=r+"?sdkid="+e+"&lib="+t;e=document.getElementsByTagName("script")[0];e.parentNode.insertBefore(n,e)};
              
              ttq.load('D4IRIABC77UAP3H8RKE0');
              ttq.page();
            }(window, document, 'ttq');
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
