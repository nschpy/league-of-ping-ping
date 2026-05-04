export interface TierInfo {
  name: string;
  prev: number;
  next: number;
}

export function tierFor(mmr: number): TierInfo {
  if (mmr >= 1800) return { name: 'Master',   prev: 1800, next: 2000 };
  if (mmr >= 1600) return { name: 'Diamond',  prev: 1600, next: 1800 };
  if (mmr >= 1400) return { name: 'Platinum', prev: 1400, next: 1600 };
  if (mmr >= 1200) return { name: 'Gold',     prev: 1200, next: 1400 };
  if (mmr >= 1000) return { name: 'Silver',   prev: 1000, next: 1200 };
  return { name: 'Bronze', prev: 800, next: 1000 };
}
