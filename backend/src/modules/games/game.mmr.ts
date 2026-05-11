import type { GameFormat } from './game.scoring.js'

const K_BY_FORMAT: Record<GameFormat, number> = { bo1: 12, bo3: 24, bo5: 32 }

export function expectedScore(myMmr: number, oppMmr: number): number {
  return 1 / (1 + 10 ** ((oppMmr - myMmr) / 400))
}

export function mmrDelta(myMmr: number, oppMmr: number, won: boolean, format: GameFormat): number {
  const K = K_BY_FORMAT[format]
  return Math.round(K * ((won ? 1 : 0) - expectedScore(myMmr, oppMmr)))
}
