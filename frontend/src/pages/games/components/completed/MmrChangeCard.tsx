import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { api } from '@/lib/api'
import { cn } from '@/lib/utils'
import { initials, playerTileClasses } from '@/lib/player'
import type { Game, PlayerSummary } from '@/lib/types'

interface Props {
  game: Game
}

interface MmrRowData {
  player: PlayerSummary
  mmrBefore: number
  change: number
  isP1: boolean
  won: boolean
}

function MmrRow({ row }: { row: MmrRowData }) {
  return (
    <div
      className={cn(
        'rounded-md border bg-background/40 p-3',
        row.won ? 'border-success/40' : 'border-border',
      )}
    >
      <div className="flex items-center gap-2">
        <div
          className={cn(
            'flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-md font-display text-xs font-black',
            playerTileClasses(row.isP1),
          )}
        >
          {initials(row.player.nickname)}
        </div>
        <p className="min-w-0 flex-1 truncate text-[13px] font-medium text-foreground">
          {row.player.nickname}
        </p>
        <span
          className={cn(
            'flex-shrink-0 font-mono text-xs font-bold',
            row.won ? 'text-green-400' : 'text-red-400',
          )}
        >
          {row.change >= 0 ? '+' : ''}
          {row.change}
        </span>
      </div>
      <div className="mt-2 flex items-center gap-1.5">
        <span className="font-mono text-[13px] text-muted-foreground line-through">
          {row.mmrBefore}
        </span>
        <ArrowRight className="h-3.5 w-3.5 text-muted-foreground" />
        <span className="font-display text-xl font-black text-foreground">
          {row.mmrBefore + row.change}
        </span>
      </div>
    </div>
  )
}

export function MmrChangeCard({ game }: Props) {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (!game.winnerId) return null

  const isP1Winner = game.winnerId === game.player1.id
  const p1Change = game.player1MmrChange ?? 0
  const p2Change = game.player2MmrChange ?? 0
  const rows: MmrRowData[] = isP1Winner
    ? [
        { player: game.player1, mmrBefore: game.player1MmrBefore, change: p1Change, isP1: true, won: true },
        { player: game.player2, mmrBefore: game.player2MmrBefore, change: p2Change, isP1: false, won: false },
      ]
    : [
        { player: game.player2, mmrBefore: game.player2MmrBefore, change: p2Change, isP1: false, won: true },
        { player: game.player1, mmrBefore: game.player1MmrBefore, change: p1Change, isP1: true, won: false },
      ]

  async function handleRematch() {
    setLoading(true)
    setError(null)
    try {
      const created = await api.post<Game>('/games', {
        player1Id: game.player1.id,
        player2Id: game.player2.id,
        format: game.format,
      })
      navigate(`/games/${created.id}`)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Ошибка создания матча')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="rounded-xl border bg-card p-5">
      <p className="mb-4 font-display text-base uppercase tracking-widest text-foreground">
        ИЗМЕНЕНИЕ MMR
      </p>
      <div className="flex flex-col gap-3">
        {rows.map((row) => (
          <MmrRow key={row.player.id} row={row} />
        ))}
      </div>
      <Button
        className="mt-4 w-full uppercase tracking-widest"
        onClick={handleRematch}
        disabled={loading}
      >
        {loading ? 'Создание...' : 'Реванш'}
      </Button>
      {error && <p className="mt-2 text-sm text-destructive">{error}</p>}
    </div>
  )
}
