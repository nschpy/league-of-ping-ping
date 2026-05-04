import type { GameFormat } from './game.model.js';
export interface MmrDeltas {
    winnerDelta: number;
    loserDelta: number;
}
export declare class MmrCoreService {
    calculateDeltas(winnerMmr: number, loserMmr: number, format: GameFormat): MmrDeltas;
}
//# sourceMappingURL=game.mmr-core.service.d.ts.map