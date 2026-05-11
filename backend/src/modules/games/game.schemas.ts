import { Type } from '@fastify/type-provider-typebox'
import type { Static } from '@fastify/type-provider-typebox'

const ObjectIdString = Type.String({ pattern: '^[a-f0-9]{24}$' })

export const CreateGameBody = Type.Object({
  player1Id: ObjectIdString,
  player2Id: ObjectIdString,
  format: Type.Union([Type.Literal('bo1'), Type.Literal('bo3'), Type.Literal('bo5')]),
})

export type CreateGameBody_type = Static<typeof CreateGameBody>

export const AddPointBody = Type.Object({
  scorer: Type.Union([Type.Literal('p1'), Type.Literal('p2')]),
})

export type AddPointBody_type = Static<typeof AddPointBody>

export const FinalizeSetBody = Type.Object({
  player1Score: Type.Integer({ minimum: 0 }),
  player2Score: Type.Integer({ minimum: 0 }),
})

export type FinalizeSetBody_type = Static<typeof FinalizeSetBody>

const PlayerSnapshot = Type.Object({
  id: Type.String(),
  nickname: Type.String(),
  mmr: Type.Number(),
})

const SetEntryResponse = Type.Object({
  player1Score: Type.Number(),
  player2Score: Type.Number(),
  points: Type.Array(
    Type.Object({
      scorer: Type.Union([Type.Literal('p1'), Type.Literal('p2')]),
      at: Type.String(),
    }),
  ),
  completedAt: Type.Optional(Type.String()),
})

export const GameResponse = Type.Object({
  id: Type.String(),
  status: Type.Union([
    Type.Literal('in_progress'),
    Type.Literal('completed'),
    Type.Literal('cancelled'),
  ]),
  format: Type.Union([Type.Literal('bo1'), Type.Literal('bo3'), Type.Literal('bo5')]),
  player1: PlayerSnapshot,
  player2: PlayerSnapshot,
  referee: PlayerSnapshot,
  sets: Type.Array(SetEntryResponse),
  winnerId: Type.Union([Type.String(), Type.Null()]),
  player1MmrBefore: Type.Number(),
  player2MmrBefore: Type.Number(),
  player1MmrChange: Type.Union([Type.Number(), Type.Null()]),
  player2MmrChange: Type.Union([Type.Number(), Type.Null()]),
  startedAt: Type.String(),
  completedAt: Type.Union([Type.String(), Type.Null()]),
  cancelledAt: Type.Union([Type.String(), Type.Null()]),
})

export type GameResponse_type = Static<typeof GameResponse>

export const ErrorResponse = Type.Object({
  statusCode: Type.Number(),
  error: Type.String(),
  message: Type.String(),
})

export type ErrorResponse_type = Static<typeof ErrorResponse>

// Re-export PlayerSnapshot for potential reuse
export { PlayerSnapshot, SetEntryResponse }
