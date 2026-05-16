import { api } from '@/lib/api'
import type {
  DashboardStats,
  RecentGamesResponse,
  ChallengeSuggestionsResponse,
  LeaderboardResponse,
} from '@/lib/types/dashboard'

export function fetchDashboardStats(): Promise<DashboardStats> {
  return api.get<DashboardStats>('/users/me/stats')
}

export function fetchRecentGames(opts: { limit?: number; outcome?: 'win' | 'loss' } = {}): Promise<RecentGamesResponse> {
  const { limit = 5, outcome } = opts
  const params = new URLSearchParams()
  params.set('limit', String(limit))
  if (outcome) params.set('outcome', outcome)
  return api.get<RecentGamesResponse>(`/users/me/games/recent?${params}`)
}

export function fetchChallengeSuggestions(limit = 3): Promise<ChallengeSuggestionsResponse> {
  return api.get<ChallengeSuggestionsResponse>(`/users/me/challenges/suggestions?limit=${limit}`)
}

export function fetchLeaderboard(limit = 5): Promise<LeaderboardResponse> {
  return api.get<LeaderboardResponse>(`/leaderboard?limit=${limit}`)
}
