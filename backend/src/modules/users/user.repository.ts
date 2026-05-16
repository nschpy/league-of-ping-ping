import type { IUser } from '../../core/models/User.js'
import { UserModel } from '../../core/models/User.js'

export const UserRepository = {
  findById(id: string): Promise<IUser | null> {
    return UserModel.findById(id).lean<IUser>()
  },

  /**
   * Find users whose mmr is within [centerMmr - range, centerMmr + range],
   * excluding the user with excludeId. Sorted by abs(mmr - centerMmr) ascending,
   * then nickname ascending. Returns at most `limit` documents.
   */
  async findByMmrWindow(
    centerMmr: number,
    range: number,
    excludeId: string,
    limit: number,
  ): Promise<IUser[]> {
    const candidates = await UserModel.find(
      {
        _id: { $ne: excludeId },
        mmr: { $gte: centerMmr - range, $lte: centerMmr + range },
      },
      'nickname mmr',
    ).lean<IUser[]>()

    // Sort in JS: abs diff ascending, then nickname ascending
    candidates.sort((a, b) => {
      const diffA = Math.abs(a.mmr - centerMmr)
      const diffB = Math.abs(b.mmr - centerMmr)
      if (diffA !== diffB) return diffA - diffB
      return a.nickname.localeCompare(b.nickname)
    })

    return candidates.slice(0, limit)
  },

  findTopByMmr(limit: number): Promise<IUser[]> {
    return UserModel.find({}, 'nickname mmr').sort({ mmr: -1 }).limit(limit).lean<IUser[]>()
  },

  countWithHigherMmr(mmr: number, excludeId: string): Promise<number> {
    return UserModel.countDocuments({ _id: { $ne: excludeId }, mmr: { $gt: mmr } })
  },

  findByNickname(nickname: string, excludeId: string): Promise<IUser | null> {
    const escaped = nickname.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    return UserModel.findOne(
      { nickname: { $regex: `^${escaped}$`, $options: 'i' }, _id: { $ne: excludeId } },
    ).lean<IUser>()
  },
}
