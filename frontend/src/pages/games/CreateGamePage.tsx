import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { api } from '@/lib/api'
import { useAuthStore } from '@/stores/auth'
import type { Game, GameFormat, PlayerSummary } from '@/lib/types'
import { PlayersSection } from './components/PlayersSection'
import { FormatSection } from './components/FormatSection'
import { MatchSummaryCard } from './components/MatchSummaryCard'
import { PlayerPickerDialog } from './components/PlayerPickerDialog'

export function CreateGamePage() {
  const navigate = useNavigate()
  const currentUser = useAuthStore((s) => s.user)

  const [player1, setPlayer1] = useState<PlayerSummary | null>(null)
  const [player2, setPlayer2] = useState<PlayerSummary | null>(null)
  const [format, setFormat] = useState<GameFormat | null>(null)
  const [pickerOpen, setPickerOpen] = useState<{ slot: 1 | 2 } | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const bothSelected = player1 !== null && player2 !== null
  const canSubmit =
    bothSelected &&
    format !== null &&
    player1.id !== player2.id &&
    currentUser?.id !== player1.id &&
    currentUser?.id !== player2.id

  async function handleSubmit() {
    if (!player1 || !player2 || !format) return
    setError(null)
    setLoading(true)
    try {
      const game = await api.post<Game>('/games', {
        player1Id: player1.id,
        player2Id: player2.id,
        format,
      })
      navigate(`/games/${game.id}`)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Ошибка создания матча')
    } finally {
      setLoading(false)
    }
  }

  const excludeIds1 = player2 ? [player2.id] : []
  const excludeIds2 = player1 ? [player1.id] : []

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-8 p-6">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <p className="text-xs text-muted-foreground">Матчи / Новый матч</p>
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="font-display text-4xl font-bold uppercase text-foreground">
            Создать матч
          </h1>
          <span className="rounded-full bg-accent/20 px-3 py-1 text-xs font-semibold text-accent">
            Ты — рефери
          </span>
        </div>
        <p className="text-sm text-muted-foreground">
          Выбери двух игроков и формат матча для начала игры.
        </p>
      </div>

      <PlayersSection
        player1={player1}
        player2={player2}
        onPickPlayer1={() => setPickerOpen({ slot: 1 })}
        onPickPlayer2={() => setPickerOpen({ slot: 2 })}
      />

      <FormatSection selected={format} onSelect={setFormat} />

      {bothSelected && format && (
        <MatchSummaryCard player1={player1} player2={player2} format={format} />
      )}

      {/* Actions */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {error && <p className="text-sm text-destructive">{error}</p>}
        <div className="flex flex-1 flex-col gap-2 sm:flex-row sm:justify-end">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="w-full sm:w-auto"
          >
            Отмена
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!canSubmit || loading}
            className="w-full sm:w-auto"
          >
            {loading ? 'Создание...' : 'Старт матча'}
          </Button>
        </div>
      </div>

      <PlayerPickerDialog
        open={pickerOpen?.slot === 1}
        onOpenChange={(v) => !v && setPickerOpen(null)}
        onSelect={(p) => { setPlayer1(p); setPickerOpen(null) }}
        excludeIds={excludeIds1}
      />
      <PlayerPickerDialog
        open={pickerOpen?.slot === 2}
        onOpenChange={(v) => !v && setPickerOpen(null)}
        onSelect={(p) => { setPlayer2(p); setPickerOpen(null) }}
        excludeIds={excludeIds2}
      />
    </div>
  )
}
