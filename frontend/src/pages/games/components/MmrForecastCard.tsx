import { mmrDelta } from '@/lib/game-scoring'
import type { Game } from '@/lib/types'

interface Props {
  game: Game
}

function DeltaBadge({ value }: { value: number }) {
  const sign = value >= 0 ? '+' : ''
  return (
    <span className={value >= 0 ? 'text-green-400' : 'text-red-400'}>
      {sign}{value}
    </span>
  )
}

export function MmrForecastCard({ game }: Props) {
  const { player1, player2, player1MmrBefore, player2MmrBefore, format } = game
  const isCompleted = game.status === 'completed'

  const p1WinDelta = isCompleted
    ? game.player1MmrChange
    : mmrDelta(player1MmrBefore, player2MmrBefore, true, format)
  const p1LoseDelta = isCompleted ? null : mmrDelta(player1MmrBefore, player2MmrBefore, false, format)
  const p2WinDelta = isCompleted
    ? game.player2MmrChange
    : mmrDelta(player2MmrBefore, player1MmrBefore, true, format)
  const p2LoseDelta = isCompleted ? null : mmrDelta(player2MmrBefore, player1MmrBefore, false, format)

  return (
    <div className="rounded-xl border bg-card p-5">
      <p className="mb-4 text-sm font-semibold text-foreground">
        {isCompleted ? 'Изменение MMR' : 'Прогноз MMR'}
      </p>
      <div className="flex flex-col gap-3">
        {[
          { player: player1, mmrBefore: player1MmrBefore, winDelta: p1WinDelta, loseDelta: p1LoseDelta },
          { player: player2, mmrBefore: player2MmrBefore, winDelta: p2WinDelta, loseDelta: p2LoseDelta },
        ].map(({ player, mmrBefore, winDelta, loseDelta }) => (
          <div key={player.id} className="flex items-center justify-between gap-2">
            <div>
              <p className="text-sm font-medium">{player.nickname}</p>
              <p className="text-xs text-muted-foreground">{mmrBefore} MMR</p>
            </div>
            <div className="flex gap-3 text-sm font-semibold tabular-nums">
              {isCompleted ? (
                <span>
                  {winDelta !== null ? <DeltaBadge value={winDelta} /> : '—'}
                  <span className="ml-1 text-xs text-muted-foreground">Применено</span>
                </span>
              ) : (
                <>
                  {winDelta !== null && <span>WIN <DeltaBadge value={winDelta} /></span>}
                  {loseDelta !== null && <span>LOSS <DeltaBadge value={loseDelta} /></span>}
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
