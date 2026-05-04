import { Types } from 'mongoose';
import { ValidationError } from './errors.js';
/**
 * Конвертирует строковый идентификатор в MongoDB ObjectId.
 * @param id - Строковое представление ObjectId
 * @returns Types.ObjectId
 * @throws {ValidationError} если строка не является валидным ObjectId
 *
 * @example
 * const objectId = toObjectId('507f1f77bcf86cd799439011');
 */
export function toObjectId(id) {
    if (!Types.ObjectId.isValid(id)) {
        throw new ValidationError(`Invalid ID format: ${id}`);
    }
    return new Types.ObjectId(id);
}
//# sourceMappingURL=ids.js.map