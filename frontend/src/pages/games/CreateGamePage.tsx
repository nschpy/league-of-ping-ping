import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Clock, Play } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { api } from '@/lib/api'
import type { Game, GameFormat, PlayerSummary } from '@/lib/types'
import { PlayersSection } from './components/PlayersSection'
import { FormatSection } from './components/FormatSection'
import { MatchSummaryCard } from './components/MatchSummaryCard'
import { PlayerPickerDialog } from './components/PlayerPickerDialog'

export function CreateGamePage() {
  const navigate = useNavigate()

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
    player1.id !== player2.id

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
    <div className="mx-auto flex max-w-6xl flex-col gap-8 p-6">
      {/* Header */}
      <div className="flex flex-col gap-3">
        <div className="flex items-start justify-between gap-4">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Матчи <span className="text-primary">/ Новый матч</span>
          </p>
          <span className="inline-flex items-center gap-2 rounded-full border border-accent/40 bg-accent/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-accent">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            Ты — рефери
          </span>
        </div>
        <h1 className="font-display text-5xl font-bold uppercase tracking-wide text-foreground">
          Создать матч
        </h1>
        <p className="max-w-xl text-sm text-muted-foreground">
          Рефери выбирает участников и формат. После старта результаты сетов
          фиксируются здесь же.
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
      <div className="flex flex-col gap-3">
        {error && <p className="text-sm text-destructive">{error}</p>}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="flex items-center gap-2 text-xs text-muted-foreground">
            <Clock className="h-3.5 w-3.5" />
            После старта матч получит статус «В процессе»
          </p>
          <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
            <Button
              variant="ghost"
              onClick={() => navigate(-1)}
              className="w-full uppercase tracking-widest sm:w-auto"
            >
              Отмена
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!canSubmit || loading}
              className="w-full uppercase tracking-widest sm:w-auto"
            >
              <Play className="fill-current" />
              {loading ? 'Создание...' : 'Старт матча'}
            </Button>
          </div>
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
