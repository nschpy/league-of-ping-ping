export interface LiveMatch {
  id: string
  opponent: {
    id: string
    nickname: string
    mmr: number
  }
  format: 'bo1' | 'bo3' | 'bo5'
  currentSetNumber: number
  currentSetScore: { user: number; opponent: number }
  setsWon: { user: number; opponent: number }
}
