import './globals.css';
import { Analytics } from '@vercel/analytics/react';
import Script from 'next/script';

export const metadata = {
  title: 'Moneyfootball.ai | NFL Event Derivatives & TPI Terminal',
  description: 'Quantitative NFL prediction market edge analytics for Kalshi and Polymarket.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-black text-zinc-200 antialiased">
        {children}
        <Analytics />
        <Script src="https://www.googletagmanager.com/gtag/js?id=G-C9DCVRPNQB" strategy="afterInteractive" />
        <Script id="ga4-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-C9DCVRPNQB');
          `}
        </Script>
      </body>
    </html>
  );
}
