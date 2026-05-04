import { Types } from 'mongoose';
import type { IGame, ISet, GameFormat } from './game.model.js';
import type { GameFilter } from './game.types.js';
import type { PaginationQuery, PaginationResult } from '../../shared/pagination.js';
/** Тип документа для создания игры (без системных полей) */
type CreateGameDoc = Omit<IGame, '_id' | 'createdAt' | 'updatedAt'>;
/**
 * Репозиторий игр.
 * Слой доступа к данным для коллекции `games`. Работает напрямую с Mongoose.
 */
export declare class GameRepository {
    create(data: CreateGameDoc): Promise<IGame>;
    findById(id: string | Types.ObjectId): Promise<IGame | null>;
    findAll(filter: GameFilter, page: PaginationQuery): Promise<PaginationResult<IGame>>;
    updateStatus(id: Types.ObjectId, status: 'in_progress' | 'completed' | 'cancelled', extra?: Record<string, unknown>): Promise<IGame | null>;
    pushSet(gameId: Types.ObjectId, set: ISet, expectedSetsLength: number): Promise<IGame | null>;
    pushSetAndComplete(gameId: Types.ObjectId, set: ISet, expectedSetsLength: number, winnerId: Types.ObjectId, mmr?: {
        player1MmrBefore: number;
        player2MmrBefore: number;
        player1MmrChange: number;
        player2MmrChange: number;
    }): Promise<IGame | null>;
    deleteOne(id: string | Types.ObjectId): Promise<void>;
}
export type { CreateGameDoc, GameFormat };
//# sourceMappingURL=game.repository.d.ts.map