import { Schema, model, type Types } from 'mongoose';

export interface ISet {
  setNumber: number;
  player1Score: number;
  player2Score: number;
  winnerId: Types.ObjectId;
}

export interface IGame {
  _id: Types.ObjectId;
  player1Id: Types.ObjectId;
  player2Id: Types.ObjectId;
  refereeId: Types.ObjectId;
  format: 'bo1' | 'bo3' | 'bo5';
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  sets: ISet[];
  winnerId: Types.ObjectId | null;
  player1MmrChange: number | null;
  player2MmrChange: number | null;
  player1MmrBefore: number | null;
  player2MmrBefore: number | null;
  startedAt: Date | null;
  completedAt: Date | null;
  cancelledAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export type GameFormat = IGame['format'];
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
gameSchema.index({ player1Id: 1, createdAt: -1 });
gameSchema.index({ player2Id: 1, createdAt: -1 });
gameSchema.index({ refereeId: 1, createdAt: -1 });

export const GameModel = model<IGame>('Game', gameSchema);
