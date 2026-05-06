import { UserRepository } from '../user/user.repository.js';
import { MmrCoreService } from '../game/game.mmr-core.service.js';
import { ValidationError } from '../../shared/errors.js';
export class MmrService {
    userRepo;
    mmrCore;
    constructor(userRepo, mmrCore) {
        this.userRepo = userRepo;
        this.mmrCore = mmrCore;
    }
    async forecast(aId, bId, format) {
        const [userA, userB] = await Promise.all([
            this.userRepo.findById(aId),
            this.userRepo.findById(bId),
        ]);
        if (!userA)
            throw new ValidationError(`User not found: ${aId}`);
        if (!userB)
            throw new ValidationError(`User not found: ${bId}`);
        const expA = 1 / (1 + Math.pow(10, (userB.mmr - userA.mmr) / 400));
        const expB = 1 - expA;
        const aWin = this.mmrCore.calculateDeltas(userA.mmr, userB.mmr, format);
        const bWin = this.mmrCore.calculateDeltas(userB.mmr, userA.mmr, format);
        return {
            format,
            expA: Math.round(expA * 100),
            expB: Math.round(expB * 100),
            aWin: { a: aWin.winnerDelta, b: aWin.loserDelta },
            bWin: { a: bWin.loserDelta, b: bWin.winnerDelta },
        };
    }
}
//# sourceMappingURL=mmr.service.js.map