import { Schema, model } from 'mongoose';
const setSchema = new Schema({
    setNumber: { type: Number, required: true },
    player1Score: { type: Number, required: true, min: 0 },
    player2Score: { type: Number, required: true, min: 0 },
    winnerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
}, { _id: false });
const gameSchema = new Schema({
    player1Id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    player2Id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    refereeId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    format: {
        type: String,
        enum: ['bo1', 'bo3', 'bo5'],
        required: true,
    },
    status: {
        type: String,
        enum: ['pending', 'in_progress', 'completed', 'cancelled'],
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
}, {
    timestamps: true,
    toJSON: {
        transform: (_doc, ret) => {
            delete ret['__v'];
            return ret;
        },
    },
});
gameSchema.index({ status: 1, createdAt: -1 });
gameSchema.index({ status: 1, scheduledAt: 1 });
gameSchema.index({ player1Id: 1, createdAt: -1 });
gameSchema.index({ player2Id: 1, createdAt: -1 });
gameSchema.index({ refereeId: 1, createdAt: -1 });
export const GameModel = model('Game', gameSchema);
//# sourceMappingURL=game.model.js.map