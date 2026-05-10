import fp from 'fastify-plugin'
import mongoose from 'mongoose'
import type { FastifyInstance } from 'fastify'
import { config } from './config.js'

declare module 'fastify' {
  interface FastifyInstance {
    mongoose: typeof mongoose
  }
}

async function mongoosePluginFn(app: FastifyInstance): Promise<void> {
  await mongoose.connect(config.MONGO_URI)
  app.decorate('mongoose', mongoose)
  app.addHook('onClose', async () => {
    await mongoose.disconnect()
  })
}

export const mongoosePlugin = fp(mongoosePluginFn, {
  name: 'mongoose',
})
