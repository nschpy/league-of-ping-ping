import { useState, useEffect } from 'react'
import {
  fetchDashboardStats,
  fetchRecentGames,
  fetchChallengeSuggestions,
  fetchLeaderboard,
} from '@/lib/dashboard-api'
import type {
  DashboardStats,
  RecentGamesResponse,
  ChallengeSuggestionsResponse,
  LeaderboardResponse,
} from '@/lib/types/dashboard'

export interface DashboardData {
  stats: DashboardStats | null
  recentGames: RecentGamesResponse | null
  suggestions: ChallengeSuggestionsResponse | null
  leaderboard: LeaderboardResponse | null
}

export function useDashboardData(): {
  data: DashboardData
  loading: boolean
  error: string | null
} {
  const [data, setData] = useState<DashboardData>({
    stats: null,
    recentGames: null,
    suggestions: null,
    leaderboard: null,
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    Promise.all([
      fetchDashboardStats(),
      fetchRecentGames({ limit: 5 }),
      fetchChallengeSuggestions(),
      fetchLeaderboard(),
    ])
      .then(([stats, recentGames, suggestions, leaderboard]) => {
        if (cancelled) return
        setData({ stats, recentGames, suggestions, leaderboard })
      })
      .catch((err: unknown) => {
        if (cancelled) return
        const message = err instanceof Error ? err.message : 'Unknown error'
        setError(message)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [])

  return { data, loading, error }
}
