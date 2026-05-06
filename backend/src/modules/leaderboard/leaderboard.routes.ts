import type { FastifyPluginAsync } from 'fastify';
import { leaderboardService } from './leaderboard.service.js';

const tierEnum = ['Bronze', 'Silver', 'Gold', 'Platinum', 'Diamond', 'Master'];

const leaderboardRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.get(
    '/',
    {
      schema: {
        tags: ['Leaderboard'],
        summary: 'Get leaderboard',
        querystring: {
          type: 'object',
          properties: {
            limit:  { type: 'integer', minimum: 1, maximum: 100, default: 20 },
            tier:   { type: 'string', enum: tierEnum },
            search: { type: 'string' },
          },
          additionalProperties: false,
        },
      },
    },
    async (request, reply) => {
      const { limit, tier, search } = request.query as {
        limit: number;
        tier?: string;
        search?: string;
      };

      const entries = await leaderboardService.getLeaderboard({
        limit,
        ...(tier ? { tier } : {}),
        ...(search ? { search } : {}),
      });
      return reply.send({ data: entries, total: entries.length });
    },
  );

  fastify.get(
    '/me/rank',
    {
      schema: {
        tags: ['Leaderboard'],
        summary: 'Get own leaderboard rank',
        security: [{ bearerAuth: [] }],
      },
      preHandler: fastify.authenticate,
    },
    async (request, reply) => {
      const rank = await leaderboardService.getUserRank(request.user.sub);
      return reply.send({ rank });
    },
  );
};

export default leaderboardRoutes;
