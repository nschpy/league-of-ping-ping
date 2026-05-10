import fp from 'fastify-plugin'
import type { FastifyInstance } from 'fastify'
import { TypeBoxValidatorCompiler } from '@fastify/type-provider-typebox'
import type { TypeBoxTypeProvider } from '@fastify/type-provider-typebox'
import { RegisterBody, LoginBody, AuthResponse, MeResponse, ErrorResponse } from './auth.schemas.js'
import * as authService from './auth.service.js'
import * as authRepository from './auth.repository.js'
import { unauthorized } from '../../utils/errors.js'

async function authRoutesPlugin(app: FastifyInstance): Promise<void> {
  const typedApp = app.withTypeProvider<TypeBoxTypeProvider>()
  typedApp.setValidatorCompiler(TypeBoxValidatorCompiler)

  typedApp.post('/auth/register', {
    schema: {
      body: RegisterBody,
      response: {
        201: AuthResponse,
        409: ErrorResponse,
      },
      tags: ['auth'],
    },
    handler: async (request, reply) => {
      const result = await authService.register(request.body, app)
      return reply.status(201).send(result)
    },
  })

  typedApp.post('/auth/login', {
    schema: {
      body: LoginBody,
      response: {
        200: AuthResponse,
        401: ErrorResponse,
      },
      tags: ['auth'],
    },
    handler: async (request, reply) => {
      const result = await authService.login(request.body, app)
      return reply.status(200).send(result)
    },
  })

  typedApp.get('/auth/me', {
    schema: {
      response: {
        200: MeResponse,
        401: ErrorResponse,
      },
      tags: ['auth'],
    },
    onRequest: app.authenticate,
    handler: async (request, reply) => {
      const user = await authRepository.findById(request.user.sub)
      if (user === null) {
        throw unauthorized('User not found')
      }
      return reply.status(200).send(user.toPublicJSON())
    },
  })
}

export const authRoutes = fp(authRoutesPlugin, {
  name: 'auth-routes',
})
