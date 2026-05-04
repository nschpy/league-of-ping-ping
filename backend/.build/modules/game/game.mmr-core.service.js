const K_BY_FORMAT = {
    bo1: 12,
    bo3: 24,
    bo5: 32,
};
export class MmrCoreService {
    calculateDeltas(winnerMmr, loserMmr, format) {
        const K = K_BY_FORMAT[format];
        const expectedWinner = 1 / (1 + Math.pow(10, (loserMmr - winnerMmr) / 400));
        const winnerDelta = Math.round(K * (1 - expectedWinner));
        const loserDelta = -Math.round(K * expectedWinner);
        return { winnerDelta, loserDelta };
    }
}
//# sourceMappingURL=game.mmr-core.service.js.map