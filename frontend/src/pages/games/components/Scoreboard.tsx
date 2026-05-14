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
  const currentSet = game.sets[game.sets.length - 1]
  const canUndo = game.status === 'in_progress' && (currentSet?.points.length ?? 0) > 0

  if (!isReferee) {
    return <ScoreCenter game={game} />
  }

  return (
    <>
      {/* Desktop: 3-column grid with bordered side panels */}
      <div className="hidden md:grid md:grid-cols-[260px_1fr_260px] md:bg-card/40 rounded-xl border border-border overflow-hidden">
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
      <div className="md:hidden">
        <ScoreCenter game={game} />
      </div>
      <div className="fixed bottom-0 left-0 right-0 z-40 flex flex-col gap-2 border-t bg-card px-4 py-3 pb-[calc(env(safe-area-inset-bottom)+0.75rem)] md:hidden">
        {/* UNDO row */}
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="flex-1 text-xs font-semibold uppercase tracking-widest" disabled={!canUndo} onClick={onUndo}>↶ UNDO A</Button>
          <Button variant="outline" size="sm" className="flex-1 text-xs font-semibold uppercase tracking-widest" disabled={!canUndo} onClick={onUndo}>↶ UNDO B</Button>
        </div>
        {/* +1 row */}
        <div className="flex gap-2">
          <Button className="h-14 flex-1 text-xl font-black" disabled={disabled} onClick={() => onAddPoint('p1')}>+1 {game.player1.nickname}</Button>
          <Button className="h-14 flex-1 bg-blue-500 text-xl font-black text-white hover:bg-blue-500/90" disabled={disabled} onClick={() => onAddPoint('p2')}>+1 {game.player2.nickname}</Button>
        </div>
      </div>
    </>
  )
}
