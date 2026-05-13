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

  async function handleAction() {
    setLoading(true)
    try { await onAction() } finally { setLoading(false) }
  }

  async function handleUndo() {
    setLoading(true)
    try { await onUndo() } finally { setLoading(false) }
  }

  return (
    <div className="flex flex-col items-center gap-3 p-4">
      <span className="text-sm font-semibold text-foreground">{player.nickname}</span>
      <Button
        className={cn(
          'h-24 w-full text-3xl font-black',
          isP1 ? 'bg-primary hover:bg-primary/90' : 'bg-blue-500 hover:bg-blue-500/90 text-white',
        )}
        disabled={loading || game.status !== 'in_progress'}
        onClick={handleAction}
      >
        +1
      </Button>
      <Button
        variant="ghost"
        size="sm"
        disabled={loading || game.status !== 'in_progress'}
        onClick={handleUndo}
        className="w-full text-xs text-muted-foreground"
      >
        ↩ Undo
      </Button>
      <span className="text-[10px] text-muted-foreground">
        клавиша {isP1 ? 'A' : 'L'}
      </span>
    </div>
  )
}
