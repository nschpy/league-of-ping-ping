import type { FastifyPluginAsync } from 'fastify';
/** Опции для подключения к MongoDB */
interface MongoosePluginOptions {
    /** URI подключения к MongoDB */
    uri: string;
}
/**
 * Fastify-плагин подключения к MongoDB.
 * @description
 * - Устанавливает соединение при старте приложения
 * - Закрывает соединение при graceful shutdown через хук `onClose`
 * - Логирует статус подключения
 *
 * @param opts.uri - MongoDB connection string
 */
declare const mongoosePlugin: FastifyPluginAsync<MongoosePluginOptions>;
export default mongoosePlugin;
//# sourceMappingURL=mongoose.d.ts.map