import { useCallback, useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import { api } from '@/lib/api'
import { useAuthStore } from '@/stores/auth'
import { cn } from '@/lib/utils'
import type { Game } from '@/lib/types'
import { CompletedBanner } from './components/CompletedBanner'
import { GameHeader } from './components/GameHeader'
import { Scoreboard } from './components/Scoreboard'
import { RefereeControlBar } from './components/RefereeControlBar'
import { PointTimelineCard } from './components/PointTimelineCard'
import { MmrForecastCard } from './components/MmrForecastCard'

export function GameViewPage() {
  const { id } = useParams<{ id: string }>()
  const user = useAuthStore((s) => s.user)
  const [game, setGame] = useState<Game | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [mutationError, setMutationError] = useState<string | null>(null)
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const isReferee = !!(game && user && user.id === game.referee.id)

  async function fetchGame() {
    try {
      const data = await api.get<Game>(`/games/${id}`)
      setGame(data)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Ошибка загрузки матча')
    }
  }

  useEffect(() => {
    fetchGame()
  }, [id])

  useEffect(() => {
    if (!game) return
    if (game.status === 'in_progress' && !isReferee) {
      pollRef.current = setInterval(fetchGame, 3000)
    }
    return () => {
      if (pollRef.current) clearInterval(pollRef.current)
    }
  }, [game?.status, isReferee])

  const addPoint = useCallback(async (scorer: 'p1' | 'p2') => {
    try {
      const updated = await api.post<Game>(`/games/${id}/points`, { scorer })
      setGame(updated)
      setMutationError(null)
    } catch (e) {
      setMutationError(e instanceof Error ? e.message : 'Ошибка')
    }
  }, [id])

  // Keyboard shortcuts for referee
  useEffect(() => {
    if (!isReferee) return
    function onKey(e: KeyboardEvent) {
      if (e.target instanceof HTMLInputElement) return
      if (e.key === 'a' || e.key === 'A') addPoint('p1')
      if (e.key === 'l' || e.key === 'L') addPoint('p2')
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [isReferee, addPoint])

  async function undoLast() {
    try {
      const updated = await api.del<Game>(`/games/${id}/points/last`)
      setGame(updated)
      setMutationError(null)
    } catch (e) {
      setMutationError(e instanceof Error ? e.message : 'Ошибка')
    }
  }

  async function finalizeSet(p1: number, p2: number) {
    try {
      const updated = await api.post<Game>(`/games/${id}/sets`, {
        player1Score: p1,
        player2Score: p2,
      })
      setGame(updated)
      setMutationError(null)
    } catch (e) {
      setMutationError(e instanceof Error ? e.message : 'Ошибка')
    }
  }

  async function cancelGame() {
    try {
      const updated = await api.post<Game>(`/games/${id}/cancel`, {})
      setGame(updated)
      setMutationError(null)
    } catch (e) {
      setMutationError(e instanceof Error ? e.message : 'Ошибка')
    }
  }

  if (error) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center p-8">
        <p className="text-destructive">{error}</p>
      </div>
    )
  }

  if (!game) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center p-8">
        <p className="text-muted-foreground">Загрузка...</p>
      </div>
    )
  }

  const currentSet = game.sets[game.sets.length - 1]
  const setIndex = game.sets.length

  return (
    <div className={cn("flex flex-col px-4 sm:px-6", isReferee && "pb-44 md:pb-0")}>
      {game.status === 'completed' && <CompletedBanner game={game} />}
      <GameHeader game={game} isReferee={isReferee} />
      {mutationError && (
        <p className="py-2 text-sm text-destructive">{mutationError}</p>
      )}
      <Scoreboard
        game={game}
        isReferee={isReferee}
        onAddPoint={addPoint}
        onUndo={() => undoLast()}
      />
      {isReferee && (
        <RefereeControlBar game={game} onFinalize={finalizeSet} onCancel={cancelGame} />
      )}
      <div className="grid grid-cols-1 gap-5 py-5 lg:grid-cols-2">
        <PointTimelineCard set={currentSet} setIndex={setIndex} />
        <MmrForecastCard game={game} />
      </div>
    </div>
  )
}
