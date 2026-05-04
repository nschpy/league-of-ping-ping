import { tierFor } from '../../shared/tier.js';
export interface LeaderboardEntry {
    rank: number;
    _id: unknown;
    displayName: string;
    username: string;
    country?: string | undefined;
    avatarColor: number;
    mmr: number;
    peakMmr: number;
    wins: number;
    losses: number;
    streak: number;
    recentResults: string;
    role: string;
    tier: ReturnType<typeof tierFor>;
}
export declare class LeaderboardService {
    getLeaderboard(opts: {
        limit?: number;
        tier?: string;
        search?: string;
    }): Promise<LeaderboardEntry[]>;
    getUserRank(userId: string): Promise<number>;
}
export declare const leaderboardService: LeaderboardService;
//# sourceMappingURL=leaderboard.service.d.ts.map