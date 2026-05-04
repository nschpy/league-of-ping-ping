import { Types } from 'mongoose';
import { ValidationError } from './errors.js';

export function toObjectId(id: string): Types.ObjectId {
  if (!Types.ObjectId.isValid(id)) {
    throw new ValidationError(`Invalid ID format: ${id}`);
  }
  return new Types.ObjectId(id);
}
