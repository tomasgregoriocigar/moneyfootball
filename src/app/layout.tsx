import './globals.css';
import { Analytics } from '@vercel/analytics/react';

import { LOGO_FACE_DATA_URI } from '../data/logo';

export const metadata = {
  title: 'Moneyfootball.ai | NFL Event Derivatives & TPI Terminal',
  description: 'Quantitative NFL prediction market edge analytics for Kalshi and Polymarket.',
  icons: {
    icon: LOGO_FACE_DATA_URI,
    apple: LOGO_FACE_DATA_URI,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta name="google-site-verification" content="CPHKrZiQzeb28ieNqGLSpY6T8oMO2tPxlZMgOLoKt00" />
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-C9DCVRPNQB" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-C9DCVRPNQB');
            `,
          }}
        />
      </head>
      <body className="bg-black text-zinc-200 antialiased">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
