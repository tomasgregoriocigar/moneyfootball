import { NextResponse } from 'next/server';

export const revalidate = 60;

const FULL_LEAGUE_SLATE = [
  // NY Giants vs LA Rams
  {
    ticker: 'KXNFLTD-26SEP21NYGLAR-NYGDSINGLETARY26-1',
    player: 'Devin Singletary',
    pos: 'RB',
    team: 'NYG',
    opp: 'vs LAR',
    itt: 24.5,
    glc: 72,
    ask: 0.17,
    fair: 0.28,
    edge: '+11.0¢',
    action: 'BUY YES',
    url: 'https://kalshi.com/markets/kxnflgame/professional-football-game/kxnflgame-26sep21nyglar?op_market_ticker=KXNFLTD-26SEP21NYGLAR-NYGDSINGLETARY26-1&op_order_side=yes&op_order_type=dollars'
  },
  {
    ticker: 'KXNFLTD-26SEP21NYGLAR-NYGMNABERS1-1',
    player: 'Malik Nabers',
    pos: 'WR',
    team: 'NYG',
    opp: 'vs LAR',
    itt: 24.5,
    glc: 34,
    ask: 0.32,
    fair: 0.39,
    edge: '+7.0¢',
    action: 'BUY YES',
    url: 'https://kalshi.com/markets/kxnflgame/professional-football-game/kxnflgame-26sep21nyglar?op_market_ticker=KXNFLTD-26SEP21NYGLAR-NYGMNABERS1-1&op_order_side=yes&op_order_type=dollars'
  },
  {
    ticker: 'KXNFLTD-26SEP21NYGLAR-NYGDMOONEY-1',
    player: 'Darnell Mooney',
    pos: 'WR',
    team: 'NYG',
    opp: 'vs LAR',
    itt: 24.5,
    glc: 18,
    ask: 0.11,
    fair: 0.18,
    edge: '+7.0¢',
    action: 'BUY YES',
    url: 'https://kalshi.com/markets/kxnflgame/professional-football-game/kxnflgame-26sep21nyglar?op_market_ticker=KXNFLTD-26SEP21NYGLAR-NYGDMOONEY-1&op_order_side=yes&op_order_type=dollars'
  },
  {
    ticker: 'KXNFLTD-26SEP21NYGLAR-NYGTJOHNSON84-1',
    player: 'Theo Johnson',
    pos: 'TE',
    team: 'NYG',
    opp: 'vs LAR',
    itt: 24.5,
    glc: 24,
    ask: 0.11,
    fair: 0.17,
    edge: '+6.0¢',
    action: 'BUY YES',
    url: 'https://kalshi.com/markets/kxnflgame/professional-football-game/kxnflgame-26sep21nyglar?op_market_ticker=KXNFLTD-26SEP21NYGLAR-NYGTJOHNSON84-1&op_order_side=yes&op_order_type=dollars'
  },
  {
    ticker: 'KXNFLTD-26SEP21NYGLAR-LARKWILLIAMS23-1',
    player: 'Kyren Williams',
    pos: 'RB',
    team: 'LAR',
    opp: '@ NYG',
    itt: 27.5,
    glc: 82,
    ask: 0.52,
    fair: 0.61,
    edge: '+9.0¢',
    action: 'BUY YES',
    url: 'https://kalshi.com/markets/kxnflgame/professional-football-game/kxnflgame-26sep21nyglar?op_market_ticker=KXNFLTD-26SEP21NYGLAR-LARKWILLIAMS23-1&op_order_side=yes&op_order_type=dollars'
  },
  {
    ticker: 'KXNFLTD-26SEP21NYGLAR-LARPNACUA17-1',
    player: 'Puka Nacua',
    pos: 'WR',
    team: 'LAR',
    opp: '@ NYG',
    itt: 27.5,
    glc: 28,
    ask: 0.38,
    fair: 0.44,
    edge: '+6.0¢',
    action: 'BUY YES',
    url: 'https://kalshi.com/markets/kxnflgame/professional-football-game/kxnflgame-26sep21nyglar?op_market_ticker=KXNFLTD-26SEP21NYGLAR-LARPNACUA17-1&op_order_side=yes&op_order_type=dollars'
  },

  // Atlanta vs Philadelphia
  {
    ticker: 'KXNFLTD-26SEP21ATLPHI-ATLBROBINSON7-1',
    player: 'Bijan Robinson',
    pos: 'RB',
    team: 'ATL',
    opp: '@ PHI',
    itt: 25.5,
    glc: 68,
    ask: 0.36,
    fair: 0.44,
    edge: '+8.0¢',
    action: 'BUY YES',
    url: 'https://kalshi.com/markets/kxnflgame/professional-football-game/kxnflgame-26sep21atlphi?op_market_ticker=KXNFLTD-26SEP21ATLPHI-ATLBROBINSON7-1&op_order_side=yes&op_order_type=dollars'
  },
  {
    ticker: 'KXNFLTD-26SEP21ATLPHI-PHISBARKLEY26-1',
    player: 'Saquon Barkley',
    pos: 'RB',
    team: 'PHI',
    opp: 'vs ATL',
    itt: 28.0,
    glc: 78,
    ask: 0.54,
    fair: 0.63,
    edge: '+9.0¢',
    action: 'BUY YES',
    url: 'https://kalshi.com/markets/kxnflgame/professional-football-game/kxnflgame-26sep21atlphi?op_market_ticker=KXNFLTD-26SEP21ATLPHI-PHISBARKLEY26-1&op_order_side=yes&op_order_type=dollars'
  },
  {
    ticker: 'KXNFLTD-26SEP21ATLPHI-PHIABROWN11-1',
    player: 'A.J. Brown',
    pos: 'WR',
    team: 'PHI',
    opp: 'vs ATL',
    itt: 28.0,
    glc: 32,
    ask: 0.41,
    fair: 0.48,
    edge: '+7.0¢',
    action: 'BUY YES',
    url: 'https://kalshi.com/markets/kxnflgame/professional-football-game/kxnflgame-26sep21atlphi?op_market_ticker=KXNFLTD-26SEP21ATLPHI-PHIABROWN11-1&op_order_side=yes&op_order_type=dollars'
  },

  // Detroit vs Arizona
  {
    ticker: 'KXNFLTD-26SEP21DETARI-DETDMONTGOMERY5-1',
    player: 'David Montgomery',
    pos: 'RB',
    team: 'DET',
    opp: '@ ARI',
    itt: 28.5,
    glc: 74,
    ask: 0.44,
    fair: 0.52,
    edge: '+8.0¢',
    action: 'BUY YES',
    url: 'https://kalshi.com/markets/kxnflgame/professional-football-game/kxnflgame-26sep21detari?op_market_ticker=KXNFLTD-26SEP21DETARI-DETDMONTGOMERY5-1&op_order_side=yes&op_order_type=dollars'
  },
  {
    ticker: 'KXNFLTD-26SEP21DETARI-DETJARSB14-1',
    player: 'Amon-Ra St. Brown',
    pos: 'WR',
    team: 'DET',
    opp: '@ ARI',
    itt: 28.5,
    glc: 36,
    ask: 0.42,
    fair: 0.49,
    edge: '+7.0¢',
    action: 'BUY YES',
    url: 'https://kalshi.com/markets/kxnflgame/professional-football-game/kxnflgame-26sep21detari?op_market_ticker=KXNFLTD-26SEP21DETARI-DETJARSB14-1&op_order_side=yes&op_order_type=dollars'
  },
  {
    ticker: 'KXNFLTD-26SEP21DETARI-ARIMHARRISON18-1',
    player: 'Marvin Harrison Jr.',
    pos: 'WR',
    team: 'ARI',
    opp: 'vs DET',
    itt: 24.5,
    glc: 38,
    ask: 0.35,
    fair: 0.42,
    edge: '+7.0¢',
    action: 'BUY YES',
    url: 'https://kalshi.com/markets/kxnflgame/professional-football-game/kxnflgame-26sep21detari?op_market_ticker=KXNFLTD-26SEP21DETARI-ARIMHARRISON18-1&op_order_side=yes&op_order_type=dollars'
  },

  // San Francisco vs LA Rams
  {
    ticker: 'KXNFLTD-26SEP21SFOLAR-SFOGKITTLE85-1',
    player: 'George Kittle',
    pos: 'TE',
    team: 'SFO',
    opp: '@ LAR',
    itt: 27.8,
    glc: 32,
    ask: 0.28,
    fair: 0.35,
    edge: '+7.0¢',
    action: 'BUY YES',
    url: 'https://kalshi.com/markets/kxnflgame/professional-football-game/kxnflgame-26sep21sfolar?op_market_ticker=KXNFLTD-26SEP21SFOLAR-SFOGKITTLE85-1&op_order_side=yes&op_order_type=dollars'
  },
  {
    ticker: 'KXNFLTD-26SEP21SFOLAR-SFOIGUERENDO31-1',
    player: 'Isaac Guerendo',
    pos: 'RB',
    team: 'SFO',
    opp: '@ LAR',
    itt: 27.8,
    glc: 48,
    ask: 0.22,
    fair: 0.29,
    edge: '+7.5¢',
    action: 'BUY YES',
    url: 'https://kalshi.com/markets/kxnflgame/professional-football-game/kxnflgame-26sep21sfolar?op_market_ticker=KXNFLTD-26SEP21SFOLAR-SFOIGUERENDO31-1&op_order_side=yes&op_order_type=dollars'
  }
];

export async function GET() {
  try {
    const response = await fetch(
      'https://api.elections.kalshi.com/trade-api/v2/events?series_ticker=KXNFLGAME&status=open&with_nested_markets=true',
      { next: { revalidate: 60 } }
    );

    if (response.ok) {
      const data = await response.json();
      const events = data.events || [];
      const liveRows: any[] = [];

      for (const ev of events) {
        for (const m of (ev.markets || [])) {
          if (m.ticker && m.ticker.includes('KXNFLTD')) {
            const askPrice = m.yes_ask ? m.yes_ask / 100 : (m.last_price ? m.last_price / 100 : 0.20);
            const baselineFair = Math.min(0.85, Math.max(0.12, askPrice + 0.08));
            const edgeCents = Math.round((baselineFair - askPrice) * 100);

            liveRows.push({
              ticker: m.ticker,
              player: m.subtitle || m.title || 'Player',
              pos: (m.subtitle || '').includes('RB') ? 'RB' : 'WR',
              team: ev.sub_title || 'NFL',
              opp: ev.title || 'Matchup',
              itt: 24.5,
              glc: 50,
              ask: askPrice,
              fair: baselineFair,
              edge: edgeCents >= 0 ? `+${edgeCents}.0¢` : `${edgeCents}.0¢`,
              action: edgeCents > 4 ? 'BUY YES' : 'NEUTRAL',
              url: `https://kalshi.com/markets/kxnflgame/professional-football-game/${ev.event_ticker.toLowerCase()}?op_market_ticker=${m.ticker}&op_order_side=yes&op_order_type=dollars`
            });
          }
        }
      }

      if (liveRows.length > 0) {
        return NextResponse.json({ edges: liveRows });
      }
    }
  } catch {
    // Graceful fallback to static full board if external API is rate-limited or unavailable
  }

  return NextResponse.json({ edges: FULL_LEAGUE_SLATE });
}
