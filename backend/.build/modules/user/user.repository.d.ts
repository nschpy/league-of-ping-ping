import { Types } from 'mongoose';
import type { IUser } from './user.model.js';
import type { UpdateUserInput, UserFilter, UserSortBy } from './user.types.js';
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
declare function isDuplicateKeyError(err: unknown): err is Error & {
    code: number;
    keyPattern: Record<string, unknown>;
};
export { isDuplicateKeyError };
/**
 * Репозиторий пользователей.
 * Слой доступа к данным для коллекции `users`. Работает напрямую с Mongoose.
 */
export declare class UserRepository {
    create(data: CreateUserDoc): Promise<IUser>;
    findById(id: string | Types.ObjectId): Promise<IUser | null>;
    findByUsername(username: string): Promise<IUser | null>;
    findByEmail(email: string): Promise<IUser | null>;
    findAll(filter: UserFilter, page: PaginationQuery, sortBy?: UserSortBy): Promise<PaginationResult<IUser>>;
    updateOne(id: string | Types.ObjectId, patch: UpdateUserInput): Promise<IUser | null>;
    /**
     * Атомарно применяет результат игры: обновляет mmr, peakMmr, wins/losses, streak, recentResults.
     * Использует aggregation pipeline update (Mongoose 8 / MongoDB 4.2+).
     */
    applyGameResult(id: string | Types.ObjectId, { mmrDelta, won }: ApplyGameResultInput): Promise<IUser | null>;
    deleteOne(id: string | Types.ObjectId): Promise<void>;
    /** Атомарно изменяет MMR пользователя на `delta` (может быть отрицательным). */
    incrementMmr(id: string | Types.ObjectId, delta: number): Promise<IUser | null>;
}
//# sourceMappingURL=user.repository.d.ts.map