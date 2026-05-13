import { Badge } from '@/components/ui/badge'
import type { GameStatus } from '@/lib/types'

interface Props {
  status: GameStatus
}

export function GameStatusBadge({ status }: Props) {
  if (status === 'in_progress') {
    return (
      <Badge className="gap-1.5 border-green-500 bg-green-500/10 text-green-400 hover:bg-green-500/10">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
        </span>
        В ПРОЦЕССЕ
      </Badge>
    )
  }
  if (status === 'completed') {
    return (
      <Badge variant="secondary">ЗАВЕРШЁН</Badge>
    )
  }
  return (
    <Badge variant="destructive">ОТМЕНЁН</Badge>
  )
}
