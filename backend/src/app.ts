import Fastify from 'fastify';
import { env } from './config/env.js';
import mongoosePlugin from './plugins/mongoose.js';
import errorHandlerPlugin from './plugins/error-handler.js';

export async function buildApp() {
  const app = Fastify({ logger: true });

  await app.register(errorHandlerPlugin);
  await app.register(mongoosePlugin, { uri: env.mongodbUri });

  app.get('/', async () => {
    return { message: 'Hello World' };
  });

  return app;
}
