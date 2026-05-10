import { Type } from '@fastify/type-provider-typebox'
import type { Static } from '@fastify/type-provider-typebox'

export const RegisterBody = Type.Object({
  email: Type.String({ format: 'email', maxLength: 255 }),
  nickname: Type.String({
    minLength: 3,
    maxLength: 20,
    pattern: '^[a-zA-Z0-9._-]+$',
  }),
  password: Type.String({ minLength: 8, maxLength: 100 }),
})

export type RegisterBody_type = Static<typeof RegisterBody>

export const LoginBody = Type.Object({
  email: Type.String({ format: 'email' }),
  password: Type.String({ minLength: 8, maxLength: 100 }),
  rememberMe: Type.Optional(Type.Boolean()),
})

export type LoginBody_type = Static<typeof LoginBody>

const PublicUserSchema = Type.Object({
  id: Type.String(),
  email: Type.String(),
  nickname: Type.String(),
  mmr: Type.Number(),
  role: Type.String(),
})

export const AuthResponse = Type.Object({
  token: Type.String(),
  user: PublicUserSchema,
})

export const MeResponse = PublicUserSchema

export const ErrorResponse = Type.Object({
  statusCode: Type.Number(),
  error: Type.String(),
  message: Type.String(),
})
