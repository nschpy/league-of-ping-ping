export type GameFormat = 'bo1' | 'bo3' | 'bo5'
export type TierName = 'BRONZE' | 'SILVER' | 'GOLD' | 'PLATINUM' | 'DIAMOND' | 'CHAMPION'

export interface DashboardStats {
  mmr: number
  tier: {
    name: TierName
    nextName: TierName | null
    progress: number
    pointsToNext: number | null
  }
  lastDelta: number | null
  winRate: {
    percent: number
    wins: number
    total: number
  } | null
  currentStreak: {
    kind: 'W' | 'L'
    count: number
  } | null
  bestWinStreak: number | null
  favoriteFormat: {
    format: GameFormat
    percent: number
  } | null
  avgSetPointDiff: number | null
}

export interface RecentMatch {
  id: string
  opponent: {
    id: string
    nickname: string
    mmr: number
  }
  format: GameFormat
  sets: {
    user: number
    opponent: number
  }
  setScores: Array<{ user: number; opponent: number }>
  mmrDelta: number
  outcome: 'win' | 'loss'
  completedAt: string
}

export interface RecentGamesResponse {
  items: RecentMatch[]
}

export interface ChallengeSuggestion {
  id: string
  nickname: string
  mmr: number
  h2h: {
    wins: number
    losses: number
  }
}

export interface ChallengeSuggestionsResponse {
  items: ChallengeSuggestion[]
}

export interface LeaderboardEntry {
  rank: number
  id: string
  nickname: string
  mmr: number
  isMe: boolean
}

export interface LeaderboardResponse {
  top: LeaderboardEntry[]
  me: {
    rank: number
    id: string
    nickname: string
    mmr: number
  } | null
}
