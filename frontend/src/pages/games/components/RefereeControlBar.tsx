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
      <div className="flex items-center justify-between border-t bg-card px-6 py-3">
        <Button
          variant="outline"
          size="sm"
          disabled={disabled}
          onClick={() => setFinalizeOpen(true)}
        >
          Завершить сет вручную
        </Button>
        <Button
          variant="destructive"
          size="sm"
          disabled={disabled || cancelling}
          onClick={handleCancel}
        >
          {cancelling ? 'Отмена...' : 'Отменить матч'}
        </Button>
      </div>
      <FinalizeSetDialog
        open={finalizeOpen}
        onOpenChange={setFinalizeOpen}
        onSubmit={onFinalize}
      />
    </>
  )
}
