import { api } from '@/lib/api'
import type { LiveMatch } from '@/lib/types/matches'

export function fetchLiveMatch(): Promise<LiveMatch | null> {
  return api.get<LiveMatch | null>('/users/me/games/live')
}
