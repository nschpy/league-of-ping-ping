import fp from 'fastify-plugin'
import type { FastifyInstance } from 'fastify'
import type { TypeBoxTypeProvider } from '@fastify/type-provider-typebox'
import { RegisterBody, LoginBody, AuthResponse, MeResponse, ErrorResponse } from './auth.schemas.js'
import * as authService from './auth.service.js'
import * as authRepository from './auth.repository.js'
import { unauthorized } from '../../utils/errors.js'

async function authRoutesPlugin(app: FastifyInstance): Promise<void> {
  const typedApp = app.withTypeProvider<TypeBoxTypeProvider>()

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
      const { user } = await authService.register(request.body)
      const token = app.jwt.sign(
        { sub: user.id, email: user.email, nickname: user.nickname, role: user.role },
        { expiresIn: '1d' },
      )
      return reply.status(201).send({ token, user })
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
      const { user } = await authService.login(request.body)
      const expiresIn = request.body.rememberMe === true ? '30d' : '1d'
      const token = app.jwt.sign(
        { sub: user.id, email: user.email, nickname: user.nickname, role: user.role },
        { expiresIn },
      )
      return reply.status(200).send({ token, user })
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
