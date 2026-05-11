import type { Game } from '@/lib/types'

interface Props {
  game: Game
}

export function CompletedBanner({ game }: Props) {
  if (game.status !== 'completed') return null

  const winner = game.winnerId === game.player1.id ? game.player1 : game.player2
  const finalP1Sets = game.sets.filter(
    (s) => s.completedAt !== undefined && s.player1Score > s.player2Score,
  ).length
  const finalP2Sets = game.sets.filter(
    (s) => s.completedAt !== undefined && s.player2Score > s.player1Score,
  ).length

  return (
    <div className="mx-6 mt-4 rounded-xl border border-primary/30 bg-primary/5 p-5">
      <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        Матч завершён
      </p>
      <p className="text-xl font-bold text-primary">
        {winner.nickname} побеждает
      </p>
      <p className="mt-1 text-sm text-muted-foreground">
        Счёт по сетам: {finalP1Sets} – {finalP2Sets}
      </p>
      <div className="mt-2 flex gap-4 text-sm">
        {game.player1MmrChange !== null && (
          <span>
            {game.player1.nickname}:{' '}
            <span className={game.player1MmrChange >= 0 ? 'text-green-400' : 'text-red-400'}>
              {game.player1MmrChange >= 0 ? '+' : ''}{game.player1MmrChange} MMR
            </span>
          </span>
        )}
        {game.player2MmrChange !== null && (
          <span>
            {game.player2.nickname}:{' '}
            <span className={game.player2MmrChange >= 0 ? 'text-green-400' : 'text-red-400'}>
              {game.player2MmrChange >= 0 ? '+' : ''}{game.player2MmrChange} MMR
            </span>
          </span>
        )}
      </div>
    </div>
  )
}
