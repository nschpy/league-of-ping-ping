import bcrypt from 'bcrypt';
import { env } from '../../config/env.js';
import { UserNotFoundError, DuplicateUsernameError, DuplicateEmailError } from './user.errors.js';
import { UserRepository, isDuplicateKeyError } from './user.repository.js';
/**
 * Удаляет `passwordHash` из объекта пользователя перед отдачей наружу.
 * Преобразует внутренний документ в публичный формат для API.
 */
function toPublicUser(user) {
    const { passwordHash: _removed, ...rest } = user;
    return rest;
}
/**
 * Сервис пользователей.
 * Содержит бизнес-логику: хэширование паролей, валидация, маппинг ошибок MongoDB в доменные ошибки.
 */
export class UserService {
    repo;
    constructor(repo) {
        this.repo = repo;
    }
    /** Создаёт пользователя, хэшируя пароль перед сохранением. */
    async create(input) {
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
        }
        catch (err) {
            if (isDuplicateKeyError(err)) {
                if ('username' in err.keyPattern)
                    throw new DuplicateUsernameError(input.username);
                throw new DuplicateEmailError(input.email);
            }
            throw err;
        }
    }
    /** Проверяет пароль пользователя. Используется при аутентификации. */
    async verifyPassword(user, password) {
        return bcrypt.compare(password, user.passwordHash);
    }
    async findById(id) {
        const user = await this.repo.findById(id);
        return user ? toPublicUser(user) : null;
    }
    async findByUsername(username) {
        const user = await this.repo.findByUsername(username);
        return user ? toPublicUser(user) : null;
    }
    /** Возвращает полный документ пользователя с `passwordHash` — только для внутренней аутентификации. */
    async findByEmail(email) {
        return this.repo.findByEmail(email);
    }
    async findAll(filter, page, sortBy) {
        const result = await this.repo.findAll(filter, page, sortBy);
        return {
            ...result,
            data: result.data.map(toPublicUser),
        };
    }
    async update(id, patch) {
        try {
            const user = await this.repo.updateOne(id, patch);
            if (!user)
                throw new UserNotFoundError(id);
            return toPublicUser(user);
        }
        catch (err) {
            if (isDuplicateKeyError(err)) {
                if ('username' in err.keyPattern && patch.username !== undefined) {
                    throw new DuplicateUsernameError(patch.username);
                }
                if (patch.email !== undefined)
                    throw new DuplicateEmailError(patch.email);
            }
            throw err;
        }
    }
    async delete(id) {
        const user = await this.repo.findById(id);
        if (!user)
            throw new UserNotFoundError(id);
        await this.repo.deleteOne(id);
    }
    /** Изменяет MMR пользователя на `delta`. Вызывается из `GameService` после завершения игры. */
    async updateMmr(id, delta) {
        const user = await this.repo.incrementMmr(id, delta);
        if (!user)
            throw new UserNotFoundError(id);
        return toPublicUser(user);
    }
    /** Атомарно применяет результат игры (mmr, wins/losses, streak, peak, recent). */
    async applyGameResult(id, input) {
        const user = await this.repo.applyGameResult(id, input);
        if (!user)
            throw new UserNotFoundError(id);
        return toPublicUser(user);
    }
}
//# sourceMappingURL=user.service.js.map