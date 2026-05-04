import { UserRepository } from './user.repository.js';
import type { IUser } from './user.model.js';
import type { CreateUserInput, UpdateUserInput, UserFilter, UserPublic, UserSortBy } from './user.types.js';
import type { PaginationQuery, PaginationResult } from '../../shared/pagination.js';
import type { ApplyGameResultInput } from './user.repository.js';
/**
 * Сервис пользователей.
 * Содержит бизнес-логику: хэширование паролей, валидация, маппинг ошибок MongoDB в доменные ошибки.
 */
export declare class UserService {
    private readonly repo;
    constructor(repo: UserRepository);
    /** Создаёт пользователя, хэшируя пароль перед сохранением. */
    create(input: CreateUserInput): Promise<UserPublic>;
    /** Проверяет пароль пользователя. Используется при аутентификации. */
    verifyPassword(user: {
        passwordHash: string;
    }, password: string): Promise<boolean>;
    findById(id: string): Promise<UserPublic | null>;
    findByUsername(username: string): Promise<UserPublic | null>;
    /** Возвращает полный документ пользователя с `passwordHash` — только для внутренней аутентификации. */
    findByEmail(email: string): Promise<IUser | null>;
    findAll(filter: UserFilter, page: PaginationQuery, sortBy?: UserSortBy): Promise<PaginationResult<UserPublic>>;
    update(id: string, patch: UpdateUserInput): Promise<UserPublic>;
    delete(id: string): Promise<void>;
    /** Изменяет MMR пользователя на `delta`. Вызывается из `GameService` после завершения игры. */
    updateMmr(id: string, delta: number): Promise<UserPublic>;
    /** Атомарно применяет результат игры (mmr, wins/losses, streak, peak, recent). */
    applyGameResult(id: string, input: ApplyGameResultInput): Promise<UserPublic>;
}
//# sourceMappingURL=user.service.d.ts.map