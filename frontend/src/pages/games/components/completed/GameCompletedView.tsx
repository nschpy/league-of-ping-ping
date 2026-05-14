import type { Game } from '@/lib/types'
import { CompletedMetaRow } from './CompletedMetaRow'
import { WinnerHeroCard } from './WinnerHeroCard'
import { SetBreakdownCard } from './SetBreakdownCard'
import { MmrChangeCard } from './MmrChangeCard'

interface Props {
  game: Game
}

export function GameCompletedView({ game }: Props) {
  return (
    <div className="flex flex-col gap-5 px-4 sm:px-6 pb-8">
      <CompletedMetaRow game={game} />
      <WinnerHeroCard game={game} />
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1.4fr_1fr]">
        <SetBreakdownCard game={game} />
        <MmrChangeCard game={game} />
      </div>
    </div>
  )
}
