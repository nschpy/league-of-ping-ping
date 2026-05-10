import { Schema, model } from 'mongoose'
import type { Document } from 'mongoose'

export interface PublicUser {
  id: string
  email: string
  nickname: string
  mmr: number
  role: string
}

export interface IUser extends Document {
  email: string
  nickname: string
  passwordHash: string
  mmr: number
  role: 'user' | 'admin'
  toPublicJSON(): PublicUser
}

const userSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    nickname: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 3,
      maxlength: 20,
    },
    passwordHash: {
      type: String,
      required: true,
    },
    mmr: {
      type: Number,
      default: 1000,
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
  },
  { timestamps: true },
)

userSchema.methods['toPublicJSON'] = function (this: IUser): PublicUser {
  return {
    id: (this._id as { toString(): string }).toString(),
    email: this.email,
    nickname: this.nickname,
    mmr: this.mmr,
    role: this.role,
  }
}

export const UserModel = model<IUser>('User', userSchema)
