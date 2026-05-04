import { Types } from 'mongoose';
import { GameModel } from './game.model.js';
import type { IGame, ISet, GameFormat } from './game.model.js';
import type { GameFilter } from './game.types.js';
import { buildPagination } from '../../shared/pagination.js';
import type { PaginationQuery, PaginationResult } from '../../shared/pagination.js';

/** Тип документа для создания игры (без системных полей) */
type CreateGameDoc = Omit<IGame, '_id' | 'createdAt' | 'updatedAt'>;

/**
 * Репозиторий игр.
 * Слой доступа к данным для коллекции `games`. Работает напрямую с Mongoose.
 */
export class GameRepository {
  async create(data: CreateGameDoc): Promise<IGame> {
    const doc = await GameModel.create(data);
    return doc.toObject() as IGame;
  }

  async findById(id: string | Types.ObjectId): Promise<IGame | null> {
    const doc = await GameModel.findById(id).lean().exec();
    return doc as IGame | null;
  }

  async findAll(filter: GameFilter, page: PaginationQuery): Promise<PaginationResult<IGame>> {
    const query: Record<string, unknown> = {};
    if (filter.status !== undefined) query['status'] = filter.status;
    if (filter.refereeId !== undefined) query['refereeId'] = new Types.ObjectId(filter.refereeId);
    if (filter.playerId !== undefined) {
      const pid = new Types.ObjectId(filter.playerId);
      query['$or'] = [{ player1Id: pid }, { player2Id: pid }];
    }
    if (filter.scheduledFrom !== undefined || filter.scheduledTo !== undefined) {
      const range: Record<string, Date> = {};
      if (filter.scheduledFrom) range['$gte'] = filter.scheduledFrom;
      if (filter.scheduledTo) range['$lte'] = filter.scheduledTo;
      query['scheduledAt'] = range;
    }

    const { skip, limit, page: pageNum } = buildPagination(page);

    const [data, total] = await Promise.all([
      GameModel.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).lean().exec(),
      GameModel.countDocuments(query).exec(),
    ]);

    return {
      data: data as IGame[],
      total,
      page: pageNum,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async updateStatus(
    id: Types.ObjectId,
    status: 'in_progress' | 'completed' | 'cancelled',
    extra: Record<string, unknown> = {},
  ): Promise<IGame | null> {
    const doc = await GameModel.findByIdAndUpdate(
      id,
      { $set: { status, ...extra } },
      { new: true },
    ).lean().exec();
    return doc as IGame | null;
  }

  async pushSet(
    gameId: Types.ObjectId,
    set: ISet,
    expectedSetsLength: number,
  ): Promise<IGame | null> {
    const doc = await GameModel.findOneAndUpdate(
      {
        _id: gameId,
        status: 'in_progress',
        $expr: { $eq: [{ $size: '$sets' }, expectedSetsLength] },
      },
      { $push: { sets: set } },
      { new: true },
    ).lean().exec();
    return doc as IGame | null;
  }

  async pushSetAndComplete(
    gameId: Types.ObjectId,
    set: ISet,
    expectedSetsLength: number,
    winnerId: Types.ObjectId,
    mmr?: {
      player1MmrBefore: number;
      player2MmrBefore: number;
      player1MmrChange: number;
      player2MmrChange: number;
    },
  ): Promise<IGame | null> {
    const doc = await GameModel.findOneAndUpdate(
      {
        _id: gameId,
        status: 'in_progress',
        $expr: { $eq: [{ $size: '$sets' }, expectedSetsLength] },
      },
      {
        $push: { sets: set },
        $set: {
          status: 'completed',
          winnerId,
          completedAt: new Date(),
          ...(mmr ?? {}),
        },
      },
      { new: true },
    ).lean().exec();
    return doc as IGame | null;
  }

  async deleteOne(id: string | Types.ObjectId): Promise<void> {
    await GameModel.findByIdAndDelete(id).exec();
  }
}

export type { CreateGameDoc, GameFormat };
