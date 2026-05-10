import { UserModel } from '../../core/models/User.js'
import type { IUser } from '../../core/models/User.js'

export async function findByEmail(email: string): Promise<IUser | null> {
  return UserModel.findOne({ email })
}

export async function findByNickname(nickname: string): Promise<IUser | null> {
  return UserModel.findOne({ nickname })
}

export async function findById(id: string): Promise<IUser | null> {
  return UserModel.findById(id)
}

export async function createUser(data: {
  email: string
  nickname: string
  passwordHash: string
}): Promise<IUser> {
  return UserModel.create(data)
}
