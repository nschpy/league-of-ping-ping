import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { FinalizeSetDialog } from './FinalizeSetDialog'
import type { Game } from '@/lib/types'

interface Props {
  game: Game
  onFinalize: (p1: number, p2: number) => Promise<void>
  onCancel: () => Promise<void>
}

export function RefereeControlBar({ game, onFinalize, onCancel }: Props) {
  const [finalizeOpen, setFinalizeOpen] = useState(false)
  const [cancelling, setCancelling] = useState(false)
  const disabled = game.status !== 'in_progress'

  async function handleCancel() {
    if (!window.confirm('Отменить матч? Это действие нельзя отменить.')) return
    setCancelling(true)
    try { await onCancel() } finally { setCancelling(false) }
  }

  return (
    <>
      <div className="flex flex-wrap items-center gap-3 border-t border-border bg-card/40 px-6 py-3">
        <span className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
          Контроль рефери
        </span>
        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={disabled}
            onClick={() => setFinalizeOpen(true)}
            className="text-xs font-semibold uppercase tracking-widest"
          >
            → Завершить сет вручную
          </Button>
        </div>
        <div className="ml-auto flex items-center gap-3">
          <Button
            variant="destructive"
            size="sm"
            disabled={disabled || cancelling}
            onClick={handleCancel}
            className="text-xs font-semibold uppercase tracking-widest"
          >
            {cancelling ? 'Отмена...' : '⊘ Отменить матч'}
          </Button>
          <span className="text-[10px] uppercase tracking-widest text-muted-foreground">
            MMR не применится
          </span>
        </div>
      </div>
      <FinalizeSetDialog
        open={finalizeOpen}
        onOpenChange={setFinalizeOpen}
        onSubmit={onFinalize}
      />
    </>
  )
}
