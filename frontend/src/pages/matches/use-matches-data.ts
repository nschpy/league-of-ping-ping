import { useState, useEffect } from 'react'
import { fetchRecentGames } from '@/lib/dashboard-api'
import { fetchLiveMatch } from '@/lib/matches-api'
import type { RecentMatch } from '@/lib/types/dashboard'
import type { LiveMatch } from '@/lib/types/matches'

export function useMatchesData(): {
  matches: RecentMatch[]
  liveMatch: LiveMatch | null
  loading: boolean
  error: string | null
} {
  const [matches, setMatches] = useState<RecentMatch[]>([])
  const [liveMatch, setLiveMatch] = useState<LiveMatch | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    Promise.all([
      fetchRecentGames({ limit: 100 }),
      fetchLiveMatch(),
    ])
      .then(([recentGames, live]) => {
        if (cancelled) return
        setMatches(recentGames.items)
        setLiveMatch(live)
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

  return { matches, liveMatch, loading, error }
}
