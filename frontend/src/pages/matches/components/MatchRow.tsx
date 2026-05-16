import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { initials, avatarColor } from '@/lib/player'
import { relativeTime } from '@/lib/relative-time'
import { cn } from '@/lib/utils'
import { SetsDisplay } from './SetsDisplay'
import type { RecentMatch } from '@/lib/types/dashboard'

interface MatchRowProps {
  match: RecentMatch
  isLast: boolean
}

export function MatchRow({ match, isLast }: MatchRowProps) {
  const isWin = match.outcome === 'win'
  const bg = avatarColor(match.opponent.id)
  const init = initials(match.opponent.nickname)
  const shortId = match.id.slice(-5)

  return (
    <div
      className={cn(
        'grid items-center h-[76px]',
        !isLast && 'border-b border-border',
      )}
      style={{ gridTemplateColumns: '3px 44px 1fr auto auto auto' }}
    >
      {/* Win/loss stripe */}
      <div
        className={cn(
          'self-stretch w-[3px] rounded-r-[1px]',
          isWin ? 'bg-success' : 'bg-destructive',
        )}
      />

      {/* Avatar */}
      <div className="flex items-center justify-center px-3">
        <Avatar className="h-8 w-8">
          <AvatarFallback
            className="text-[10px] font-mono font-bold text-background"
            style={{ backgroundColor: bg }}
          >
            {init}
          </AvatarFallback>
        </Avatar>
      </div>

      {/* Info */}
      <div className="flex flex-col justify-center min-w-0 pr-3">
        <span className="text-foreground text-[14px] font-semibold leading-tight truncate">
          vs <span className="font-bold">{match.opponent.nickname}</span>
        </span>
        <span className="text-muted-foreground text-[11px] font-mono mt-0.5">
          #{shortId} · {match.format} · {relativeTime(match.completedAt)}
        </span>
      </div>

      {/* Sets */}
      <div className="flex items-center pr-4">
        <SetsDisplay sets={match.setScores} />
      </div>

      {/* MMR delta */}
      <span
        className={cn(
          'font-mono text-[13px] font-bold min-w-[44px] text-right pr-4',
          match.mmrDelta > 0 ? 'text-success' : match.mmrDelta < 0 ? 'text-destructive' : 'text-muted-foreground',
        )}
      >
        {match.mmrDelta > 0 ? `+${match.mmrDelta}` : match.mmrDelta}
      </span>

      {/* W/L badge */}
      <div className="flex items-center justify-center pr-4">
        <span
          className={cn(
            'w-[28px] h-[28px] rounded flex items-center justify-center font-mono text-[11px] font-bold',
            isWin
              ? 'bg-success/15 border border-success/35 text-success'
              : 'bg-destructive/15 border border-destructive/35 text-destructive',
          )}
        >
          {isWin ? 'W' : 'L'}
        </span>
      </div>
    </div>
  )
}
