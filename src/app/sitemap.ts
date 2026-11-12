import type { MetadataRoute } from 'next';

const BASE = 'https://www.moneyfootball.ai';

// Archive last-modified dates come from the records: board publish dates and
// settlement dates in the week settlement files / repo commit history.
const ARCHIVE: { path: string; lastModified: string; priority: number }[] = [
  { path: '/weeks', lastModified: '2026-11-12', priority: 0.9 },
  { path: '/weeks/weeks-1-4-results', lastModified: '2026-10-13', priority: 0.5 },
  { path: '/weeks/week-5-board', lastModified: '2026-10-13', priority: 0.6 },
  { path: '/weeks/week-5-results', lastModified: '2026-10-14', priority: 0.6 },
  { path: '/weeks/week-6-board', lastModified: '2026-10-16', priority: 0.6 },
  { path: '/weeks/week-6-results', lastModified: '2026-10-19', priority: 0.6 },
  { path: '/weeks/week-7-board', lastModified: '2026-10-21', priority: 0.6 },
  { path: '/weeks/week-7-results', lastModified: '2026-10-26', priority: 0.6 },
  { path: '/weeks/week-8-board', lastModified: '2026-10-28', priority: 0.7 },
  { path: '/weeks/week-8-results', lastModified: '2026-11-02', priority: 0.7 },
  { path: '/weeks/week-9-board', lastModified: '2026-11-06', priority: 0.8 },
  { path: '/weeks/week-9-results', lastModified: '2026-11-10', priority: 0.8 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://moneyfootball.ai',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    ...ARCHIVE.map((a) => ({
      url: `${BASE}${a.path}`,
      lastModified: new Date(a.lastModified),
      changeFrequency: 'monthly' as const,
      priority: a.priority,
    })),
  ];
}
