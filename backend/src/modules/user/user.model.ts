import { Schema, model, type Types } from 'mongoose';

export interface IUser {
  _id: Types.ObjectId;
  username: string;
  email: string;
  passwordHash: string;
  mmr: number;
  role: 'player' | 'referee' | 'admin';
  createdAt: Date;
  updatedAt: Date;
}

export type UserRole = IUser['role'];

const userSchema = new Schema<IUser>(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 3,
      maxlength: 30,
      match: /^[a-zA-Z0-9_-]+$/,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    },
    passwordHash: {
      type: String,
      required: true,
    },
    mmr: {
      type: Number,
      required: true,
      default: 1000,
      min: 0,
    },
    role: {
      type: String,
      enum: ['player', 'referee', 'admin'] satisfies UserRole[],
      required: true,
      default: 'player',
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (_doc, ret: Record<string, unknown>) => {
        delete ret['passwordHash'];
        delete ret['__v'];
        return ret;
      },
    },
  },
);

userSchema.index({ mmr: -1 });

export const UserModel = model<IUser>('User', userSchema);
