import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { patchMe } from '@/lib/profile-api'

interface EditProfileModalProps {
  open: boolean
  current: { nickname: string; city: string | null }
  onClose: () => void
  onSaved: (updated: { nickname: string }) => void
}

export function EditProfileModal({ open, current, onClose, onSaved }: EditProfileModalProps) {
  const [nickname, setNickname] = useState(current.nickname)
  const [city, setCity] = useState(current.city ?? '')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Reset fields when modal opens with new current values
  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      onClose()
    } else {
      setNickname(current.nickname)
      setCity(current.city ?? '')
      setError(null)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      await patchMe({ nickname, city: city.trim() || null })
      onSaved({ nickname })
      onClose()
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Ошибка сохранения'
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Редактировать профиль</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-2">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="edit-nickname">Никнейм</Label>
            <Input
              id="edit-nickname"
              value={nickname}
              onChange={e => setNickname(e.target.value)}
              pattern="[a-zA-Z0-9._-]{3,20}"
              minLength={3}
              maxLength={20}
              required
              disabled={loading}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="edit-city">Город <span className="text-muted-foreground text-[11px] font-mono">(необязательно)</span></Label>
            <Input
              id="edit-city"
              value={city}
              onChange={e => setCity(e.target.value)}
              maxLength={64}
              disabled={loading}
            />
          </div>

          {error && (
            <p className="text-destructive text-[13px] font-mono mt-2">{error}</p>
          )}

          <div className="flex gap-2 justify-end mt-2">
            <DialogClose asChild>
              <Button type="button" variant="ghost" disabled={loading}>
                Отмена
              </Button>
            </DialogClose>
            <Button type="submit" variant="default" disabled={loading}>
              {loading ? 'Сохранение…' : 'Сохранить'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
