import mongoose from 'mongoose';
/**
 * Fastify-плагин подключения к MongoDB.
 * @description
 * - Устанавливает соединение при старте приложения
 * - Закрывает соединение при graceful shutdown через хук `onClose`
 * - Логирует статус подключения
 *
 * @param opts.uri - MongoDB connection string
 */
const mongoosePlugin = async (fastify, opts) => {
    await mongoose.connect(opts.uri);
    fastify.log.info('Connected to MongoDB');
    fastify.addHook('onClose', async () => {
        await mongoose.disconnect();
        fastify.log.info('Disconnected from MongoDB');
    });
};
export default mongoosePlugin;
//# sourceMappingURL=mongoose.js.map