import { userService } from './index.js';
import { GameModel } from '../game/game.model.js';
import { tierFor } from '../../shared/tier.js';
const objectIdParam = {
    type: 'object',
    required: ['id'],
    properties: { id: { type: 'string', pattern: '^[a-fA-F0-9]{24}$', description: 'MongoDB ObjectId' } },
};
const tierEnum = ['Bronze', 'Silver', 'Gold', 'Platinum', 'Diamond', 'Master'];
const userRoutes = async (fastify) => {
    fastify.get('/', {
        schema: {
            tags: ['Users'],
            summary: 'List users',
            querystring: {
                type: 'object',
                properties: {
                    role: { type: 'string', enum: ['player', 'referee', 'admin'] },
                    search: { type: 'string' },
                    tier: { type: 'string', enum: tierEnum },
                    sortBy: { type: 'string', enum: ['mmr', 'name', 'streak', 'wr'], default: 'mmr' },
                    page: { type: 'integer', minimum: 1, default: 1 },
                    limit: { type: 'integer', minimum: 1, maximum: 100, default: 20 },
                },
                additionalProperties: false,
            },
        },
    }, async (request, reply) => {
        const { role, search, tier, sortBy, page, limit } = request.query;
        const result = await userService.findAll({
            ...(role ? { role } : {}),
            ...(search ? { search } : {}),
            ...(tier ? { tier } : {}),
        }, { page, limit }, sortBy ?? 'mmr');
        const data = result.data.map((u) => ({ ...u, tier: tierFor(u.mmr) }));
        return reply.send({ ...result, data });
    });
    fastify.get('/:id', {
        schema: {
            tags: ['Users'],
            summary: 'Get user by id',
            params: objectIdParam,
        },
    }, async (request, reply) => {
        const { id } = request.params;
        const user = await userService.findById(id);
        if (!user)
            return reply.status(404).send({ error: 'NotFoundError', message: `User not found: ${id}`, statusCode: 404 });
        return reply.send({ ...user, tier: tierFor(user.mmr) });
    });
    fastify.get('/:id/mmr-history', {
        schema: {
            tags: ['Users'],
            summary: 'User MMR history',
            params: objectIdParam,
            querystring: {
                type: 'object',
                properties: {
                    days: { type: 'integer', minimum: 1, maximum: 365, default: 30, description: 'Number of days to look back' },
                },
                additionalProperties: false,
            },
        },
    }, async (request, reply) => {
        const { id } = request.params;
        const { days } = request.query;
        const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
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
        return reply.send({ userId: id, days, history });
    });
    fastify.get('/:id/games', {
        schema: {
            tags: ['Users'],
            summary: 'User games history',
            params: objectIdParam,
            querystring: {
                type: 'object',
                properties: {
                    status: { type: 'string', enum: ['pending', 'in_progress', 'completed', 'cancelled'] },
                    page: { type: 'integer', minimum: 1, default: 1 },
                    limit: { type: 'integer', minimum: 1, maximum: 100, default: 20 },
                },
                additionalProperties: false,
            },
        },
    }, async (request, reply) => {
        const { id } = request.params;
        const { status, page, limit } = request.query;
        const { gameService } = await import('../game/index.js');
        const result = await gameService.findAll({
            playerId: id,
            ...(status ? { status } : {}),
        }, { page, limit });
        return reply.send(result);
    });
    fastify.patch('/me', {
        schema: {
            tags: ['Users'],
            summary: 'Update own profile',
            security: [{ bearerAuth: [] }],
            body: {
                type: 'object',
                properties: {
                    displayName: { type: 'string', minLength: 1, maxLength: 60 },
                    username: { type: 'string', minLength: 3, maxLength: 30, pattern: '^[a-zA-Z0-9_-]+$' },
                    email: { type: 'string', format: 'email' },
                    country: { type: 'string', pattern: '^[A-Za-z]{2}$', description: 'ISO-3166-1 alpha-2' },
                    bio: { type: 'string', maxLength: 280 },
                    avatarColor: { type: 'integer', minimum: 0, maximum: 5 },
                },
                additionalProperties: false,
            },
        },
        preHandler: fastify.authenticate,
    }, async (request, reply) => {
        const userId = request.user.sub;
        const body = request.body;
        const user = await userService.update(userId, body);
        return reply.send(user);
    });
};
export default userRoutes;
//# sourceMappingURL=user.routes.js.map