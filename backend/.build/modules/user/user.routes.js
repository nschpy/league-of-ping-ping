import { userService } from './index.js';
import { GameModel } from '../game/game.model.js';
import { tierFor } from '../../shared/tier.js';
const userRoutes = async (fastify) => {
    fastify.get('/', async (request, reply) => {
        const { role, search, tier, sortBy, page, limit } = request.query;
        const result = await userService.findAll({
            ...(role ? { role: role } : {}),
            ...(search ? { search } : {}),
            ...(tier ? { tier } : {}),
        }, {
            ...(page ? { page: parseInt(page, 10) } : {}),
            ...(limit ? { limit: parseInt(limit, 10) } : {}),
        }, sortBy ?? 'mmr');
        const data = result.data.map((u) => ({ ...u, tier: tierFor(u.mmr) }));
        return reply.send({ ...result, data });
    });
    fastify.get('/:id', async (request, reply) => {
        const { id } = request.params;
        const user = await userService.findById(id);
        if (!user)
            return reply.status(404).send({ error: 'NotFoundError', message: `User not found: ${id}`, statusCode: 404 });
        return reply.send({ ...user, tier: tierFor(user.mmr) });
    });
    fastify.get('/:id/mmr-history', async (request, reply) => {
        const { id } = request.params;
        const { days } = request.query;
        const daysNum = Math.min(days ? parseInt(days, 10) : 30, 365);
        const since = new Date(Date.now() - daysNum * 24 * 60 * 60 * 1000);
        const user = await userService.findById(id);
        if (!user)
            return reply.status(404).send({ error: 'NotFoundError', message: `User not found: ${id}`, statusCode: 404 });
        const { Types } = await import('mongoose');
        const uid = new Types.ObjectId(id);
        const games = await GameModel.find({
            $or: [{ player1Id: uid }, { player2Id: uid }],
            status: 'completed',
            completedAt: { $gte: since },
        })
            .select('player1Id player2Id player1MmrBefore player1MmrChange player2MmrBefore player2MmrChange completedAt')
            .sort({ completedAt: 1 })
            .lean()
            .exec();
        const history = games.map((g) => {
            const isP1 = g.player1Id.equals(uid);
            const mmrBefore = isP1 ? g.player1MmrBefore : g.player2MmrBefore;
            const mmrChange = isP1 ? g.player1MmrChange : g.player2MmrChange;
            return {
                at: g.completedAt,
                mmr: (mmrBefore ?? 0) + (mmrChange ?? 0),
            };
        });
        return reply.send({ userId: id, days: daysNum, history });
    });
    fastify.get('/:id/games', async (request, reply) => {
        const { id } = request.params;
        const { status, page, limit } = request.query;
        const { gameService } = await import('../game/index.js');
        const result = await gameService.findAll({
            playerId: id,
            ...(status ? { status: status } : {}),
        }, {
            ...(page ? { page: parseInt(page, 10) } : {}),
            ...(limit ? { limit: parseInt(limit, 10) } : {}),
        });
        return reply.send(result);
    });
    fastify.patch('/me', { preHandler: fastify.authenticate }, async (request, reply) => {
        const userId = request.user.sub;
        const body = request.body;
        const user = await userService.update(userId, body);
        return reply.send(user);
    });
};
export default userRoutes;
//# sourceMappingURL=user.routes.js.map