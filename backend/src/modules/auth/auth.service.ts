import { hashPassword, verifyPassword } from '../../utils/password.js'
import { conflict, unauthorized } from '../../utils/errors.js'
import * as authRepository from './auth.repository.js'
import type { RegisterBody_type, LoginBody_type } from './auth.schemas.js'
import type { PublicUser } from '../../core/models/User.js'

interface AuthResult {
  user: PublicUser
}

export async function register(
  body: RegisterBody_type,
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

  let user
  try {
    user = await authRepository.createUser({
      email: body.email,
      nickname: body.nickname,
      passwordHash,
    })
  } catch (err) {
    if (err instanceof Error && 'code' in err && (err as { code: unknown }).code === 11000) {
      throw conflict('Email or nickname is already in use')
    }
    throw err
  }

  return { user: user.toPublicJSON() }
}

export async function login(
  body: LoginBody_type,
): Promise<AuthResult> {
  const user = await authRepository.findByEmail(body.email)
  if (user === null) {
    throw unauthorized('Invalid email or password')
  }

  const valid = await verifyPassword(body.password, user.passwordHash)
  if (!valid) {
    throw unauthorized('Invalid email or password')
  }

  return { user: user.toPublicJSON() }
}
