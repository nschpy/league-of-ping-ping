import { ConflictError, NotFoundError } from '../../shared/errors.js';
/** Ошибка: пользователь не найден по указанному идентификатору */
export class UserNotFoundError extends NotFoundError {
    constructor(identifier) {
        super(`User not found: ${identifier}`);
    }
}
/** Ошибка: попытка зарегистрировать уже существующий username */
export class DuplicateUsernameError extends ConflictError {
    constructor(username) {
        super(`Username already exists: ${username}`);
    }
}
/** Ошибка: попытка зарегистрировать уже существующий email */
export class DuplicateEmailError extends ConflictError {
    constructor(email) {
        super(`Email already exists: ${email}`);
    }
}
//# sourceMappingURL=user.errors.js.map