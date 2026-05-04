import { InvalidCredentialsError } from './auth.errors.js';
export class AuthService {
    userService;
    fastify;
    constructor(userService, fastify) {
        this.userService = userService;
        this.fastify = fastify;
    }
    async signUp(input) {
        const user = await this.userService.create({
            displayName: input.displayName,
            username: input.username,
            email: input.email,
            password: input.password,
            ...(input.country !== undefined ? { country: input.country } : {}),
            ...(input.avatarColor !== undefined ? { avatarColor: input.avatarColor } : {}),
            role: input.role ?? 'player',
        });
        const token = this.fastify.jwt.sign({ sub: user._id.toString(), role: user.role });
        return { token, user };
    }
    async signIn(input) {
        const userDoc = await this.userService.findByEmail(input.email);
        if (!userDoc)
            throw new InvalidCredentialsError();
        const valid = await this.userService.verifyPassword(userDoc, input.password);
        if (!valid)
            throw new InvalidCredentialsError();
        const token = this.fastify.jwt.sign({ sub: userDoc._id.toString(), role: userDoc.role });
        const { passwordHash: _removed, ...user } = userDoc;
        return { token, user };
    }
}
//# sourceMappingURL=auth.service.js.map