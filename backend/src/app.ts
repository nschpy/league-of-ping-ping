import Fastify from 'fastify'
import type { FastifyInstance } from 'fastify'
import { TypeBoxValidatorCompiler } from '@fastify/type-provider-typebox'
import cors from '@fastify/cors'
import swagger from '@fastify/swagger'
import swaggerUI from '@fastify/swagger-ui'
import { mongoosePlugin } from './utils/mongoose.plugin.js'
import { authPlugin } from './utils/auth.plugin.js'
import { authRoutes } from './modules/auth/auth.routes.js'
import { gameRoutes } from './modules/games/game.routes.js'
import { userRoutes } from './modules/users/user.routes.js'
import { registerErrorHandler } from './utils/errors.js'
import { config } from './utils/config.js'

export async function buildApp(): Promise<FastifyInstance> {
  const app = Fastify({ logger: true })
  app.setValidatorCompiler(TypeBoxValidatorCompiler)
  registerErrorHandler(app)
  await app.register(cors, { origin: config.CORS_ORIGIN, credentials: true })
  await app.register(swagger, { openapi: { info: { title: 'League API', version: '1.0.0' } } })
  await app.register(swaggerUI, { routePrefix: '/docs' })
  await app.register(mongoosePlugin)
  await app.register(authPlugin)
  await app.register(authRoutes)
  await app.register(userRoutes)
  await app.register(gameRoutes)
  return app
}
