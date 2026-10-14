import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

function loadJson(rel: string): any {
  return JSON.parse(readFileSync(join(root, rel), 'utf8'));
}

describe('slate_verdict.json (Schema A — frontend data contract)', () => {
  const data = loadJson('public/data/slate_verdict.json');

  it('has a non-empty targets array', () => {
    expect(Array.isArray(data.targets)).toBe(true);
    expect(data.targets.length).toBeGreaterThan(0);
  });

  it('each target carries the required pricing fields', () => {
    for (const t of data.targets) {
      expect(typeof t.player).toBe('string');
      expect(typeof t.team).toBe('string');
      expect(typeof t.opponent).toBe('string');
      expect(typeof t.itt).toBe('number');
      expect(typeof t.kalshi_price).toBe('number');
      expect(typeof t.polymarket_price).toBe('number');
      expect(typeof t.model_fair_value).toBe('number');
      expect(typeof t.net_edge).toBe('number');
      expect(['ACTIVE', 'PASS']).toContain(t.status);
      expect(t.kalshi_url).toMatch(/^https:\/\//);
    }
  });

  it('net_edge equals fair value minus Kalshi ask (within rounding)', () => {
    for (const t of data.targets) {
      expect(t.net_edge).toBeCloseTo(t.model_fair_value - t.kalshi_price, 2);
    }
  });

  it('performance block carries headline records', () => {
    expect(data.performance.season_record).toMatch(/^\d+-\d+$/);
    expect(data.performance.all_time_record).toMatch(/^\d+-\d+$/);
  });

  it('badge and KPI fields the page reads are present', () => {
    expect(typeof data.sniper_hit).toBe('string');
    expect(data.performance.net_settlement_roi).toBeDefined();
    expect(data.performance.closing_line_alpha).toBeDefined();
    expect(data.performance.brier_score).toBeDefined();
  });
});
