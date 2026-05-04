import { Types } from 'mongoose';
import { UserModel } from './user.model.js';
import type { IUser } from './user.model.js';
import type { UpdateUserInput, UserFilter } from './user.types.js';
import { buildPagination } from '../../shared/pagination.js';
import type { PaginationQuery, PaginationResult } from '../../shared/pagination.js';

type CreateUserDoc = Omit<IUser, '_id' | 'createdAt' | 'updatedAt'>;

function isDuplicateKeyError(err: unknown): err is Error & { code: number; keyPattern: Record<string, unknown> } {
  return (
    err instanceof Error &&
    'code' in err &&
    (err as { code: unknown }).code === 11000 &&
    'keyPattern' in err
  );
}

export { isDuplicateKeyError };

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

  async findAll(filter: UserFilter, page: PaginationQuery): Promise<PaginationResult<IUser>> {
    const query: Record<string, unknown> = {};
    if (filter.role !== undefined) query['role'] = filter.role;

    const { skip, limit, page: pageNum } = buildPagination(page);

    const [data, total] = await Promise.all([
      UserModel.find(query).sort({ mmr: -1 }).skip(skip).limit(limit).lean().exec(),
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
    const $set: Record<string, string> = {};
    if (patch.username !== undefined) $set['username'] = patch.username;
    if (patch.email !== undefined) $set['email'] = patch.email;

    const doc = await UserModel.findByIdAndUpdate(id, { $set }, { new: true }).lean().exec();
    return doc as IUser | null;
  }

  async deleteOne(id: string | Types.ObjectId): Promise<void> {
    await UserModel.findByIdAndDelete(id).exec();
  }

  async incrementMmr(id: string | Types.ObjectId, delta: number): Promise<IUser | null> {
    const doc = await UserModel.findByIdAndUpdate(
      id,
      { $inc: { mmr: delta } },
      { new: true },
    ).lean().exec();
    return doc as IUser | null;
  }
}
