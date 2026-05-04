import { UnauthorizedError } from '../../shared/errors.js';
export class InvalidCredentialsError extends UnauthorizedError {
    constructor() {
        super('Invalid email or password');
    }
}
//# sourceMappingURL=auth.errors.js.map