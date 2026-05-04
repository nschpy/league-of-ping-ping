import { UserModel } from '../user/user.model.js';
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

export class LeaderboardService {
  async getLeaderboard(opts: {
    limit?: number;
    tier?: string;
    search?: string;
  }): Promise<LeaderboardEntry[]> {
    const { limit = 20, tier, search } = opts;

    const query: Record<string, unknown> = { role: 'player' };

    if (search) {
      const re = new RegExp(search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
      query['$or'] = [{ displayName: re }, { username: re }];
    }

    if (tier) {
      const TIER_MMR: Record<string, [number, number]> = {
        Bronze: [0, 999],
        Silver: [1000, 1199],
        Gold: [1200, 1399],
        Platinum: [1400, 1599],
        Diamond: [1600, 1799],
        Master: [1800, Infinity],
      };
      const range = TIER_MMR[tier];
      if (range) {
        query['mmr'] = { $gte: range[0], ...(range[1] !== Infinity ? { $lte: range[1] } : {}) };
      }
    }

    const users = await UserModel.find(query)
      .sort({ mmr: -1 })
      .limit(Math.min(limit, 100))
      .lean()
      .exec();

    return users.map((u, i) => ({
      rank: i + 1,
      _id: u._id,
      displayName: u.displayName,
      username: u.username,
      country: u.country,
      avatarColor: u.avatarColor,
      mmr: u.mmr,
      peakMmr: u.peakMmr,
      wins: u.wins,
      losses: u.losses,
      streak: u.streak,
      recentResults: u.recentResults,
      role: u.role,
      tier: tierFor(u.mmr),
    }));
  }

  async getUserRank(userId: string): Promise<number> {
    const user = await UserModel.findById(userId).lean().exec();
    if (!user) return -1;
    const ahead = await UserModel.countDocuments({ role: 'player', mmr: { $gt: user.mmr } }).exec();
    return ahead + 1;
  }
}

export const leaderboardService = new LeaderboardService();
