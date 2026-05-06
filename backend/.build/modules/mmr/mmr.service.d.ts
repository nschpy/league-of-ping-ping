import { UserRepository } from '../user/user.repository.js';
import { MmrCoreService } from '../game/game.mmr-core.service.js';
import type { GameFormat } from '../game/game.model.js';
export interface MmrForecast {
    format: GameFormat;
    expA: number;
    expB: number;
    aWin: {
        a: number;
        b: number;
    };
    bWin: {
        a: number;
        b: number;
    };
}
export declare class MmrService {
    private readonly userRepo;
    private readonly mmrCore;
    constructor(userRepo: UserRepository, mmrCore: MmrCoreService);
    forecast(aId: string, bId: string, format: GameFormat): Promise<MmrForecast>;
}
//# sourceMappingURL=mmr.service.d.ts.map