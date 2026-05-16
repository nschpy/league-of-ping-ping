import type { RecentMatch } from '@/lib/types/dashboard'
import { MatchRow } from './MatchRow'

interface MatchesHistoryListProps {
  matches: RecentMatch[]
}

export function MatchesHistoryList({ matches }: MatchesHistoryListProps) {
  if (matches.length === 0) {
    return (
      <div className="bg-card rounded-lg border border-border overflow-hidden">
        <p className="text-muted-foreground text-[12px] text-center py-6 font-mono">
          Матчей пока нет
        </p>
      </div>
    )
  }

  return (
    <div className="bg-card rounded-lg border border-border overflow-hidden">
      {matches.map((match, i) => (
        <MatchRow
          key={match.id}
          match={match}
          isLast={i === matches.length - 1}
        />
      ))}
    </div>
  )
}
