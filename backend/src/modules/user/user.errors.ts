import { ConflictError, NotFoundError } from '../../shared/errors.js';

/** Ошибка: пользователь не найден по указанному идентификатору */
export class UserNotFoundError extends NotFoundError {
  constructor(identifier: string) {
    super(`User not found: ${identifier}`);
  }
}

/** Ошибка: попытка зарегистрировать уже существующий username */
export class DuplicateUsernameError extends ConflictError {
  constructor(username: string) {
    super(`Username already exists: ${username}`);
  }
}

/** Ошибка: попытка зарегистрировать уже существующий email */
export class DuplicateEmailError extends ConflictError {
  constructor(email: string) {
    super(`Email already exists: ${email}`);
  }
}
