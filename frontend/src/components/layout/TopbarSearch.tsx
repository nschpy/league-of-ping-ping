import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search } from 'lucide-react'
import { api } from '@/lib/api'
import { useDebouncedQuery } from '@/lib/use-debounced-query'
import type { PlayerSummary } from '@/lib/types'

export function TopbarSearch() {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const fetcher = (q: string) =>
    api.get<PlayerSummary[]>(
      `/users/search?q=${encodeURIComponent(q)}&limit=8&excludeSelf=true`,
    )
  const { data, loading } = useDebouncedQuery(fetcher, query)
  const results = data ?? []

  useEffect(() => {
    function onMouseDown(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', onMouseDown)
    return () => document.removeEventListener('mousedown', onMouseDown)
  }, [])

  function handleSelect(p: PlayerSummary) {
    setQuery('')
    setOpen(false)
    navigate(`/games/new?opponentId=${p.id}`)
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Escape') setOpen(false)
  }

  const showDropdown = open && query.length >= 2

  return (
    <div
      ref={containerRef}
      className="relative flex-1 max-w-sm hidden sm:block"
    >
      <div className="flex items-center gap-2 h-9 px-3 rounded border border-border bg-card text-sm">
        <Search className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setOpen(true)
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder="Найти игрока"
          className="flex-1 bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none"
        />
      </div>
      {showDropdown && (
        <div className="absolute left-0 right-0 top-full mt-1 z-50 rounded border border-border bg-card shadow-lg">
          {loading ? (
            <div className="px-3 py-2 text-sm text-muted-foreground">Поиск...</div>
          ) : results.length === 0 ? (
            <div className="px-3 py-2 text-sm text-muted-foreground">Игрок не найден</div>
          ) : (
            <ul className="max-h-72 overflow-auto py-1">
              {results.map((p) => (
                <li key={p.id}>
                  <button
                    type="button"
                    onClick={() => handleSelect(p)}
                    className="flex w-full items-center justify-between px-3 py-2 text-left text-sm hover:bg-accent/10"
                  >
                    <span className="truncate">{p.nickname}</span>
                    <span className="ml-2 shrink-0 rounded bg-secondary px-2 py-0.5 text-xs text-muted-foreground">
                      {p.mmr} MMR
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  )
}
