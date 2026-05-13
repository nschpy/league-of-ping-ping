import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { Game } from '@/lib/types'

interface Props {
  game: Game
  side: 'p1' | 'p2'
  onAction: () => Promise<void>
  onUndo: () => Promise<void>
}

export function RefereePanel({ game, side, onAction, onUndo }: Props) {
  const [loading, setLoading] = useState(false)
  const player = side === 'p1' ? game.player1 : game.player2
  const isP1 = side === 'p1'
  const sideLabel = isP1 ? 'PLAYER A' : 'PLAYER B'
  const hotkey = isP1 ? 'A' : 'L'
  const disabled = loading || game.status !== 'in_progress'
  const sideShort = isP1 ? 'A' : 'B'
  const currentSet = game.sets[game.sets.length - 1]
  const hasPointsToUndo = (currentSet?.points.length ?? 0) > 0

  async function handleAction() {
    setLoading(true)
    try { await onAction() } finally { setLoading(false) }
  }

  async function handleUndo() {
    setLoading(true)
    try { await onUndo() } finally { setLoading(false) }
  }

  return (
    <div className="flex flex-col gap-4 border-r border-l border-border p-5 first:border-l-0 last:border-r-0">
      <div className="flex flex-col gap-1">
        <span
          className={cn(
            'text-[11px] font-bold uppercase tracking-widest',
            isP1 ? 'text-primary' : 'text-blue-400',
          )}
        >
          {sideLabel}
        </span>
        <span className="font-display text-xl font-bold uppercase tracking-wide text-foreground">
          {player.nickname}
        </span>
      </div>

      <button
        type="button"
        disabled={disabled}
        onClick={handleAction}
        className={cn(
          'group relative flex h-40 w-full flex-col items-center justify-center rounded-md px-4 text-primary-foreground transition-colors',
          'disabled:cursor-not-allowed disabled:opacity-50',
          isP1
            ? 'bg-primary hover:bg-primary/90'
            : 'bg-blue-500 text-white hover:bg-blue-500/90',
        )}
      >
        <span className="font-display text-5xl font-black leading-none">+1</span>
        <span className="mt-2 text-[10px] font-semibold uppercase tracking-widest opacity-80">
          Очко · {sideLabel}
        </span>
      </button>

      <div className="flex items-center justify-center gap-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
        <span>клавиша</span>
        <kbd className="rounded border border-border bg-card px-1.5 py-0.5 font-mono text-[10px] text-foreground">
          {hotkey}
        </kbd>
      </div>

      <Button
        variant="outline"
        size="sm"
        disabled={disabled || !hasPointsToUndo}
        onClick={handleUndo}
        className="mt-auto w-full text-xs font-semibold uppercase tracking-widest"
      >
        ↶ UNDO {sideShort}
      </Button>
    </div>
  )
}
