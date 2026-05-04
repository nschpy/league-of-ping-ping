import { Schema, model } from 'mongoose';
const userSchema = new Schema({
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
        required: true,
        default: '',
        maxlength: 6,
    },
    role: {
        type: String,
        enum: ['player', 'referee', 'admin'],
        required: true,
        default: 'player',
    },
}, {
    timestamps: true,
    toJSON: {
        transform: (_doc, ret) => {
            delete ret['passwordHash'];
            delete ret['__v'];
            return ret;
        },
    },
});
userSchema.index({ mmr: -1 });
userSchema.index({ peakMmr: -1 });
export const UserModel = model('User', userSchema);
//# sourceMappingURL=user.model.js.map