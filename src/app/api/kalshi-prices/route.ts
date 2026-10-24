import { NextResponse } from 'next/server';

// Live Kalshi yes-ask prices for the TPI board's markets.
// Server-side proxy: Kalshi's public trade API is fetched here (no CORS
// limits server-side) and the board page polls this route every 60s.
// Prices only — the board itself (picks, fair values, verdicts) stays in
// /data/slate_verdict.json, committed by hand.

export const revalidate = 60;

const EVENTS_API =
  'https://api.elections.kalshi.com/trade-api/v2/events?series_ticker=KXNFLTDPROT&status=open&with_nested_markets=true';

export async function GET() {
  try {
    const res = await fetch(EVENTS_API, {
      headers: { 'User-Agent': 'moneyfootball-price-watch/1.0' },
      next: { revalidate: 60 },
    });
    if (!res.ok) {
      return NextResponse.json(
        { error: `kalshi upstream ${res.status}` },
        { status: 502 }
      );
    }
    const data = await res.json();
    const prices: Record<string, number> = {};
    for (const ev of data?.events ?? []) {
      for (const m of ev?.markets ?? []) {
        const ask = parseFloat(m?.yes_ask_dollars ?? '0');
        if (m?.ticker && Number.isFinite(ask) && ask > 0) {
          prices[m.ticker] = ask;
        }
      }
    }
    return NextResponse.json(
      { prices, fetched_at: new Date().toISOString() },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
        },
      }
    );
  } catch (e) {
    return NextResponse.json({ error: 'kalshi fetch failed' }, { status: 502 });
  }
}
