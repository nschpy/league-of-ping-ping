import Fastify from 'fastify';
import { env } from './config/env.js';
import mongoosePlugin from './plugins/mongoose.js';
import errorHandlerPlugin from './plugins/error-handler.js';
import jwtPlugin from './plugins/jwt.js';
import swaggerPlugin from './plugins/swagger.js';
import fastifyCors from '@fastify/cors';
import authRoutes from './modules/auth/auth.routes.js';
import userRoutes from './modules/user/user.routes.js';
import gameRoutes from './modules/game/game.routes.js';
import leaderboardRoutes from './modules/leaderboard/leaderboard.routes.js';
import mmrRoutes from './modules/mmr/mmr.routes.js';
export async function buildApp() {
    const app = Fastify({ logger: true });
    await app.register(errorHandlerPlugin);
    await app.register(mongoosePlugin, { uri: env.mongodbUri });
    await app.register(fastifyCors, { origin: env.corsOrigins });
    await app.register(jwtPlugin);
    await app.register(swaggerPlugin);
    app.get('/', { schema: { tags: ['Health'], summary: 'Service health check' } }, async () => ({ status: 'ok' }));
    await app.register(authRoutes, { prefix: '/api/v1/auth' });
    await app.register(userRoutes, { prefix: '/api/v1/users' });
    await app.register(gameRoutes, { prefix: '/api/v1/games' });
    await app.register(leaderboardRoutes, { prefix: '/api/v1/leaderboard' });
    await app.register(mmrRoutes, { prefix: '/api/v1/mmr' });
    return app;
}
//# sourceMappingURL=app.js.map