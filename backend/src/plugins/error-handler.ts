import type { FastifyPluginAsync } from 'fastify';
import { DomainError } from '../shared/errors.js';

const errorHandlerPlugin: FastifyPluginAsync = async (fastify) => {
  fastify.setErrorHandler((error, _request, reply) => {
    if (error instanceof DomainError) {
      return reply.status(error.statusCode).send({
        error: error.name,
        message: error.message,
        statusCode: error.statusCode,
      });
    }

    fastify.log.error(error);
    return reply.status(500).send({
      error: 'InternalServerError',
      message: 'An unexpected error occurred',
      statusCode: 500,
    });
  });
};

export default errorHandlerPlugin;
