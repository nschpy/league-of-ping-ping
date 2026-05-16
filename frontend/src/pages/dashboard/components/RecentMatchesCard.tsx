import { Link } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { relativeTime } from '@/lib/relative-time'
import type { RecentMatch } from '@/lib/types/dashboard'

interface RecentMatchesCardProps {
  matches: RecentMatch[]
}

export function RecentMatchesCard({ matches }: RecentMatchesCardProps) {
  const displayed = matches.slice(0, 5)

  return (
    <div className="bg-card rounded-lg border border-border p-4 flex flex-col gap-3">
      <div className="flex items-center justify-between px-1">
        <span
          className="text-foreground text-[13px] uppercase tracking-widest"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          Последние матчи
        </span>
        <Link
          to="/matches"
          className="text-primary text-[11px] font-mono tracking-wider hover:opacity-80 transition-opacity"
        >
          ВСЕ →
        </Link>
      </div>

      {displayed.length === 0 ? (
        <p className="text-muted-foreground text-[12px] text-center py-4">Матчей нет</p>
      ) : (
        <div className="flex flex-col gap-1">
          {displayed.map((match) => (
            <div
              key={match.id}
              className="flex items-center gap-3 px-1 py-1.5"
            >
              {/* Win/loss color bar */}
              <div
                className={cn(
                  'w-[3px] h-9 rounded-full shrink-0',
                  match.outcome === 'win' ? 'bg-success' : 'bg-destructive',
                )}
              />

              {/* Opponent + meta */}
              <div className="flex flex-col flex-1 min-w-0">
                <span className="text-foreground text-[14px] font-semibold truncate leading-tight">
                  vs {match.opponent.nickname}
                </span>
                <span className="text-muted-foreground text-[11px] font-mono mt-0.5">
                  {match.format} · {relativeTime(match.completedAt)}
                </span>
              </div>

              {/* Score */}
              <span className="text-foreground text-[13px] font-mono shrink-0">
                {match.sets.user}–{match.sets.opponent}
              </span>

              {/* MMR delta */}
              <span
                className={cn(
                  'text-[12px] font-mono w-10 text-right shrink-0',
                  match.mmrDelta > 0 ? 'text-success' : match.mmrDelta < 0 ? 'text-destructive' : 'text-muted-foreground',
                )}
              >
                {match.mmrDelta > 0 ? `+${match.mmrDelta}` : match.mmrDelta}
              </span>

              {/* Badge */}
              <span
                className={cn(
                  'text-[11px] font-mono font-bold w-6 h-6 flex items-center justify-center rounded shrink-0 bg-secondary/60',
                  match.outcome === 'win' ? 'text-success' : 'text-destructive',
                )}
              >
                {match.outcome === 'win' ? 'W' : 'L'}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
