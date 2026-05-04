import { UserRepository } from './user.repository.js';
import { UserService } from './user.service.js';

const repository = new UserRepository();
export const userService = new UserService(repository);

export { UserService };
export type { IUser, UserRole } from './user.model.js';
export type { UserPublic, CreateUserInput, UpdateUserInput, UserFilter } from './user.types.js';
export { UserNotFoundError, DuplicateUsernameError, DuplicateEmailError } from './user.errors.js';
