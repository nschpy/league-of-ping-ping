import { type Types } from 'mongoose';
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
export declare const UserModel: import("mongoose").Model<IUser, {}, {}, {}, import("mongoose").Document<unknown, {}, IUser, {}, {}> & IUser & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=user.model.d.ts.map