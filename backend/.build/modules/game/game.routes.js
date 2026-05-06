import { gameService } from './index.js';
import { ForbiddenError } from '../../shared/errors.js';
const objectIdParam = {
    type: 'object',
    required: ['id'],
    properties: { id: { type: 'string', pattern: '^[a-fA-F0-9]{24}$', description: 'MongoDB ObjectId' } },
};
const createGameSchema = {
    tags: ['Games'],
    summary: 'Create a new game',
    security: [{ bearerAuth: [] }],
    body: {
        type: 'object',
        required: ['player1Id', 'player2Id', 'refereeId', 'format'],
        properties: {
            player1Id: { type: 'string', pattern: '^[a-fA-F0-9]{24}$' },
            player2Id: { type: 'string', pattern: '^[a-fA-F0-9]{24}$' },
            refereeId: { type: 'string', pattern: '^[a-fA-F0-9]{24}$' },
            format: { type: 'string', enum: ['bo1', 'bo3', 'bo5'] },
            court: { type: 'string', maxLength: 100 },
            scheduledAt: { type: 'string', format: 'date-time' },
            notes: { type: 'string', maxLength: 500 },
        },
        additionalProperties: false,
    },
};
const recordSetSchema = {
    tags: ['Games'],
    summary: 'Record a set result',
    security: [{ bearerAuth: [] }],
    params: objectIdParam,
    body: {
        type: 'object',
        required: ['player1Score', 'player2Score'],
        properties: {
            player1Score: { type: 'integer', minimum: 0 },
            player2Score: { type: 'integer', minimum: 0 },
        },
        additionalProperties: false,
    },
};
const gameRoutes = async (fastify) => {
    fastify.post('/', { schema: createGameSchema, preHandler: fastify.requireRole('referee', 'admin') }, async (request, reply) => {
        const body = request.body;
        const game = await gameService.create({
            player1Id: body.player1Id,
            player2Id: body.player2Id,
            refereeId: body.refereeId,
            format: body.format,
            ...(body.court ? { court: body.court } : {}),
            ...(body.scheduledAt ? { scheduledAt: new Date(body.scheduledAt) } : {}),
            ...(body.notes ? { notes: body.notes } : {}),
        });
        return reply.status(201).send(game);
    });
    fastify.get('/', {
        schema: {
            tags: ['Games'],
            summary: 'List games',
            querystring: {
                type: 'object',
                properties: {
                    status: { type: 'string', enum: ['pending', 'in_progress', 'completed', 'cancelled'] },
                    playerId: { type: 'string', pattern: '^[a-fA-F0-9]{24}$' },
                    refereeId: { type: 'string', pattern: '^[a-fA-F0-9]{24}$' },
                    scheduledFrom: { type: 'string', format: 'date-time' },
                    scheduledTo: { type: 'string', format: 'date-time' },
                    page: { type: 'integer', minimum: 1, default: 1 },
                    limit: { type: 'integer', minimum: 1, maximum: 100, default: 20 },
                },
                additionalProperties: false,
            },
        },
    }, async (request, reply) => {
        const { status, playerId, refereeId, scheduledFrom, scheduledTo, page, limit } = request.query;
        const result = await gameService.findAll({
            ...(status ? { status } : {}),
            ...(playerId ? { playerId } : {}),
            ...(refereeId ? { refereeId } : {}),
            ...(scheduledFrom ? { scheduledFrom: new Date(scheduledFrom) } : {}),
            ...(scheduledTo ? { scheduledTo: new Date(scheduledTo) } : {}),
        }, { page, limit });
        return reply.send(result);
    });
    fastify.get('/:id', {
        schema: {
            tags: ['Games'],
            summary: 'Get game by id',
            params: objectIdParam,
        },
    }, async (request, reply) => {
        const { id } = request.params;
        const game = await gameService.findById(id);
        if (!game)
            return reply.status(404).send({ error: 'NotFoundError', message: `Game not found: ${id}`, statusCode: 404 });
        return reply.send(game);
    });
    fastify.post('/:id/start', {
        schema: {
            tags: ['Games'],
            summary: 'Start a game',
            security: [{ bearerAuth: [] }],
            params: objectIdParam,
        },
        preHandler: fastify.requireRole('referee', 'admin'),
    }, async (request, reply) => {
        const { id } = request.params;
        const game = await gameService.findById(id);
        if (!game)
            return reply.status(404).send({ error: 'NotFoundError', message: `Game not found: ${id}`, statusCode: 404 });
        if (request.user.role !== 'admin' &&
            game.refereeId.toString() !== request.user.sub) {
            throw new ForbiddenError('Only the assigned referee can start this game');
        }
        const updated = await gameService.start(id);
        return reply.send(updated);
    });
    fastify.post('/:id/sets', { schema: recordSetSchema, preHandler: fastify.requireRole('referee', 'admin') }, async (request, reply) => {
        const { id } = request.params;
        const body = request.body;
        const game = await gameService.findById(id);
        if (!game)
            return reply.status(404).send({ error: 'NotFoundError', message: `Game not found: ${id}`, statusCode: 404 });
        if (request.user.role !== 'admin' &&
            game.refereeId.toString() !== request.user.sub) {
            throw new ForbiddenError('Only the assigned referee can record sets');
        }
        const updated = await gameService.recordSet(id, body);
        return reply.send(updated);
    });
    fastify.post('/:id/cancel', {
        schema: {
            tags: ['Games'],
            summary: 'Cancel a game',
            security: [{ bearerAuth: [] }],
            params: objectIdParam,
        },
        preHandler: fastify.requireRole('referee', 'admin'),
    }, async (request, reply) => {
        const { id } = request.params;
        const game = await gameService.findById(id);
        if (!game)
            return reply.status(404).send({ error: 'NotFoundError', message: `Game not found: ${id}`, statusCode: 404 });
        if (request.user.role !== 'admin' &&
            game.refereeId.toString() !== request.user.sub) {
            throw new ForbiddenError('Only the assigned referee can cancel this game');
        }
        const updated = await gameService.cancel(id);
        return reply.send(updated);
    });
    fastify.delete('/:id', {
        schema: {
            tags: ['Games'],
            summary: 'Delete a game (admin only)',
            security: [{ bearerAuth: [] }],
            params: objectIdParam,
        },
        preHandler: fastify.requireRole('admin'),
    }, async (request, reply) => {
        const { id } = request.params;
        await gameService.delete(id);
        return reply.status(204).send();
    });
};
export default gameRoutes;
//# sourceMappingURL=game.routes.js.map