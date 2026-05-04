import type { FastifyPluginAsync } from 'fastify';
import mongoose from 'mongoose';

interface MongoosePluginOptions {
  uri: string;
}

const mongoosePlugin: FastifyPluginAsync<MongoosePluginOptions> = async (fastify, opts) => {
  await mongoose.connect(opts.uri);
  fastify.log.info('Connected to MongoDB');

  fastify.addHook('onClose', async () => {
    await mongoose.disconnect();
    fastify.log.info('Disconnected from MongoDB');
  });
};

export default mongoosePlugin;
