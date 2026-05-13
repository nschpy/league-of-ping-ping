import { Badge } from '@/components/ui/badge'
import { GameStatusBadge } from './GameStatusBadge'
import type { Game } from '@/lib/types'

interface Props {
  game: Game
  isReferee: boolean
}

const FORMAT_LABELS: Record<string, string> = { bo1: 'BO1', bo3: 'BO3', bo5: 'BO5' }

export function GameHeader({ game, isReferee }: Props) {
  const winner =
    game.status === 'completed' && game.winnerId
      ? game.winnerId === game.player1.id
        ? game.player1.nickname
        : game.player2.nickname
      : null

  return (
    <div className="flex flex-col gap-3 border-b px-6 py-5">
      <div className="flex flex-wrap items-center gap-2">
        <GameStatusBadge status={game.status} />
        <Badge variant="outline">#{game.id.slice(-5).toUpperCase()}</Badge>
        <Badge variant="outline">{FORMAT_LABELS[game.format]}</Badge>
        {isReferee && (
          <Badge className="border-yellow-500 bg-yellow-500/10 text-yellow-400 hover:bg-yellow-500/10">
            РЕЖИМ РЕФЕРИ
          </Badge>
        )}
      </div>
      <h1 className="font-display text-2xl font-bold text-foreground">
        {game.status === 'completed' && winner ? (
          <>
            <span className="text-primary">{winner}</span>
            <span className="text-muted-foreground"> — победитель</span>
          </>
        ) : (
          <>
            {game.player1.nickname}{' '}
            <span className="text-muted-foreground">vs</span>{' '}
            {game.player2.nickname}
          </>
        )}
      </h1>
    </div>
  )
}
