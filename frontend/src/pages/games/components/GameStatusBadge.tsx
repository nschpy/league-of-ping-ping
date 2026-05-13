import { Badge } from '@/components/ui/badge'
import type { GameStatus } from '@/lib/types'

interface Props {
  status: GameStatus
}

const STATUS_BADGE_BASE =
  'rounded-full border-2 px-3.5 py-1 text-sm font-extrabold tracking-wide'

export function GameStatusBadge({ status }: Props) {
  if (status === 'in_progress') {
    return (
      <Badge
        className={`${STATUS_BADGE_BASE} gap-2 border-green-500 bg-background/70 text-green-400 hover:bg-background/70`}
      >
        <span className="inline-flex h-2.5 w-2.5 rounded-full bg-green-400" />
        <span className="leading-none">В ПРОЦЕССЕ</span>
      </Badge>
    )
  }
  if (status === 'completed') {
    return (
      <Badge
        className={`${STATUS_BADGE_BASE} border-border bg-card text-muted-foreground hover:bg-card`}
      >
        <span className="leading-none">ЗАВЕРШЕН</span>
      </Badge>
    )
  }
  return (
    <Badge
      className={`${STATUS_BADGE_BASE} border-destructive bg-destructive text-destructive-foreground hover:bg-destructive`}
    >
      <span className="leading-none">ОТМЕНЕН</span>
    </Badge>
  )
}
