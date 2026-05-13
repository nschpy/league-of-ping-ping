import { Type, type Static } from '@sinclair/typebox'

export const UserSearchResponse = Type.Array(Type.Object({
  id: Type.String(),
  nickname: Type.String(),
  mmr: Type.Integer(),
}))
export type UserSearchResponse_type = Static<typeof UserSearchResponse>

export const ErrorResponse = Type.Object({
  statusCode: Type.Number(),
  error: Type.String(),
  message: Type.String(),
})
