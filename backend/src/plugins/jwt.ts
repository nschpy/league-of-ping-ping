import type { FastifyPluginAsync, FastifyRequest, FastifyReply } from 'fastify';
import fp from 'fastify-plugin';
import fastifyJwt from '@fastify/jwt';
import { env } from '../config/env.js';
import { UnauthorizedError, ForbiddenError } from '../shared/errors.js';

export interface JwtPayload {
  sub: string;
  role: 'player' | 'referee' | 'admin';
}

declare module '@fastify/jwt' {
  interface FastifyJWT {
    payload: JwtPayload;
    user: JwtPayload;
  }
}

declare module 'fastify' {
  interface FastifyInstance {
    authenticate: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
    requireRole: (...roles: Array<'player' | 'referee' | 'admin'>) => (
      request: FastifyRequest,
      reply: FastifyReply,
    ) => Promise<void>;
  }
}

const jwtPlugin: FastifyPluginAsync = async (fastify) => {
  await fastify.register(fastifyJwt, {
    secret: env.jwtSecret,
    sign: { expiresIn: env.jwtTtl },
  });

  fastify.decorate(
    'authenticate',
    async (request: FastifyRequest, _reply: FastifyReply) => {
      try {
        await request.jwtVerify();
      } catch {
        throw new UnauthorizedError('Invalid or missing token');
      }
    },
  );

  fastify.decorate(
    'requireRole',
    (...roles: Array<'player' | 'referee' | 'admin'>) =>
      async (request: FastifyRequest, _reply: FastifyReply) => {
        try {
          await request.jwtVerify();
        } catch {
          throw new UnauthorizedError('Invalid or missing token');
        }
        if (!roles.includes(request.user.role)) {
          throw new ForbiddenError(`Required role: ${roles.join(' or ')}`);
        }
      },
  );
};

export default fp(jwtPlugin);
