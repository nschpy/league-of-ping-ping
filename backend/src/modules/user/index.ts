import { UserRepository } from './user.repository.js';
import { UserService } from './user.service.js';

const repository = new UserRepository();

/** Экземпляр сервиса пользователей (singleton) */
export const userService = new UserService(repository);

export { UserService };
export type { IUser, UserRole } from './user.model.js';
export type { UserPublic, CreateUserInput, UpdateUserInput, UserFilter, UserSortBy } from './user.types.js';
export type { ApplyGameResultInput } from './user.repository.js';
export { UserNotFoundError, DuplicateUsernameError, DuplicateEmailError } from './user.errors.js';
