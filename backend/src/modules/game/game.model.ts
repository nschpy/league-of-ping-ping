import { Schema, model, type Types } from 'mongoose';

/** Результат одного сета (встроенный документ внутри `IGame`) */
export interface ISet {
  /** Номер сета в матче (1, 2, 3...) */
  setNumber: number;
  /** Количество очков игрока 1 в этом сете */
  player1Score: number;
  /** Количество очков игрока 2 в этом сете */
  player2Score: number;
  /** ID победителя сета */
  winnerId: Types.ObjectId;
}

/**
 * Интерфейс документа игры в коллекции `games`.
 */
export interface IGame {
  /** Уникальный идентификатор игры */
  _id: Types.ObjectId;
  /** ID первого игрока */
  player1Id: Types.ObjectId;
  /** ID второго игрока */
  player2Id: Types.ObjectId;
  /** ID судьи, ведущего матч */
  refereeId: Types.ObjectId;
  /** Формат матча: bo1 (1 сет), bo3 (до 2 побед), bo5 (до 3 побед) */
  format: 'bo1' | 'bo3' | 'bo5';
  /** Статус жизненного цикла игры */
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  /** Массив сыгранных сетов */
  sets: ISet[];
  /** ID победителя матча (null до завершения) */
  winnerId: Types.ObjectId | null;
  /** Изменение MMR игрока 1 после завершения (null до завершения) */
  player1MmrChange: number | null;
  /** Изменение MMR игрока 2 после завершения (null до завершения) */
  player2MmrChange: number | null;
  /** MMR игрока 1 перед началом игры (нужен для истории рейтинга) */
  player1MmrBefore: number | null;
  /** MMR игрока 2 перед началом игры (нужен для истории рейтинга) */
  player2MmrBefore: number | null;
  /** Запланированное время начала (null = начать немедленно) */
  scheduledAt: Date | null;
  /** Корт проведения матча */
  court: string | null;
  /** Дополнительные заметки рефери */
  notes: string | null;
  /** Время начала игры */
  startedAt: Date | null;
  /** Время завершения игры */
  completedAt: Date | null;
  /** Время отмены игры */
  cancelledAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

/** Тип формата игры */
export type GameFormat = IGame['format'];
/** Тип статуса игры */
export type GameStatus = IGame['status'];

const setSchema = new Schema<ISet>(
  {
    setNumber: { type: Number, required: true },
    player1Score: { type: Number, required: true, min: 0 },
    player2Score: { type: Number, required: true, min: 0 },
    winnerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { _id: false },
);

const gameSchema = new Schema<IGame>(
  {
    player1Id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    player2Id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    refereeId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    format: {
      type: String,
      enum: ['bo1', 'bo3', 'bo5'] satisfies GameFormat[],
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'in_progress', 'completed', 'cancelled'] satisfies GameStatus[],
      required: true,
      default: 'pending',
    },
    sets: { type: [setSchema], default: [] },
    winnerId: { type: Schema.Types.ObjectId, ref: 'User', default: null },
    player1MmrChange: { type: Number, default: null },
    player2MmrChange: { type: Number, default: null },
    player1MmrBefore: { type: Number, default: null },
    player2MmrBefore: { type: Number, default: null },
    scheduledAt: { type: Date, default: null },
    court: { type: String, trim: true, default: null },
    notes: { type: String, trim: true, maxlength: 500, default: null },
    startedAt: { type: Date, default: null },
    completedAt: { type: Date, default: null },
    cancelledAt: { type: Date, default: null },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (_doc, ret: Record<string, unknown>) => {
        delete ret['__v'];
        return ret;
      },
    },
  },
);

gameSchema.index({ status: 1, createdAt: -1 });
gameSchema.index({ status: 1, scheduledAt: 1 });
gameSchema.index({ player1Id: 1, createdAt: -1 });
gameSchema.index({ player2Id: 1, createdAt: -1 });
gameSchema.index({ refereeId: 1, createdAt: -1 });

export const GameModel = model<IGame>('Game', gameSchema);
