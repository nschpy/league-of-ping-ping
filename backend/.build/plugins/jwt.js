import fp from 'fastify-plugin';
import fastifyJwt from '@fastify/jwt';
import { env } from '../config/env.js';
import { UnauthorizedError, ForbiddenError } from '../shared/errors.js';
const jwtPlugin = async (fastify) => {
    await fastify.register(fastifyJwt, {
        secret: env.jwtSecret,
        sign: { expiresIn: env.jwtTtl },
    });
    fastify.decorate('authenticate', async (request, _reply) => {
        try {
            await request.jwtVerify();
        }
        catch {
            throw new UnauthorizedError('Invalid or missing token');
        }
    });
    fastify.decorate('requireRole', (...roles) => async (request, _reply) => {
        try {
            await request.jwtVerify();
        }
        catch {
            throw new UnauthorizedError('Invalid or missing token');
        }
        if (!roles.includes(request.user.role)) {
            throw new ForbiddenError(`Required role: ${roles.join(' or ')}`);
        }
    });
};
export default fp(jwtPlugin);
//# sourceMappingURL=jwt.js.map