interface SetScore {
  user: number
  opponent: number
}

interface SetsDisplayProps {
  sets: SetScore[]
  outcome: 'win' | 'loss'
}

export function SetsDisplay({ sets }: SetsDisplayProps) {
  return (
    <div className="flex gap-1.5 items-center">
      {sets.map((set, i) => {
        const userWon = set.user > set.opponent
        return (
          <div
            key={i}
            className="bg-secondary/60 rounded px-2 py-1 font-mono text-[12px] font-bold flex gap-1"
          >
            <span className={userWon ? 'text-success' : 'text-destructive'}>
              {set.user}
            </span>
            <span className="text-muted-foreground">:</span>
            <span className={userWon ? 'text-destructive' : 'text-success'}>
              {set.opponent}
            </span>
          </div>
        )
      })}
    </div>
  )
}
