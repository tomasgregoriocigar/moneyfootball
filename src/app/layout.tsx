import './globals.css';

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
      <body className="bg-black text-zinc-200 antialiased">{children}</body>
    </html>
  );
}
