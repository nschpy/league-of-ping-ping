import { Link } from 'react-router-dom'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { initials, avatarColor } from '@/lib/player'
import type { LiveMatch } from '@/lib/types/matches'

interface LiveMatchBannerProps {
  match: LiveMatch
}

export function LiveMatchBanner({ match }: LiveMatchBannerProps) {
  const bg = avatarColor(match.opponent.id)
  const init = initials(match.opponent.nickname)

  return (
    <div className="flex items-center gap-4 px-4 py-3 rounded-lg border border-success bg-success/5">
      <style>{`
        @keyframes lt-pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
        .lt-pulse-dot { animation: lt-pulse 1.4s ease-in-out infinite; }
      `}</style>

      {/* LIVE pill */}
      <span className="bg-success text-background text-[11px] font-mono font-bold px-2.5 py-1 rounded-full flex items-center gap-1.5 shrink-0">
        <span
          className="lt-pulse-dot inline-block w-1.5 h-1.5 rounded-full bg-background"
        />
        LIVE
      </span>

      {/* Opponent avatar */}
      <Avatar className="h-8 w-8 shrink-0">
        <AvatarFallback
          className="text-[11px] font-mono font-bold text-background"
          style={{ backgroundColor: bg }}
        >
          {init}
        </AvatarFallback>
      </Avatar>

      {/* Info */}
      <div className="flex flex-col min-w-0">
        <span className="text-foreground text-[14px] font-semibold leading-tight">
          vs <span className="font-bold">{match.opponent.nickname}</span>
        </span>
        <span className="text-muted-foreground text-[11px] font-mono mt-0.5">
          {match.format} · сет {match.currentSetNumber}
        </span>
      </div>

      {/* Score */}
      <span
        className="text-[28px] font-bold tabular-nums text-success shrink-0"
        style={{ fontFamily: 'var(--font-display)' }}
      >
        {match.currentSetScore.user}:{match.currentSetScore.opponent}
      </span>

      <div className="flex-1" />

      <Link to={`/games/${match.id}`}>
        <Button size="sm">Смотреть матч</Button>
      </Link>
    </div>
  )
}
