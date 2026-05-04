import type { FastifyInstance } from 'fastify';
import type { UserService } from '../user/user.service.js';
import type { SignUpInput, SignInInput, AuthResponse } from './auth.types.js';
import { InvalidCredentialsError } from './auth.errors.js';

export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly fastify: FastifyInstance,
  ) {}

  async signUp(input: SignUpInput): Promise<AuthResponse> {
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

  async signIn(input: SignInInput): Promise<AuthResponse> {
    const userDoc = await this.userService.findByEmail(input.email);
    if (!userDoc) throw new InvalidCredentialsError();

    const valid = await this.userService.verifyPassword(userDoc, input.password);
    if (!valid) throw new InvalidCredentialsError();

    const token = this.fastify.jwt.sign({ sub: userDoc._id.toString(), role: userDoc.role });

    const { passwordHash: _removed, ...user } = userDoc;
    return { token, user };
  }
}
