import { useDashboardData } from './use-dashboard-data'
import { DashboardSkeleton } from './components/DashboardSkeleton'
import { MmrHeroCard } from './components/MmrHeroCard'
import { ChallengeListCard } from './components/ChallengeListCard'
import { RecentMatchesCard } from './components/RecentMatchesCard'
import { LeaderboardCard } from './components/LeaderboardCard'

export function DashboardPage() {
  const { data, loading, error } = useDashboardData()

  if (loading) return <DashboardSkeleton />

  if (error) {
    return (
      <div className="p-6 md:p-8 flex items-center justify-center min-h-[40vh]">
        <p className="text-destructive text-[14px] font-mono">{error}</p>
      </div>
    )
  }

  return (
    <div className="p-6 md:p-8 flex flex-col gap-5">
      <MmrHeroCard stats={data.stats} />
      <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1.4fr_1fr] gap-5">
        <ChallengeListCard suggestions={data.suggestions?.items ?? []} />
        <RecentMatchesCard matches={data.recentGames?.items ?? []} />
        <LeaderboardCard leaderboard={data.leaderboard} />
      </div>
    </div>
  )
}
