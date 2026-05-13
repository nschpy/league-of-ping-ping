import { Badge } from '@/components/ui/badge'
import { GameStatusBadge } from './GameStatusBadge'
import type { Game } from '@/lib/types'

interface Props {
  game: Game
  isReferee: boolean
}

const FORMAT_LABELS: Record<string, string> = { bo1: 'BO1', bo3: 'BO3', bo5: 'BO5' }
const HEADER_BADGE_BASE = 'rounded-full px-3.5 py-1 text-sm font-extrabold tracking-wide'

export function GameHeader({ game, isReferee }: Props) {
  const winner =
    game.status === 'completed' && game.winnerId
      ? game.winnerId === game.player1.id
        ? game.player1.nickname
        : game.player2.nickname
      : null

  return (
    <div className="flex flex-col gap-2 py-8">
      <div className="flex flex-wrap items-center gap-2.5">
        <GameStatusBadge status={game.status} />
        <Badge
          className={`${HEADER_BADGE_BASE} border-border bg-card text-muted-foreground hover:bg-card`}
        >
          MATCH #{game.id.slice(-5).toUpperCase()}
        </Badge>
        <Badge
          className={`${HEADER_BADGE_BASE} border! border-accent! bg-transparent! text-accent hover:bg-accent/10`}
        >
          {FORMAT_LABELS[game.format]}
        </Badge>
        {isReferee && (
          <Badge
            className={`${HEADER_BADGE_BASE} border-0! bg-primary text-primary-foreground hover:bg-primary`}
          >
            РЕЖИМ РЕФЕРИ
          </Badge>
        )}
      </div>
      <h1 className="font-display text-3xl leading-none font-black uppercase tracking-wide text-foreground sm:text-5xl md:text-6xl min-w-0 break-words">
        {game.status === 'completed' && winner ? (
          <>
            <span className="text-primary">{winner}</span>
            <span className="text-muted-foreground"> — победитель</span>
          </>
        ) : (
          <>
            <span>{game.player1.nickname}</span>
            <span className="mx-3 text-muted-foreground/70">VS</span>
            <span>{game.player2.nickname}</span>
          </>
        )}
      </h1>
    </div>
  )
}
