import './globals.css';
import { Analytics } from '@vercel/analytics/react';

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
      <head>
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
