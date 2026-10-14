import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

function loadJson(rel: string): any {
  return JSON.parse(readFileSync(join(root, rel), 'utf8'));
}

describe('remfl_waiver_board.json', () => {
  const board = loadJson('public/data/remfl_waiver_board.json');

  it('is a non-empty array', () => {
    expect(Array.isArray(board)).toBe(true);
    expect(board.length).toBeGreaterThan(0);
  });

  it('each entry carries the required fields', () => {
    for (const p of board) {
      expect(typeof p.player).toBe('string');
      expect(typeof p.pos).toBe('string');
      expect(typeof p.team).toBe('string');
      expect(typeof p.opponent).toBe('string');
      expect(typeof p.vegas_itt).toBe('number');
      expect(['AVAILABLE_FA', 'ROSTERED', 'OUT']).toContain(p.remfl_status);
      expect(typeof p.total_td_val).toBe('number');
      expect(typeof p.tier).toBe('string');
      expect(typeof p.rank).toBe('number');
    }
  });

  it('ranks are unique and sequential from 1', () => {
    const ranks = board.map((p: any) => p.rank).sort((a: number, b: number) => a - b);
    expect(new Set(ranks).size).toBe(board.length);
    ranks.forEach((r: number, i: number) => expect(r).toBe(i + 1));
  });
});
