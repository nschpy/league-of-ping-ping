import type { FastifyPluginAsync } from 'fastify';
import { mmrService } from './index.js';
import type { GameFormat } from '../game/game.model.js';

const forecastSchema = {
  tags: ['MMR'],
  summary: 'Forecast Elo deltas for a hypothetical match',
  querystring: {
    type: 'object',
    required: ['aId', 'bId'],
    properties: {
      aId:    { type: 'string', pattern: '^[a-fA-F0-9]{24}$', description: 'Player A user id' },
      bId:    { type: 'string', pattern: '^[a-fA-F0-9]{24}$', description: 'Player B user id' },
      format: { type: 'string', enum: ['bo1', 'bo3', 'bo5'], default: 'bo3' },
    },
    additionalProperties: false,
  },
};

const mmrRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.get(
    '/forecast',
    { schema: forecastSchema },
    async (request, reply) => {
      const { aId, bId, format } = request.query as {
        aId: string;
        bId: string;
        format?: GameFormat;
      };

      const forecast = await mmrService.forecast(aId, bId, format ?? 'bo3');
      return reply.send(forecast);
    },
  );
};

export default mmrRoutes;
