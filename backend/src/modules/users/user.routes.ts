import fp from 'fastify-plugin'
import type { FastifyInstance } from 'fastify'
import type { TypeBoxTypeProvider } from '@fastify/type-provider-typebox'
import { Type } from '@sinclair/typebox'
import { Types } from 'mongoose'
import { UserModel } from '../../core/models/User.js'
import {
  UserSearchResponse,
  UserByIdResponse,
  ErrorResponse,
  MeStatsResponse,
  RecentGamesResponse,
  LiveGameResponse,
  ChallengeSuggestionsResponse,
  LeaderboardResponse,
} from './user.schemas.js'
import { UserService } from './user.service.js'

async function userRoutesPlugin(app: FastifyInstance): Promise<void> {
  const typedApp = app.withTypeProvider<TypeBoxTypeProvider>()

  // -------------------------------------------------------------------------
  // GET /users/search
  // -------------------------------------------------------------------------
  typedApp.get('/users/search', {
    schema: {
      querystring: Type.Object({
        q: Type.String({ minLength: 2 }),
        limit: Type.Optional(Type.String({ pattern: '^(?:[1-9]|1\\d|2[0-5])$' })),
        excludeSelf: Type.Optional(
          Type.Union([Type.Literal('true'), Type.Literal('false')]),
        ),
      }),
      response: {
        200: UserSearchResponse,
        400: ErrorResponse,
        401: ErrorResponse,
      },
      tags: ['users'],
    },
    onRequest: app.authenticate,
    handler: async (request, reply) => {
      const { q, limit, excludeSelf } = request.query
      const safeLimit = limit ? Number.parseInt(limit, 10) : 10
      const escaped = q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
      const filter: Record<string, unknown> = {
        nickname: { $regex: escaped, $options: 'i' },
      }
      if (excludeSelf === 'true') {
        filter._id = { $ne: new Types.ObjectId(request.user.sub) }
      }
      const results = await UserModel.find(filter, 'nickname mmr').limit(safeLimit).lean()
      return reply.send(results.map((u) => ({ id: u._id.toString(), nickname: u.nickname, mmr: u.mmr })))
    },
  })

  // -------------------------------------------------------------------------
  // GET /users/:id
  // -------------------------------------------------------------------------
  typedApp.get('/users/:id', {
    schema: {
      params: Type.Object({
        id: Type.String({ pattern: '^[0-9a-fA-F]{24}$' }),
      }),
      response: {
        200: UserByIdResponse,
        400: ErrorResponse,
        401: ErrorResponse,
        404: ErrorResponse,
      },
      tags: ['users'],
    },
    onRequest: app.authenticate,
    handler: async (request, reply) => {
      const { id } = request.params
      const user = await UserModel.findById(id, 'nickname mmr').lean()
      if (!user) {
        return reply.status(404).send({
          statusCode: 404,
          error: 'NOT_FOUND',
          message: 'User not found',
        })
      }
      return reply.send({ id: user._id.toString(), nickname: user.nickname, mmr: user.mmr })
    },
  })

  // -------------------------------------------------------------------------
  // GET /users/me/stats
  // -------------------------------------------------------------------------
  typedApp.get('/users/me/stats', {
    schema: {
      response: {
        200: MeStatsResponse,
        401: ErrorResponse,
        404: ErrorResponse,
      },
      tags: ['users'],
    },
    onRequest: app.authenticate,
    handler: async (request, reply) => {
      const userId = request.user.sub
      const stats = await UserService.getMeStats(userId)
      return reply.send(stats)
    },
  })

  // -------------------------------------------------------------------------
  // GET /users/me/games/recent
  // -------------------------------------------------------------------------
  typedApp.get('/users/me/games/recent', {
    schema: {
      querystring: Type.Object({
        limit: Type.Optional(Type.String({ pattern: '^(?:[1-9]|[1-9]\\d|100)$' })),
        outcome: Type.Optional(Type.Union([Type.Literal('win'), Type.Literal('loss')])),
      }),
      response: {
        200: RecentGamesResponse,
        401: ErrorResponse,
      },
      tags: ['users'],
    },
    onRequest: app.authenticate,
    handler: async (request, reply) => {
      const userId = request.user.sub
      const limit = request.query.limit ? Math.min(Number.parseInt(request.query.limit, 10), 100) : 5
      const outcome = request.query.outcome
      const result = await UserService.getRecentGames(userId, limit, outcome)
      return reply.send(result)
    },
  })

  // -------------------------------------------------------------------------
  // GET /users/me/games/live
  // -------------------------------------------------------------------------
  typedApp.get('/users/me/games/live', {
    schema: {
      response: {
        200: LiveGameResponse,
        401: ErrorResponse,
      },
      tags: ['users'],
    },
    onRequest: app.authenticate,
    handler: async (request, reply) => {
      const userId = request.user.sub
      const result = await UserService.getLiveGame(userId)
      return reply.send(result)
    },
  })

  // -------------------------------------------------------------------------
  // GET /users/me/challenges/suggestions
  // -------------------------------------------------------------------------
  typedApp.get('/users/me/challenges/suggestions', {
    schema: {
      querystring: Type.Object({
        limit: Type.Optional(Type.String({ pattern: '^(?:[1-9]|10)$' })),
      }),
      response: {
        200: ChallengeSuggestionsResponse,
        401: ErrorResponse,
        404: ErrorResponse,
      },
      tags: ['users'],
    },
    onRequest: app.authenticate,
    handler: async (request, reply) => {
      const userId = request.user.sub
      const limit = request.query.limit ? Math.min(Number.parseInt(request.query.limit, 10), 10) : 3
      const result = await UserService.getChallengeSuggestions(userId, limit)
      return reply.send(result)
    },
  })

  // -------------------------------------------------------------------------
  // GET /leaderboard
  // -------------------------------------------------------------------------
  typedApp.get('/leaderboard', {
    schema: {
      querystring: Type.Object({
        limit: Type.Optional(Type.String({ pattern: '^(?:[1-9]|1[0-9]|20)$' })),
      }),
      response: {
        200: LeaderboardResponse,
        401: ErrorResponse,
      },
      tags: ['users'],
    },
    onRequest: app.authenticate,
    handler: async (request, reply) => {
      const userId = request.user.sub
      const limit = request.query.limit ? Math.min(Number.parseInt(request.query.limit, 10), 20) : 5
      const result = await UserService.getLeaderboard(userId, limit)
      return reply.send(result)
    },
  })
}

export const userRoutes = fp(userRoutesPlugin, { name: 'user-routes' })
