import { Schema, model } from 'mongoose'
import type { Document, Types } from 'mongoose'
import type { GameFormat } from '../../modules/games/game.scoring.js'

export interface PublicGame {
  id: string
  status: 'in_progress' | 'completed' | 'cancelled'
  format: GameFormat
  player1: { id: string; nickname: string; mmr: number }
  player2: { id: string; nickname: string; mmr: number }
  referee: { id: string; nickname: string; mmr: number }
  sets: Array<{
    player1Score: number
    player2Score: number
    points: Array<{ scorer: 'p1' | 'p2'; at: string }>
    completedAt?: string
  }>
  winnerId: string | null
  player1MmrBefore: number
  player2MmrBefore: number
  player1MmrChange: number | null
  player2MmrChange: number | null
  startedAt: string
  completedAt: string | null
  cancelledAt: string | null
}

export interface IPointEntry {
  scorer: 'p1' | 'p2'
  at: Date
}

export interface ISetEntry {
  player1Score: number
  player2Score: number
  points: IPointEntry[]
  completedAt?: Date
}

export interface IGame extends Document {
  player1Id: Types.ObjectId
  player2Id: Types.ObjectId
  refereeId: Types.ObjectId
  format: GameFormat
  status: 'in_progress' | 'completed' | 'cancelled'
  sets: ISetEntry[]
  winnerId: Types.ObjectId | null
  player1MmrBefore: number
  player2MmrBefore: number
  player1MmrChange: number | null
  player2MmrChange: number | null
  startedAt: Date
  completedAt: Date | null
  cancelledAt: Date | null
  toPublicJSON(): PublicGame
}

const pointEntrySchema = new Schema<IPointEntry>(
  {
    scorer: {
      type: String,
      enum: ['p1', 'p2'],
      required: true,
    },
    at: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false },
)

const setEntrySchema = new Schema<ISetEntry>(
  {
    player1Score: {
      type: Number,
      default: 0,
    },
    player2Score: {
      type: Number,
      default: 0,
    },
    points: {
      type: [pointEntrySchema],
      default: [],
    },
    completedAt: {
      type: Date,
    },
  },
  { _id: false },
)

const gameSchema = new Schema<IGame>(
  {
    player1Id: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    player2Id: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    refereeId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    format: {
      type: String,
      enum: ['bo1', 'bo3', 'bo5'],
      required: true,
    },
    status: {
      type: String,
      enum: ['in_progress', 'completed', 'cancelled'],
      default: 'in_progress',
    },
    sets: {
      type: [setEntrySchema],
      default: [],
    },
    winnerId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    player1MmrBefore: {
      type: Number,
      required: true,
    },
    player2MmrBefore: {
      type: Number,
      required: true,
    },
    player1MmrChange: {
      type: Number,
      default: null,
    },
    player2MmrChange: {
      type: Number,
      default: null,
    },
    startedAt: {
      type: Date,
      default: Date.now,
    },
    completedAt: {
      type: Date,
      default: null,
    },
    cancelledAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true },
)

gameSchema.methods['toPublicJSON'] = function (this: IGame): PublicGame {
  const snap = (field: unknown) => {
    if (field && typeof field === 'object' && 'nickname' in field) {
      const u = field as { _id: { toString(): string }; nickname: string; mmr: number }
      return { id: u._id.toString(), nickname: u.nickname, mmr: u.mmr }
    }
    return { id: String(field), nickname: '', mmr: 0 }
  }

  return {
    id: (this._id as { toString(): string }).toString(),
    status: this.status,
    format: this.format,
    player1: snap(this.player1Id),
    player2: snap(this.player2Id),
    referee: snap(this.refereeId),
    sets: this.sets.map((s) => {
      const set: PublicGame['sets'][number] = {
        player1Score: s.player1Score,
        player2Score: s.player2Score,
        points: s.points.map((p) => ({
          scorer: p.scorer,
          at: p.at.toISOString(),
        })),
      }
      if (s.completedAt !== undefined) {
        set.completedAt = s.completedAt.toISOString()
      }
      return set
    }),
    winnerId: this.winnerId !== null ? this.winnerId.toString() : null,
    player1MmrBefore: this.player1MmrBefore,
    player2MmrBefore: this.player2MmrBefore,
    player1MmrChange: this.player1MmrChange,
    player2MmrChange: this.player2MmrChange,
    startedAt: this.startedAt.toISOString(),
    completedAt: this.completedAt !== null ? this.completedAt.toISOString() : null,
    cancelledAt: this.cancelledAt !== null ? this.cancelledAt.toISOString() : null,
  }
}

export const GameModel = model<IGame>('Game', gameSchema)
