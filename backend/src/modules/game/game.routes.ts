import type { FastifyPluginAsync } from 'fastify';
import { gameService } from './index.js';
import { ForbiddenError } from '../../shared/errors.js';

const createGameSchema = {
  body: {
    type: 'object',
    required: ['player1Id', 'player2Id', 'refereeId', 'format'],
    properties: {
      player1Id: { type: 'string' },
      player2Id: { type: 'string' },
      refereeId: { type: 'string' },
      format: { type: 'string', enum: ['bo1', 'bo3', 'bo5'] },
      court: { type: 'string', maxLength: 100 },
      scheduledAt: { type: 'string', format: 'date-time' },
      notes: { type: 'string', maxLength: 500 },
    },
    additionalProperties: false,
  },
};

const recordSetSchema = {
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

const gameRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.post(
    '/',
    { schema: createGameSchema, preHandler: fastify.requireRole('referee', 'admin') },
    async (request, reply) => {
      const body = request.body as {
        player1Id: string;
        player2Id: string;
        refereeId: string;
        format: 'bo1' | 'bo3' | 'bo5';
        court?: string;
        scheduledAt?: string;
        notes?: string;
      };

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
    },
  );

  fastify.get('/', async (request, reply) => {
    const { status, playerId, refereeId, scheduledFrom, scheduledTo, page, limit } =
      request.query as {
        status?: string;
        playerId?: string;
        refereeId?: string;
        scheduledFrom?: string;
        scheduledTo?: string;
        page?: string;
        limit?: string;
      };

    const result = await gameService.findAll(
      {
        ...(status ? { status: status as 'pending' | 'in_progress' | 'completed' | 'cancelled' } : {}),
        ...(playerId ? { playerId } : {}),
        ...(refereeId ? { refereeId } : {}),
        ...(scheduledFrom ? { scheduledFrom: new Date(scheduledFrom) } : {}),
        ...(scheduledTo ? { scheduledTo: new Date(scheduledTo) } : {}),
      },
      {
        ...(page ? { page: parseInt(page, 10) } : {}),
        ...(limit ? { limit: parseInt(limit, 10) } : {}),
      },
    );
    return reply.send(result);
  });

  fastify.get('/:id', async (request, reply) => {
    const { id } = request.params as { id: string };
    const game = await gameService.findById(id);
    if (!game) return reply.status(404).send({ error: 'NotFoundError', message: `Game not found: ${id}`, statusCode: 404 });
    return reply.send(game);
  });

  fastify.post(
    '/:id/start',
    { preHandler: fastify.requireRole('referee', 'admin') },
    async (request, reply) => {
      const { id } = request.params as { id: string };
      const game = await gameService.findById(id);
      if (!game) return reply.status(404).send({ error: 'NotFoundError', message: `Game not found: ${id}`, statusCode: 404 });

      if (
        request.user.role !== 'admin' &&
        game.refereeId.toString() !== request.user.sub
      ) {
        throw new ForbiddenError('Only the assigned referee can start this game');
      }

      const updated = await gameService.start(id);
      return reply.send(updated);
    },
  );

  fastify.post(
    '/:id/sets',
    { schema: recordSetSchema, preHandler: fastify.requireRole('referee', 'admin') },
    async (request, reply) => {
      const { id } = request.params as { id: string };
      const body = request.body as { player1Score: number; player2Score: number };

      const game = await gameService.findById(id);
      if (!game) return reply.status(404).send({ error: 'NotFoundError', message: `Game not found: ${id}`, statusCode: 404 });

      if (
        request.user.role !== 'admin' &&
        game.refereeId.toString() !== request.user.sub
      ) {
        throw new ForbiddenError('Only the assigned referee can record sets');
      }

      const updated = await gameService.recordSet(id, body);
      return reply.send(updated);
    },
  );

  fastify.post(
    '/:id/cancel',
    { preHandler: fastify.requireRole('referee', 'admin') },
    async (request, reply) => {
      const { id } = request.params as { id: string };

      const game = await gameService.findById(id);
      if (!game) return reply.status(404).send({ error: 'NotFoundError', message: `Game not found: ${id}`, statusCode: 404 });

      if (
        request.user.role !== 'admin' &&
        game.refereeId.toString() !== request.user.sub
      ) {
        throw new ForbiddenError('Only the assigned referee can cancel this game');
      }

      const updated = await gameService.cancel(id);
      return reply.send(updated);
    },
  );

  fastify.delete(
    '/:id',
    { preHandler: fastify.requireRole('admin') },
    async (request, reply) => {
      const { id } = request.params as { id: string };
      await gameService.delete(id);
      return reply.status(204).send();
    },
  );
};

export default gameRoutes;
