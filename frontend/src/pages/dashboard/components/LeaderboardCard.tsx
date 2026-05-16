import { cn } from '@/lib/utils'
import { initials, avatarColor } from '@/lib/player'
import type { LeaderboardResponse, LeaderboardEntry } from '@/lib/types/dashboard'

interface AvatarBubbleProps {
  nickname: string
  size: number
}

function AvatarBubble({ nickname, size }: AvatarBubbleProps) {
  return (
    <div
      className="rounded-md flex items-center justify-center shrink-0 text-white font-mono font-bold uppercase"
      style={{
        background: avatarColor(nickname),
        width: size,
        height: size,
        fontSize: size * 0.4,
      }}
    >
      {initials(nickname)}
    </div>
  )
}

function RankLabel({ rank }: { rank: number }) {
  const isTop3 = rank <= 3
  return (
    <span
      className={cn(
        'text-[13px] font-mono font-bold w-5 text-center shrink-0',
        isTop3 ? 'text-primary' : 'text-muted-foreground',
      )}
    >
      {rank}
    </span>
  )
}

interface EntryRowProps {
  entry: LeaderboardEntry | { rank: number; id: string; nickname: string; mmr: number; isMe?: boolean }
  isMe: boolean
}

function EntryRow({ entry, isMe }: EntryRowProps) {
  return (
    <div
      className={cn(
        'flex items-center gap-3 px-2.5 py-2 rounded-md',
        isMe && 'bg-primary/10 border border-primary',
      )}
    >
      <RankLabel rank={entry.rank} />
      <AvatarBubble nickname={entry.nickname} size={26} />
      <span className={cn('text-[14px] flex-1 truncate', isMe ? 'text-primary font-semibold' : 'text-foreground')}>
        {entry.nickname}
        {isMe && <span className="text-muted-foreground font-normal ml-1 text-[11px]">(ты)</span>}
      </span>
      <span className="text-foreground text-[13px] font-mono shrink-0">{entry.mmr}</span>
    </div>
  )
}

interface LeaderboardCardProps {
  leaderboard: LeaderboardResponse | null
}

export function LeaderboardCard({ leaderboard }: LeaderboardCardProps) {
  if (!leaderboard) return (
    <div className="bg-card rounded-lg border border-border p-4">
      <span
        className="text-foreground text-[13px] uppercase tracking-widest px-1"
        style={{ fontFamily: 'var(--font-display)' }}
      >
        Топ лиги
      </span>
    </div>
  )

  const top5 = leaderboard.top.slice(0, 5)
  const meInTop = top5.some((e) => e.isMe)
  const showMeBelow = leaderboard.me !== null && !meInTop

  return (
    <div className="bg-card rounded-lg border border-border p-4 flex flex-col gap-3">
      <span
        className="text-foreground text-[13px] uppercase tracking-widest px-1"
        style={{ fontFamily: 'var(--font-display)' }}
      >
        Топ лиги
      </span>

      <div className="flex flex-col gap-1">
        {top5.map((entry) => (
          <EntryRow key={entry.id} entry={entry} isMe={entry.isMe} />
        ))}

        {showMeBelow && (
          <>
            <div className="flex items-center justify-center py-1">
              <span className="text-muted-foreground text-[12px] font-mono tracking-widest">···</span>
            </div>
            <EntryRow
              entry={{ ...leaderboard.me!, isMe: true }}
              isMe={true}
            />
          </>
        )}
      </div>
    </div>
  )
}
