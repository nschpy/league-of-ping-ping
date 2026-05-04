import type { FastifyInstance } from 'fastify';
import type { UserService } from '../user/user.service.js';
import type { SignUpInput, SignInInput, AuthResponse } from './auth.types.js';
export declare class AuthService {
    private readonly userService;
    private readonly fastify;
    constructor(userService: UserService, fastify: FastifyInstance);
    signUp(input: SignUpInput): Promise<AuthResponse>;
    signIn(input: SignInInput): Promise<AuthResponse>;
}
//# sourceMappingURL=auth.service.d.ts.map