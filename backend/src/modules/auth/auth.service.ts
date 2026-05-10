import type { FastifyInstance } from 'fastify'
import { hashPassword, verifyPassword } from '../../utils/password.js'
import { conflict, unauthorized } from '../../utils/errors.js'
import * as authRepository from './auth.repository.js'
import type { RegisterBody_type, LoginBody_type } from './auth.schemas.js'
import type { PublicUser } from '../../core/models/User.js'

interface AuthResult {
  token: string
  user: PublicUser
}

export async function register(
  body: RegisterBody_type,
  app: FastifyInstance,
): Promise<AuthResult> {
  const existingEmail = await authRepository.findByEmail(body.email)
  if (existingEmail !== null) {
    throw conflict('Email is already in use')
  }

  const existingNickname = await authRepository.findByNickname(body.nickname)
  if (existingNickname !== null) {
    throw conflict('Nickname is already in use')
  }

  const passwordHash = await hashPassword(body.password)
  const user = await authRepository.createUser({
    email: body.email,
    nickname: body.nickname,
    passwordHash,
  })

  const publicUser = user.toPublicJSON()
  const token = app.jwt.sign(
    { sub: publicUser.id, email: publicUser.email, nickname: publicUser.nickname, role: publicUser.role },
    { expiresIn: '1d' },
  )

  return { token, user: publicUser }
}

export async function login(
  body: LoginBody_type,
  app: FastifyInstance,
): Promise<AuthResult> {
  const user = await authRepository.findByEmail(body.email)
  if (user === null) {
    throw unauthorized('Invalid email or password')
  }

  const valid = await verifyPassword(body.password, user.passwordHash)
  if (!valid) {
    throw unauthorized('Invalid email or password')
  }

  const publicUser = user.toPublicJSON()
  const expiresIn = body.rememberMe === true ? '30d' : '1d'
  const token = app.jwt.sign(
    { sub: publicUser.id, email: publicUser.email, nickname: publicUser.nickname, role: publicUser.role },
    { expiresIn },
  )

  return { token, user: publicUser }
}
