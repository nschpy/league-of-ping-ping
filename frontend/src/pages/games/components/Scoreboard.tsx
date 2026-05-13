import { Button } from '@/components/ui/button'
import { ScoreCenter } from './ScoreCenter'
import { RefereePanel } from './RefereePanel'
import type { Game } from '@/lib/types'

interface Props {
  game: Game
  isReferee: boolean
  onAddPoint: (scorer: 'p1' | 'p2') => Promise<void>
  onUndo: () => Promise<void>
}

export function Scoreboard({ game, isReferee, onAddPoint, onUndo }: Props) {
  const disabled = game.status !== 'in_progress'

  if (!isReferee) {
    return (
      <div className="px-6">
        <ScoreCenter game={game} />
      </div>
    )
  }

  return (
    <>
      {/* Desktop: 3-column grid */}
      <div className="hidden md:grid md:grid-cols-[220px_1fr_220px]">
        <RefereePanel
          game={game}
          side="p1"
          onAction={() => onAddPoint('p1')}
          onUndo={onUndo}
        />
        <ScoreCenter game={game} />
        <RefereePanel
          game={game}
          side="p2"
          onAction={() => onAddPoint('p2')}
          onUndo={onUndo}
        />
      </div>

      {/* Mobile: score only, sticky bottom bar */}
      <div className="px-6 md:hidden">
        <ScoreCenter game={game} />
      </div>
      <div className="fixed bottom-0 left-0 right-0 z-40 flex gap-2 border-t bg-card px-4 py-3 md:hidden">
        <Button
          className="h-16 flex-1 text-2xl font-black"
          disabled={disabled}
          onClick={() => onAddPoint('p1')}
        >
          +1 {game.player1.nickname}
        </Button>
        <Button
          className="h-16 flex-1 bg-blue-500 text-2xl font-black text-white hover:bg-blue-500/90"
          disabled={disabled}
          onClick={() => onAddPoint('p2')}
        >
          +1 {game.player2.nickname}
        </Button>
      </div>
    </>
  )
}
