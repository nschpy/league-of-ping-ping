import fp from 'fastify-plugin'
import type { FastifyInstance } from 'fastify'
import type { TypeBoxTypeProvider } from '@fastify/type-provider-typebox'
import { Type } from '@sinclair/typebox'
import { UserModel } from '../../core/models/User.js'
import { UserSearchResponse, ErrorResponse } from './user.schemas.js'

async function userRoutesPlugin(app: FastifyInstance): Promise<void> {
  const typedApp = app.withTypeProvider<TypeBoxTypeProvider>()

  typedApp.get('/users/search', {
    schema: {
      querystring: Type.Object({
        q: Type.String({ minLength: 2 }),
        limit: Type.Optional(Type.Integer({ minimum: 1, maximum: 25, default: 10 })),
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
      const { q, limit = 10 } = request.query
      const escaped = q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
      const results = await UserModel.find(
        { nickname: { $regex: escaped, $options: 'i' }, _id: { $ne: request.user.sub } },
        'nickname mmr',
      ).limit(limit).lean()
      return reply.send(results.map((u) => ({ id: u._id.toString(), nickname: u.nickname, mmr: u.mmr })))
    },
  })
}

export const userRoutes = fp(userRoutesPlugin, { name: 'user-routes' })
