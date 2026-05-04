import { DomainError } from '../shared/errors.js';
/**
 * Fastify-плагин централизованной обработки ошибок.
 * @description
 * - Перехватывает все ошибки, возникающие в запросах
 * - DomainError: преобразует в JSON-ответ с соответствующим HTTP-статусом
 * - Прочие ошибки: логирует и возвращает 500 Internal Server Error
 *
 * @example
 * // Пример ответа для DomainError:
 * { "error": "NotFoundError", "message": "User not found: abc123", "statusCode": 404 }
 */
const errorHandlerPlugin = async (fastify) => {
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
//# sourceMappingURL=error-handler.js.map