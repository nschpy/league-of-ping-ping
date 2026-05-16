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
  max: number | null // null = open-ended (CHAMPION)
}

const TIERS: TierBand[] = [
  { name: 'BRONZE',   min: 0,    max: 999  },
  { name: 'SILVER',   min: 1000, max: 1199 },
  { name: 'GOLD',     min: 1200, max: 1399 },
  { name: 'PLATINUM', min: 1400, max: 1599 },
  { name: 'DIAMOND',  min: 1600, max: 1999 },
  { name: 'CHAMPION', min: 2000, max: null },
]

export function getTierForMmr(mmr: number): TierInfo {
  const clampedMmr = Math.max(0, mmr)

  const tierIndex = TIERS.findIndex((t, i) => {
    const next = TIERS[i + 1]
    return next == null || clampedMmr < next.min
  })

  // findIndex always succeeds here because the last tier is open-ended
  const tier = TIERS[tierIndex]!
  const nextTier = TIERS[tierIndex + 1] ?? null

  if (tier.max === null) {
    // CHAMPION — open-ended, progress is 1, no next tier
    return {
      name: tier.name,
      nextName: null,
      progress: 1,
      pointsToNext: null,
    }
  }

  const bandSize = tier.max - tier.min + 1
  const positionInBand = clampedMmr - tier.min
  const progress = positionInBand / bandSize
  const pointsToNext = nextTier != null ? nextTier.min - clampedMmr : null

  return {
    name: tier.name,
    nextName: nextTier?.name ?? null,
    progress: Math.min(1, Math.max(0, progress)),
    pointsToNext,
  }
}
