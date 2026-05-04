import { ConflictError, NotFoundError } from '../../shared/errors.js';

export class UserNotFoundError extends NotFoundError {
  constructor(identifier: string) {
    super(`User not found: ${identifier}`);
  }
}

export class DuplicateUsernameError extends ConflictError {
  constructor(username: string) {
    super(`Username already exists: ${username}`);
  }
}

export class DuplicateEmailError extends ConflictError {
  constructor(email: string) {
    super(`Email already exists: ${email}`);
  }
}
