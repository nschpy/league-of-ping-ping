import type { FastifyPluginAsync } from 'fastify';
import mongoose from 'mongoose';

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
const mongoosePlugin: FastifyPluginAsync<MongoosePluginOptions> = async (fastify, opts) => {
  await mongoose.connect(opts.uri);
  fastify.log.info('Connected to MongoDB');

  fastify.addHook('onClose', async () => {
    await mongoose.disconnect();
    fastify.log.info('Disconnected from MongoDB');
  });
};

export default mongoosePlugin;
