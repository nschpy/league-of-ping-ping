import bcrypt from 'bcrypt';
import { env } from '../../config/env.js';
import { UserNotFoundError, DuplicateUsernameError, DuplicateEmailError } from './user.errors.js';
import { UserRepository, isDuplicateKeyError } from './user.repository.js';
import type { IUser } from './user.model.js';
import type { CreateUserInput, UpdateUserInput, UserFilter, UserPublic } from './user.types.js';
import type { PaginationQuery, PaginationResult } from '../../shared/pagination.js';

function toPublicUser(user: IUser): UserPublic {
  const { passwordHash: _removed, ...rest } = user;
  return rest;
}

export class UserService {
  constructor(private readonly repo: UserRepository) {}

  async create(input: CreateUserInput): Promise<UserPublic> {
    const passwordHash = await bcrypt.hash(input.password, env.bcryptRounds);

    try {
      const user = await this.repo.create({
        username: input.username,
        email: input.email,
        passwordHash,
        mmr: 1000,
        role: input.role ?? 'player',
      });
      return toPublicUser(user);
    } catch (err) {
      if (isDuplicateKeyError(err)) {
        if ('username' in err.keyPattern) throw new DuplicateUsernameError(input.username);
        throw new DuplicateEmailError(input.email);
      }
      throw err;
    }
  }

  async findById(id: string): Promise<UserPublic | null> {
    const user = await this.repo.findById(id);
    return user ? toPublicUser(user) : null;
  }

  async findByUsername(username: string): Promise<UserPublic | null> {
    const user = await this.repo.findByUsername(username);
    return user ? toPublicUser(user) : null;
  }

  async findByEmail(email: string): Promise<IUser | null> {
    return this.repo.findByEmail(email);
  }

  async findAll(filter: UserFilter, page: PaginationQuery): Promise<PaginationResult<UserPublic>> {
    const result = await this.repo.findAll(filter, page);
    return {
      ...result,
      data: result.data.map(toPublicUser),
    };
  }

  async update(id: string, patch: UpdateUserInput): Promise<UserPublic> {
    try {
      const user = await this.repo.updateOne(id, patch);
      if (!user) throw new UserNotFoundError(id);
      return toPublicUser(user);
    } catch (err) {
      if (isDuplicateKeyError(err)) {
        if ('username' in err.keyPattern && patch.username !== undefined) {
          throw new DuplicateUsernameError(patch.username);
        }
        if (patch.email !== undefined) throw new DuplicateEmailError(patch.email);
      }
      throw err;
    }
  }

  async delete(id: string): Promise<void> {
    const user = await this.repo.findById(id);
    if (!user) throw new UserNotFoundError(id);
    await this.repo.deleteOne(id);
  }

  async updateMmr(id: string, delta: number): Promise<UserPublic> {
    const user = await this.repo.incrementMmr(id, delta);
    if (!user) throw new UserNotFoundError(id);
    return toPublicUser(user);
  }
}
