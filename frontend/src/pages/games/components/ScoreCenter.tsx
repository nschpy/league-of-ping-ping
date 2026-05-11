import { SetStrip } from './SetStrip'
import { setsToWin } from '@/lib/game-scoring'
import type { Game } from '@/lib/types'

interface Props {
  game: Game
}

export function ScoreCenter({ game }: Props) {
  const { sets, format, player1, player2 } = game
  const currentSet = sets[sets.length - 1]
  const setIndex = sets.length

  const p1SetWins = sets.filter(
    (s) => s.completedAt != null && s.player1Score > s.player2Score,
  ).length
  const p2SetWins = sets.filter(
    (s) => s.completedAt != null && s.player2Score > s.player1Score,
  ).length

  const needed = setsToWin(format)

  return (
    <div className="flex flex-col items-center gap-4 py-6">
      <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
        Сет {setIndex} · текущий счёт
      </p>

      {/* Big score */}
      <div className="flex items-center gap-8">
        <div className="flex flex-col items-center gap-1">
          <span className="text-xs font-medium text-muted-foreground">{player1.nickname}</span>
          <span className="font-mono text-8xl font-black tabular-nums text-foreground">
            {currentSet?.player1Score ?? 0}
          </span>
        </div>
        <span className="text-4xl font-light text-muted-foreground">:</span>
        <div className="flex flex-col items-center gap-1">
          <span className="text-xs font-medium text-muted-foreground">{player2.nickname}</span>
          <span className="font-mono text-8xl font-black tabular-nums text-blue-400">
            {currentSet?.player2Score ?? 0}
          </span>
        </div>
      </div>

      {/* Set tally */}
      <p className="text-sm text-muted-foreground">
        Сеты: {p1SetWins} – {p2SetWins} · до {needed} побед
      </p>

      {/* Set strip */}
      <SetStrip sets={sets} format={format} />
    </div>
  )
}
