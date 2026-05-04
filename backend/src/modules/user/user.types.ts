import type { IUser } from './user.model.js';

export type UserPublic = Omit<IUser, 'passwordHash'>;

export interface CreateUserInput {
  username: string;
  email: string;
  password: string;
  role?: 'player' | 'referee' | 'admin';
}

export interface UpdateUserInput {
  username?: string;
  email?: string;
}

export interface UserFilter {
  role?: 'player' | 'referee' | 'admin';
}
