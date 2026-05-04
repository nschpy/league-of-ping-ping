import { Types, type SortOrder } from 'mongoose';
import { UserModel } from './user.model.js';
import type { IUser } from './user.model.js';
import type { UpdateUserInput, UserFilter, UserSortBy } from './user.types.js';
import { buildPagination } from '../../shared/pagination.js';
import type { PaginationQuery, PaginationResult } from '../../shared/pagination.js';

/** Тип документа для создания пользователя (без системных полей) */
type CreateUserDoc = Omit<IUser, '_id' | 'createdAt' | 'updatedAt'>;

export interface ApplyGameResultInput {
  mmrDelta: number;
  won: boolean;
}

/**
 * Проверяет, является ли ошибка MongoDB ошибкой дублирования уникального ключа (код E11000).
 * @param err - Объект ошибки
 * @returns true если это ошибка дублирования ключа
 */
function isDuplicateKeyError(err: unknown): err is Error & { code: number; keyPattern: Record<string, unknown> } {
  return (
    err instanceof Error &&
    'code' in err &&
    (err as { code: unknown }).code === 11000 &&
    'keyPattern' in err
  );
}

export { isDuplicateKeyError };

/**
 * Репозиторий пользователей.
 * Слой доступа к данным для коллекции `users`. Работает напрямую с Mongoose.
 */
export class UserRepository {
  async create(data: CreateUserDoc): Promise<IUser> {
    const doc = await UserModel.create(data);
    return doc.toObject() as IUser;
  }

  async findById(id: string | Types.ObjectId): Promise<IUser | null> {
    const doc = await UserModel.findById(id).lean().exec();
    return doc as IUser | null;
  }

  async findByUsername(username: string): Promise<IUser | null> {
    const doc = await UserModel.findOne({ username }).lean().exec();
    return doc as IUser | null;
  }

  async findByEmail(email: string): Promise<IUser | null> {
    const doc = await UserModel.findOne({ email }).lean().exec();
    return doc as IUser | null;
  }

  async findAll(
    filter: UserFilter,
    page: PaginationQuery,
    sortBy: UserSortBy = 'mmr',
  ): Promise<PaginationResult<IUser>> {
    const query: Record<string, unknown> = {};
    if (filter.role !== undefined) query['role'] = filter.role;
    if (filter.search) {
      const re = new RegExp(filter.search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
      query['$or'] = [{ displayName: re }, { username: re }, { country: re }];
    }
    if (filter.tier) {
      const TIER_MMR: Record<string, [number, number]> = {
        Bronze: [0, 999],
        Silver: [1000, 1199],
        Gold: [1200, 1399],
        Platinum: [1400, 1599],
        Diamond: [1600, 1799],
        Master: [1800, Infinity],
      };
      const range = TIER_MMR[filter.tier];
      if (range) {
        query['mmr'] = { $gte: range[0], ...(range[1] !== Infinity ? { $lte: range[1] } : {}) };
      }
    }

    const SORT_MAP: Record<UserSortBy, Record<string, SortOrder>> = {
      mmr: { mmr: -1 },
      name: { displayName: 1 },
      streak: { streak: -1 },
      wr: { wins: -1 },
    };
    const sort = SORT_MAP[sortBy] ?? { mmr: -1 };

    const { skip, limit, page: pageNum } = buildPagination(page);

    const [data, total] = await Promise.all([
      UserModel.find(query).sort(sort).skip(skip).limit(limit).lean().exec(),
      UserModel.countDocuments(query).exec(),
    ]);

    return {
      data: data as IUser[],
      total,
      page: pageNum,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async updateOne(id: string | Types.ObjectId, patch: UpdateUserInput): Promise<IUser | null> {
    const $set: Record<string, unknown> = {};
    if (patch.displayName !== undefined) $set['displayName'] = patch.displayName;
    if (patch.username !== undefined) $set['username'] = patch.username;
    if (patch.email !== undefined) $set['email'] = patch.email;
    if (patch.country !== undefined) $set['country'] = patch.country;
    if (patch.bio !== undefined) $set['bio'] = patch.bio;
    if (patch.avatarColor !== undefined) $set['avatarColor'] = patch.avatarColor;

    const doc = await UserModel.findByIdAndUpdate(id, { $set }, { new: true }).lean().exec();
    return doc as IUser | null;
  }

  /**
   * Атомарно применяет результат игры: обновляет mmr, peakMmr, wins/losses, streak, recentResults.
   * Использует aggregation pipeline update (Mongoose 8 / MongoDB 4.2+).
   */
  async applyGameResult(
    id: string | Types.ObjectId,
    { mmrDelta, won }: ApplyGameResultInput,
  ): Promise<IUser | null> {
    const resultChar = won ? 'W' : 'L';
    const doc = await UserModel.findByIdAndUpdate(
      id,
      [
        {
          $set: {
            mmr: { $add: ['$mmr', mmrDelta] },
            wins: { $add: ['$wins', won ? 1 : 0] },
            losses: { $add: ['$losses', won ? 0 : 1] },
            peakMmr: { $max: ['$peakMmr', { $add: ['$mmr', mmrDelta] }] },
            streak: {
              $cond: [
                won,
                {
                  $cond: [
                    { $gte: ['$streak', 0] },
                    { $add: ['$streak', 1] },
                    1,
                  ],
                },
                {
                  $cond: [
                    { $lte: ['$streak', 0] },
                    { $subtract: ['$streak', 1] },
                    -1,
                  ],
                },
              ],
            },
            recentResults: {
              $substrCP: [
                { $concat: [resultChar, '$recentResults'] },
                0,
                6,
              ],
            },
          },
        },
      ],
      { new: true },
    ).lean().exec();
    return doc as IUser | null;
  }

  async deleteOne(id: string | Types.ObjectId): Promise<void> {
    await UserModel.findByIdAndDelete(id).exec();
  }

  /** Атомарно изменяет MMR пользователя на `delta` (может быть отрицательным). */
  async incrementMmr(id: string | Types.ObjectId, delta: number): Promise<IUser | null> {
    const doc = await UserModel.findByIdAndUpdate(
      id,
      { $inc: { mmr: delta } },
      { new: true },
    ).lean().exec();
    return doc as IUser | null;
  }
}
