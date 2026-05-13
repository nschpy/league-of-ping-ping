import type { AuthUser } from '@/stores/auth'

export interface AuthResponse {
  token: string
  user: AuthUser
}

export type GameFormat = 'bo1' | 'bo3' | 'bo5'
export type GameStatus = 'in_progress' | 'completed' | 'cancelled'

export interface PlayerSummary {
  id: string
  nickname: string
  mmr: number
}

export interface GameSet {
  player1Score: number
  player2Score: number
  points: Array<{ scorer: 'p1' | 'p2'; at: string }>
  completedAt?: string
}

export interface Game {
  id: string
  status: GameStatus
  format: GameFormat
  player1: PlayerSummary
  player2: PlayerSummary
  referee: PlayerSummary
  sets: GameSet[]
  winnerId: string | null
  player1MmrBefore: number
  player2MmrBefore: number
  player1MmrChange: number | null
  player2MmrChange: number | null
  startedAt: string
  completedAt: string | null
  cancelledAt: string | null
}
