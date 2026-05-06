import { Schema, model, type Types } from 'mongoose';

/**
 * Интерфейс документа пользователя в коллекции `users`.
 * Соответствует схеме MongoDB, определённой в userSchema.
 */
export interface IUser {
  _id: Types.ObjectId;
  /** Отображаемое имя (Full name) */
  displayName: string;
  /** Уникальный handle (3-30 символов, a-zA-Z0-9_-) */
  username: string;
  /** Уникальный email */
  email: string;
  /** Хэш пароля (bcrypt). Никогда не возвращается через API. */
  passwordHash: string;
  /** ISO 3166-1 alpha-2 код страны (необязательно) */
  country?: string;
  /** Краткое описание игрока */
  bio?: string;
  /** Индекс цвета аватара (0-5) */
  avatarColor: number;
  /** Рейтинг MMR. Стартовое значение — 1000. */
  mmr: number;
  /** Максимальный достигнутый MMR */
  peakMmr: number;
  /** Количество побед */
  wins: number;
  /** Количество поражений */
  losses: number;
  /** Текущая серия: >0 — победная, <0 — проигрышная */
  streak: number;
  /** Последние до 6 результатов: "W" или "L" */
  recentResults: string;
  /** Роль пользователя в системе */
  role: 'player' | 'referee' | 'admin';
  createdAt: Date;
  updatedAt: Date;
}

/** Тип роли пользователя */
export type UserRole = IUser['role'];

const userSchema = new Schema<IUser>(
  {
    displayName: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
      maxlength: 60,
    },
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
    country: {
      type: String,
      trim: true,
      uppercase: true,
      match: /^[A-Z]{2}$/,
    },
    bio: {
      type: String,
      trim: true,
      maxlength: 280,
    },
    avatarColor: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
      max: 5,
    },
    mmr: {
      type: Number,
      required: true,
      default: 1000,
      min: 0,
    },
    peakMmr: {
      type: Number,
      required: true,
      default: 1000,
      min: 0,
    },
    wins: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
    losses: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
    streak: {
      type: Number,
      required: true,
      default: 0,
    },
    recentResults: {
      type: String,
      default: '',
      maxlength: 6,
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
userSchema.index({ peakMmr: -1 });

export const UserModel = model<IUser>('User', userSchema);
