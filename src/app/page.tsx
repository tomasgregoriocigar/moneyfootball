import React from 'react';

export default function Home() {
  return (
    <div style={{
      backgroundColor: '#0b0e14',
      color: '#e6edf3',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, monospace',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '24px',
      boxSizing: 'border-box'
    }}>
      <div style={{
        maxWidth: '680px',
        width: '100%',
        backgroundColor: '#161b22',
        border: '1px solid #30363d',
        borderRadius: '12px',
        padding: '36px',
        boxShadow: '0 20px 40px rgba(0,0,0,0.6)'
      }}>
        {/* Terminal Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', borderBottom: '1px solid #21262d', paddingBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ height: '12px', width: '12px', borderRadius: '50%', backgroundColor: '#fa7970' }}></span>
            <span style={{ height: '12px', width: '12px', borderRadius: '50%', backgroundColor: '#faa356' }}></span>
            <span style={{ height: '12px', width: '12px', borderRadius: '50%', backgroundColor: '#3fb950' }}></span>
          </div>
          <span style={{ fontSize: '12px', color: '#8b949e', letterSpacing: '1px', textTransform: 'uppercase' }}>
            TERMINAL STATUS: ENGINE RE-CALIBRATION
          </span>
        </div>

        {/* Title */}
        <h1 style={{ fontSize: '26px', fontWeight: 800, margin: '0 0 12px 0', color: '#ffffff' }}>
          MONEYFOOTBALL<span style={{ color: '#388bfd' }}>.AI</span>
        </h1>
        <p style={{ color: '#8b949e', fontSize: '15px', lineHeight: '1.6', margin: '0 0 24px 0' }}>
          The Touchdown Projection Index (TPI) terminal is undergoing scheduled data pipeline upgrades to integrate Week 3 Goal-to-Go (GTG) carry equity, kicker red-zone stall models, and split-surface QB distributions.
        </p>

        {/* System Pipeline Status Box */}
        <div style={{ backgroundColor: '#0d1117', border: '1px solid #21262d', borderRadius: '8px', padding: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', fontSize: '13px' }}>
            <span style={{ color: '#8b949e' }}>Touchdown Projection Index (TPI):</span>
            <span style={{ color: '#faa356', fontWeight: 600 }}>Optimizing W3 Parameters</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', fontSize: '13px' }}>
            <span style={{ color: '#8b949e' }}>Kalshi KXNFLTD Discrepancy Scraper:</span>
            <span style={{ color: '#3fb950', fontWeight: 600 }}>Active / Syncing</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', fontSize: '13px' }}>
            <span style={{ color: '#8b949e' }}>Points-Only FFL Engine (REMFL):</span>
            <span style={{ color: '#388bfd', fontWeight: 600 }}>Surface Testing</span>
          </div>
        </div>
      </div>
    </div>
  );
}
