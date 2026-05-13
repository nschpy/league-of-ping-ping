import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface Props {
  open: boolean
  onOpenChange: (v: boolean) => void
  onSubmit: (p1: number, p2: number) => Promise<void>
}

export function FinalizeSetDialog({ open, onOpenChange, onSubmit }: Props) {
  const [p1, setP1] = useState('')
  const [p2, setP2] = useState('')
  const [loading, setLoading] = useState(false)

  const p1Num = parseInt(p1, 10)
  const p2Num = parseInt(p2, 10)
  const valid = !isNaN(p1Num) && !isNaN(p2Num) && p1Num >= 0 && p2Num >= 0

  async function handleSubmit() {
    if (!valid) return
    setLoading(true)
    try {
      await onSubmit(p1Num, p2Num)
      onOpenChange(false)
      setP1('')
      setP2('')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Завершить сет вручную</DialogTitle>
        </DialogHeader>
        <div className="flex gap-4">
          <div className="flex flex-1 flex-col gap-1">
            <Label>Очки игрока 1</Label>
            <Input type="number" min={0} value={p1} onChange={(e) => setP1(e.target.value)} />
          </div>
          <div className="flex flex-1 flex-col gap-1">
            <Label>Очки игрока 2</Label>
            <Input type="number" min={0} value={p2} onChange={(e) => setP2(e.target.value)} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)} disabled={loading}>
            Отмена
          </Button>
          <Button onClick={handleSubmit} disabled={!valid || loading}>
            {loading ? 'Сохранение...' : 'Сохранить'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
