import bcrypt from 'bcrypt';
import { env } from '../../config/env.js';
import { UserNotFoundError, DuplicateUsernameError, DuplicateEmailError } from './user.errors.js';
import { UserRepository, isDuplicateKeyError } from './user.repository.js';
import type { IUser } from './user.model.js';
import type { CreateUserInput, UpdateUserInput, UserFilter, UserPublic, UserSortBy } from './user.types.js';
import type { PaginationQuery, PaginationResult } from '../../shared/pagination.js';
import type { ApplyGameResultInput } from './user.repository.js';

/**
 * Удаляет `passwordHash` из объекта пользователя перед отдачей наружу.
 * Преобразует внутренний документ в публичный формат для API.
 */
function toPublicUser(user: IUser): UserPublic {
  const { passwordHash: _removed, ...rest } = user;
  return rest;
}

/**
 * Сервис пользователей.
 * Содержит бизнес-логику: хэширование паролей, валидация, маппинг ошибок MongoDB в доменные ошибки.
 */
export class UserService {
  constructor(private readonly repo: UserRepository) {}

  /** Создаёт пользователя, хэшируя пароль перед сохранением. */
  async create(input: CreateUserInput): Promise<UserPublic> {
    const passwordHash = await bcrypt.hash(input.password, env.bcryptRounds);

    try {
      const user = await this.repo.create({
        displayName: input.displayName,
        username: input.username,
        email: input.email,
        passwordHash,
        ...(input.country !== undefined ? { country: input.country } : {}),
        avatarColor: input.avatarColor ?? 0,
        mmr: 1000,
        peakMmr: 1000,
        wins: 0,
        losses: 0,
        streak: 0,
        recentResults: '',
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

  /** Проверяет пароль пользователя. Используется при аутентификации. */
  async verifyPassword(user: { passwordHash: string }, password: string): Promise<boolean> {
    return bcrypt.compare(password, user.passwordHash);
  }

  async findById(id: string): Promise<UserPublic | null> {
    const user = await this.repo.findById(id);
    return user ? toPublicUser(user) : null;
  }

  async findByUsername(username: string): Promise<UserPublic | null> {
    const user = await this.repo.findByUsername(username);
    return user ? toPublicUser(user) : null;
  }

  /** Возвращает полный документ пользователя с `passwordHash` — только для внутренней аутентификации. */
  async findByEmail(email: string): Promise<IUser | null> {
    return this.repo.findByEmail(email);
  }

  async findAll(
    filter: UserFilter,
    page: PaginationQuery,
    sortBy?: UserSortBy,
  ): Promise<PaginationResult<UserPublic>> {
    const result = await this.repo.findAll(filter, page, sortBy);
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

  /** Изменяет MMR пользователя на `delta`. Вызывается из `GameService` после завершения игры. */
  async updateMmr(id: string, delta: number): Promise<UserPublic> {
    const user = await this.repo.incrementMmr(id, delta);
    if (!user) throw new UserNotFoundError(id);
    return toPublicUser(user);
  }

  /** Атомарно применяет результат игры (mmr, wins/losses, streak, peak, recent). */
  async applyGameResult(id: string, input: ApplyGameResultInput): Promise<UserPublic> {
    const user = await this.repo.applyGameResult(id, input);
    if (!user) throw new UserNotFoundError(id);
    return toPublicUser(user);
  }
}
