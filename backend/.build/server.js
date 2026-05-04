import { buildApp } from './app.js';
import { env } from './config/env.js';
/**
 * Точка входа в приложение.
 * Создаёт Fastify-инстанс, регистрирует плагины и запускает HTTP-сервер.
 * Поддерживает graceful shutdown через SIGTERM и SIGINT.
 */
const app = await buildApp();
/** Корректное завершение работы: закрывает соединения перед выходом. */
const shutdown = async () => {
    await app.close();
    process.exit(0);
};
process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);
try {
    await app.listen({ port: env.port, host: '0.0.0.0' });
}
catch (err) {
    app.log.error(err);
    process.exit(1);
}
//# sourceMappingURL=server.js.map