import type { FastifyPluginAsync } from 'fastify';
import { AuthService } from './auth.service.js';
import { userService } from '../user/index.js';

const signUpSchema = {
  tags: ['Auth'],
  summary: 'Register a new user',
  body: {
    type: 'object',
    required: ['displayName', 'username', 'email', 'password'],
    properties: {
      displayName: { type: 'string', minLength: 1, maxLength: 60 },
      username: { type: 'string', minLength: 3, maxLength: 30, pattern: '^[a-zA-Z0-9_-]+$' },
      email: { type: 'string', format: 'email' },
      password: { type: 'string', minLength: 6 },
      country: { type: 'string', pattern: '^[A-Za-z]{2}$' },
      avatarColor: { type: 'integer', minimum: 0, maximum: 5 },
      role: { type: 'string', enum: ['player', 'referee', 'admin'] },
    },
    additionalProperties: false,
  },
};

const signInSchema = {
  tags: ['Auth'],
  summary: 'Sign in',
  body: {
    type: 'object',
    required: ['email', 'password'],
    properties: {
      email: { type: 'string', format: 'email' },
      password: { type: 'string' },
    },
    additionalProperties: false,
  },
};

const authRoutes: FastifyPluginAsync = async (fastify) => {
  const authService = new AuthService(userService, fastify);

  fastify.post('/signup', { schema: signUpSchema }, async (request, reply) => {
    const body = request.body as Parameters<AuthService['signUp']>[0];
    const result = await authService.signUp(body);
    return reply.status(201).send(result);
  });

  fastify.post('/signin', { schema: signInSchema }, async (request, reply) => {
    const body = request.body as Parameters<AuthService['signIn']>[0];
    const result = await authService.signIn(body);
    return reply.send(result);
  });

  fastify.get(
    '/me',
    { schema: { tags: ['Auth'], summary: 'Current user', security: [{ bearerAuth: [] }] }, preHandler: fastify.authenticate },
    async (request, reply) => {
      const user = await userService.findById(request.user.sub);
      if (!user) return reply.status(404).send({ error: 'NotFound', message: 'User not found', statusCode: 404 });
      return reply.send(user);
    },
  );
};

export default authRoutes;
