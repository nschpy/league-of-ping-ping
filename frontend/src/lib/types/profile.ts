export type TierName = 'BRONZE' | 'SILVER' | 'GOLD' | 'PLATINUM' | 'DIAMOND' | 'CHAMPION'

export interface ProfileTier {
  name: TierName
  nextName: string | null
  progress: number
  pointsToNext: number | null
}

export interface ProfileStats {
  totalGames: number
  wins: number
  losses: number
  winRate: { percent: number; wins: number; total: number } | null
  currentStreak: { kind: 'W' | 'L'; count: number } | null
  bestWinStreak: number | null
  avgSetsPerWin: number | null
  lastDelta: number | null
}

export interface ProfileUser {
  id: string
  nickname: string
  email?: string
  city: string | null
  mmr: number
  tier: ProfileTier
  rank: number
  createdAt: string
  isMe: boolean
}

export interface Achievement {
  key: string
  label: string
  sub: string
}

export interface MmrHistoryPoint {
  label: string
  mmr: number
}

export interface MmrHistory {
  bucket: 'month' | 'match'
  points: MmrHistoryPoint[]
}

export interface ProfileResult {
  user: ProfileUser
  stats: ProfileStats
  achievements: Achievement[]
  mmrHistory: MmrHistory
}

export interface PatchMeRequest {
  nickname?: string
  city?: string | null
}

export interface PatchMeResponse {
  id: string
  nickname: string
  email: string
  city: string | null
  mmr: number
  role: string
}
