export type TierName = 'BRONZE' | 'SILVER' | 'GOLD' | 'PLATINUM' | 'DIAMOND' | 'CHAMPION'

export interface TierInfo {
  name: TierName
  nextName: TierName | null
  progress: number
  pointsToNext: number | null
}

interface TierBand {
  name: TierName
  min: number
  max: number | null
}

const TIERS: TierBand[] = [
  { name: 'BRONZE',   min: 0,    max: 999  },
  { name: 'SILVER',   min: 1000, max: 1199 },
  { name: 'GOLD',     min: 1200, max: 1399 },
  { name: 'PLATINUM', min: 1400, max: 1599 },
  { name: 'DIAMOND',  min: 1600, max: 1999 },
  { name: 'CHAMPION', min: 2000, max: null },
]

export function getTier(mmr: number): TierInfo {
  const clamped = Math.max(0, mmr)

  const index = TIERS.findIndex(
    (t) => clamped >= t.min && (t.max === null || clamped <= t.max),
  )

  const tier = TIERS[index]
  const nextTier = index < TIERS.length - 1 ? TIERS[index + 1] : null

  if (tier.max === null) {
    // CHAMPION — no next tier
    return {
      name: tier.name,
      nextName: null,
      progress: 100,
      pointsToNext: null,
    }
  }

  const rangeSize = tier.max - tier.min + 1
  const progress = Math.min(100, Math.floor(((clamped - tier.min) / rangeSize) * 100))
  const pointsToNext = tier.max - clamped + 1

  return {
    name: tier.name,
    nextName: nextTier ? nextTier.name : null,
    progress,
    pointsToNext,
  }
}
