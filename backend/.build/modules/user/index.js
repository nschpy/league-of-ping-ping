import { UserRepository } from './user.repository.js';
import { UserService } from './user.service.js';
const repository = new UserRepository();
/** Экземпляр сервиса пользователей (singleton) */
export const userService = new UserService(repository);
export { UserService };
export { UserNotFoundError, DuplicateUsernameError, DuplicateEmailError } from './user.errors.js';
//# sourceMappingURL=index.js.map