import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { initials, avatarColor } from '@/lib/player'
import { cn } from '@/lib/utils'
import type { ChallengeSuggestion } from '@/lib/types/dashboard'

interface AvatarBubbleProps {
  nickname: string
  size: number
}

function AvatarBubble({ nickname, size }: AvatarBubbleProps) {
  return (
    <div
      className="rounded-lg flex items-center justify-center shrink-0 text-white font-mono font-bold uppercase"
      style={{
        background: avatarColor(nickname),
        width: size,
        height: size,
        fontSize: size * 0.36,
      }}
    >
      {initials(nickname)}
    </div>
  )
}

interface ChallengeListCardProps {
  suggestions: ChallengeSuggestion[]
}

export function ChallengeListCard({ suggestions }: ChallengeListCardProps) {
  const navigate = useNavigate()

  return (
    <div className="bg-card rounded-lg border border-border p-4 flex flex-col gap-3">
      <div className="flex items-center justify-between px-1">
        <span
          className="text-foreground text-[13px] uppercase tracking-widest"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          Бросить вызов
        </span>
        <button
          className="text-primary text-[11px] font-mono tracking-wider hover:opacity-80 transition-opacity"
          onClick={() => navigate('/games/new')}
        >
          + НОВЫЙ
        </button>
      </div>

      {suggestions.length === 0 ? (
        <p className="text-muted-foreground text-[12px] text-center py-4">
          Нет предложений
        </p>
      ) : (
        <div className="flex flex-col gap-2">
          {suggestions.map((s) => (
            <div
              key={s.id}
              className="flex items-center gap-3 bg-secondary/40 rounded-lg px-3 py-2.5"
            >
              <AvatarBubble nickname={s.nickname} size={36} />
              <div className="flex flex-col flex-1 min-w-0">
                <span className="text-foreground text-[14px] font-semibold truncate leading-tight">{s.nickname}</span>
                <span className="text-muted-foreground text-[11px] font-mono mt-0.5">
                  MMR {s.mmr} · H2H {s.h2h.wins}–{s.h2h.losses}
                </span>
              </div>
              <Button
                size="sm"
                className={cn(
                  'h-8 px-3 text-[11px] font-mono tracking-wider uppercase shrink-0',
                  'bg-primary text-primary-foreground hover:bg-primary/90',
                )}
                onClick={() => navigate(`/games/new?opponentId=${s.id}`)}
              >
                ЧЕЛЛЕНДЖ
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
