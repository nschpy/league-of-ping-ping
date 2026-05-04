import type { FastifyPluginAsync } from 'fastify';
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
declare const errorHandlerPlugin: FastifyPluginAsync;
export default errorHandlerPlugin;
//# sourceMappingURL=error-handler.d.ts.map