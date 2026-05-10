import fp from 'fastify-plugin'
import fastifyJwt from '@fastify/jwt'
import type { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'
import { config } from './config.js'
import { unauthorized } from './errors.js'

declare module '@fastify/jwt' {
  interface FastifyJWT {
    payload: {
      sub: string
      email: string
      nickname: string
      role: string
    }
    user: {
      sub: string
      email: string
      nickname: string
      role: string
    }
  }
}

declare module 'fastify' {
  interface FastifyInstance {
    authenticate: (request: FastifyRequest, reply: FastifyReply) => Promise<void>
  }
}

async function authPluginFn(app: FastifyInstance): Promise<void> {
  await app.register(fastifyJwt, {
    secret: config.JWT_SECRET,
  })

  app.decorate(
    'authenticate',
    async (request: FastifyRequest, _reply: FastifyReply): Promise<void> => {
      try {
        await request.jwtVerify()
      } catch {
        throw unauthorized('Invalid or missing authentication token')
      }
    },
  )
}

export const authPlugin = fp(authPluginFn, {
  name: 'auth',
})
