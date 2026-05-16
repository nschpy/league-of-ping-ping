import { useState } from 'react'
import { useMatchesData } from './use-matches-data'
import { MatchesHeader } from './components/MatchesHeader'
import { LiveMatchBanner } from './components/LiveMatchBanner'
import { MatchesTabs } from './components/MatchesTabs'
import { MatchesHistoryList } from './components/MatchesHistoryList'
import { MatchesSkeleton } from './components/MatchesSkeleton'

type TabValue = 'all' | 'win' | 'loss'

export function MatchesPage() {
  const { matches, liveMatch, loading, error } = useMatchesData()
  const [tab, setTab] = useState<TabValue>('all')

  if (loading) return <MatchesSkeleton />

  if (error) {
    return (
      <div className="p-6 md:p-8 flex items-center justify-center min-h-[40vh]">
        <p className="text-destructive text-[14px] font-mono">{error}</p>
      </div>
    )
  }

  const filtered = matches.filter(m => {
    if (tab === 'win') return m.outcome === 'win'
    if (tab === 'loss') return m.outcome === 'loss'
    return true
  })

  return (
    <div className="p-6 md:p-8 flex flex-col gap-5">
      <MatchesHeader matches={matches} />
      {liveMatch && <LiveMatchBanner match={liveMatch} />}
      <MatchesTabs active={tab} onChange={setTab} />
      <MatchesHistoryList matches={filtered} />
    </div>
  )
}
