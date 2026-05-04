import { UserService } from './user.service.js';
/** Экземпляр сервиса пользователей (singleton) */
export declare const userService: UserService;
export { UserService };
export type { IUser, UserRole } from './user.model.js';
export type { UserPublic, CreateUserInput, UpdateUserInput, UserFilter, UserSortBy } from './user.types.js';
export type { ApplyGameResultInput } from './user.repository.js';
export { UserNotFoundError, DuplicateUsernameError, DuplicateEmailError } from './user.errors.js';
//# sourceMappingURL=index.d.ts.map