import { Types } from 'mongoose';
/**
 * Конвертирует строковый идентификатор в MongoDB ObjectId.
 * @param id - Строковое представление ObjectId
 * @returns Types.ObjectId
 * @throws {ValidationError} если строка не является валидным ObjectId
 *
 * @example
 * const objectId = toObjectId('507f1f77bcf86cd799439011');
 */
export declare function toObjectId(id: string): Types.ObjectId;
//# sourceMappingURL=ids.d.ts.map