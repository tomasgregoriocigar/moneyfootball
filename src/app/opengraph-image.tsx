import { ImageResponse } from 'next/og';
import { LOGO_FACE_OG_DATA_URI } from '../data/og-face';

export const alt = 'MoneyFootball.ai — Tito the Football Quant';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          backgroundColor: '#070b12',
          padding: '64px',
          fontFamily: 'monospace',
        }}
      >
        {/* Tito's face mark: a crop of the locked avatar identity, never regenerated. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={LOGO_FACE_OG_DATA_URI}
          width={340}
          height={340}
          alt=""
          style={{ borderRadius: '50%', marginRight: '48px' }}
        />
        <div style={{ display: 'flex', flexDirection: 'column', width: '660px' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              color: '#34d399',
              fontSize: 26,
              letterSpacing: '4px',
              marginBottom: '18px',
            }}
          >
            <div
              style={{
                width: 14,
                height: 14,
                borderRadius: '50%',
                backgroundColor: '#34d399',
                marginRight: '14px',
              }}
            />
            TITO THE FOOTBALL QUANT
          </div>
          <div style={{ color: '#ffffff', fontSize: 56, fontWeight: 900, lineHeight: 1.05 }}>
            MONEYFOOTBALL.AI
          </div>
          <div style={{ color: '#94a3b8', fontSize: 27, marginTop: '20px', lineHeight: 1.35 }}>
            Anytime touchdown picks, priced by the TPI model — and every settlement posted, wins
            and losses.
          </div>
          <div style={{ color: '#e2e8f0', fontSize: 25, marginTop: '26px' }}>
            All-time 356-206 · 2026 run 43-43
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
