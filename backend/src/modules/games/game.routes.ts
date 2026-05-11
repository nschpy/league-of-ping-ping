import fp from 'fastify-plugin'
import type { FastifyInstance } from 'fastify'
import type { TypeBoxTypeProvider } from '@fastify/type-provider-typebox'
import { Type } from '@fastify/type-provider-typebox'
import {
  CreateGameBody,
  AddPointBody,
  FinalizeSetBody,
  GameResponse,
  ErrorResponse,
} from './game.schemas.js'
import * as gameService from './game.service.js'

const ObjectIdParam = Type.Object({
  id: Type.String({ pattern: '^[a-f0-9]{24}$' }),
})

async function gameRoutesPlugin(app: FastifyInstance): Promise<void> {
  const typedApp = app.withTypeProvider<TypeBoxTypeProvider>()

  typedApp.post('/games', {
    schema: {
      body: CreateGameBody,
      response: {
        201: GameResponse,
        400: ErrorResponse,
      },
      tags: ['games'],
    },
    onRequest: app.authenticate,
    handler: async (request, reply) => {
      const game = await gameService.createGame({
        ...request.body,
        refereeId: request.user.sub,
      })
      return reply.status(201).send(game.toPublicJSON())
    },
  })

  typedApp.get('/games/:id', {
    schema: {
      params: ObjectIdParam,
      response: {
        200: GameResponse,
        404: ErrorResponse,
      },
      tags: ['games'],
    },
    onRequest: app.authenticate,
    handler: async (request, reply) => {
      const game = await gameService.getGame(request.params.id)
      return reply.send(game.toPublicJSON())
    },
  })

  typedApp.post('/games/:id/points', {
    schema: {
      params: ObjectIdParam,
      body: AddPointBody,
      response: {
        200: GameResponse,
        400: ErrorResponse,
        403: ErrorResponse,
        404: ErrorResponse,
      },
      tags: ['games'],
    },
    onRequest: app.authenticate,
    handler: async (request, reply) => {
      const game = await gameService.addPoint(
        request.params.id,
        request.body.scorer,
        request.user.sub,
      )
      return reply.send(game.toPublicJSON())
    },
  })

  typedApp.delete('/games/:id/points/last', {
    schema: {
      params: ObjectIdParam,
      response: {
        200: GameResponse,
        400: ErrorResponse,
        403: ErrorResponse,
        404: ErrorResponse,
      },
      tags: ['games'],
    },
    onRequest: app.authenticate,
    handler: async (request, reply) => {
      const game = await gameService.undoLastPoint(request.params.id, request.user.sub)
      return reply.send(game.toPublicJSON())
    },
  })

  typedApp.post('/games/:id/sets', {
    schema: {
      params: ObjectIdParam,
      body: FinalizeSetBody,
      response: {
        200: GameResponse,
        400: ErrorResponse,
        403: ErrorResponse,
        404: ErrorResponse,
      },
      tags: ['games'],
    },
    onRequest: app.authenticate,
    handler: async (request, reply) => {
      const game = await gameService.finalizeSet(
        request.params.id,
        request.body,
        request.user.sub,
      )
      return reply.send(game.toPublicJSON())
    },
  })

  typedApp.post('/games/:id/cancel', {
    schema: {
      params: ObjectIdParam,
      response: {
        200: GameResponse,
        400: ErrorResponse,
        403: ErrorResponse,
        404: ErrorResponse,
      },
      tags: ['games'],
    },
    onRequest: app.authenticate,
    handler: async (request, reply) => {
      const game = await gameService.cancelGame(request.params.id, request.user.sub)
      return reply.send(game.toPublicJSON())
    },
  })
}

export const gameRoutes = fp(gameRoutesPlugin, { name: 'game-routes' })
