import type { GameFormat } from './game.model.js';

const K_BY_FORMAT: Record<GameFormat, number> = {
  bo1: 12,
  bo3: 24,
  bo5: 32,
};

export interface MmrDeltas {
  winnerDelta: number;
  loserDelta: number;
}

export class MmrCoreService {
  calculateDeltas(winnerMmr: number, loserMmr: number, format: GameFormat): MmrDeltas {
    const K = K_BY_FORMAT[format];
    const expectedWinner = 1 / (1 + Math.pow(10, (loserMmr - winnerMmr) / 400));
    const winnerDelta = Math.round(K * (1 - expectedWinner));
    const loserDelta = -Math.round(K * expectedWinner);
    return { winnerDelta, loserDelta };
  }
}
