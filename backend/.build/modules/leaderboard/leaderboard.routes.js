import { leaderboardService } from './leaderboard.service.js';
const leaderboardRoutes = async (fastify) => {
    fastify.get('/', async (request, reply) => {
        const { limit, tier, search } = request.query;
        const entries = await leaderboardService.getLeaderboard({
            limit: limit ? parseInt(limit, 10) : 20,
            ...(tier ? { tier } : {}),
            ...(search ? { search } : {}),
        });
        return reply.send({ data: entries, total: entries.length });
    });
    fastify.get('/me/rank', { preHandler: fastify.authenticate }, async (request, reply) => {
        const rank = await leaderboardService.getUserRank(request.user.sub);
        return reply.send({ rank });
    });
};
export default leaderboardRoutes;
//# sourceMappingURL=leaderboard.routes.js.map