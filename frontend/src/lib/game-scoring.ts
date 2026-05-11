export type GameFormat = 'bo1' | 'bo3' | 'bo5'

const SETS_TO_WIN: Record<GameFormat, number> = { bo1: 1, bo3: 2, bo5: 3 }
const K_BY_FORMAT: Record<GameFormat, number> = { bo1: 12, bo3: 24, bo5: 32 }

export function setsToWin(format: GameFormat): number {
  return SETS_TO_WIN[format]
}

export function isSetComplete(a: number, b: number): boolean {
  return (a >= 11 || b >= 11) && Math.abs(a - b) >= 2
}

export function expectedScore(myMmr: number, oppMmr: number): number {
  return 1 / (1 + 10 ** ((oppMmr - myMmr) / 400))
}

export function mmrDelta(myMmr: number, oppMmr: number, won: boolean, format: GameFormat): number {
  const K = K_BY_FORMAT[format]
  return Math.round(K * ((won ? 1 : 0) - expectedScore(myMmr, oppMmr)))
}
