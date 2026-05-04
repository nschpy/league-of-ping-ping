import { ConflictError, NotFoundError } from '../../shared/errors.js';
/** Ошибка: пользователь не найден по указанному идентификатору */
export declare class UserNotFoundError extends NotFoundError {
    constructor(identifier: string);
}
/** Ошибка: попытка зарегистрировать уже существующий username */
export declare class DuplicateUsernameError extends ConflictError {
    constructor(username: string);
}
/** Ошибка: попытка зарегистрировать уже существующий email */
export declare class DuplicateEmailError extends ConflictError {
    constructor(email: string);
}
//# sourceMappingURL=user.errors.d.ts.map