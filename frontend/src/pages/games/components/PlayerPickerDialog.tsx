import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from '@/components/ui/command'
import { api } from '@/lib/api'
import { useDebouncedQuery } from '@/lib/use-debounced-query'
import type { PlayerSummary } from '@/lib/types'

interface PlayerPickerDialogProps {
  open: boolean
  onOpenChange: (v: boolean) => void
  onSelect: (player: PlayerSummary) => void
  excludeIds: string[]
}

export function PlayerPickerDialog({
  open,
  onOpenChange,
  onSelect,
  excludeIds,
}: PlayerPickerDialogProps) {
  const [query, setQuery] = useState('')

  const fetcher = (q: string) =>
    api.get<PlayerSummary[]>(`/users/search?q=${encodeURIComponent(q)}&limit=10`)

  const { data, loading } = useDebouncedQuery(fetcher, query)

  const results = (data ?? []).filter((p) => !excludeIds.includes(p.id))

  function handleSelect(player: PlayerSummary) {
    onSelect(player)
    onOpenChange(false)
    setQuery('')
  }

  function handleOpenChange(v: boolean) {
    onOpenChange(v)
    if (!v) setQuery('')
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="p-0">
        <DialogHeader className="px-4 pt-4">
          <DialogTitle>Выбрать игрока</DialogTitle>
        </DialogHeader>
        <Command shouldFilter={false}>
          <CommandInput
            placeholder="Введите никнейм..."
            value={query}
            onValueChange={setQuery}
          />
          <CommandList>
            {query.length < 2 ? (
              <CommandEmpty>Введите 2+ символа для поиска</CommandEmpty>
            ) : loading ? (
              <CommandEmpty>Загрузка...</CommandEmpty>
            ) : results.length === 0 ? (
              <CommandEmpty>Игрок не найден</CommandEmpty>
            ) : (
              <CommandGroup>
                {results.map((player) => (
                  <CommandItem
                    key={player.id}
                    value={player.id}
                    onSelect={() => handleSelect(player)}
                    className="flex items-center justify-between"
                  >
                    <span>{player.nickname}</span>
                    <span className="rounded bg-secondary px-2 py-0.5 text-xs text-muted-foreground">
                      {player.mmr} MMR
                    </span>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </DialogContent>
    </Dialog>
  )
}
