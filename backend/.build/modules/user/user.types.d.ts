import type { IUser } from './user.model.js';
/**
 * Публичное представление пользователя.
 * Используется для всех ответов API — пароль никогда не возвращается.
 */
export type UserPublic = Omit<IUser, 'passwordHash'>;
/** Входные данные для создания нового пользователя */
export interface CreateUserInput {
    displayName: string;
    username: string;
    email: string;
    /** Пароль в открытом виде — хэшируется в `UserService.create`. */
    password: string;
    country?: string;
    avatarColor?: number;
    role?: 'player' | 'referee' | 'admin';
}
/** Поля, доступные для обновления профиля пользователя */
export interface UpdateUserInput {
    displayName?: string;
    username?: string;
    email?: string;
    country?: string;
    bio?: string;
    avatarColor?: number;
}
/** Фильтр для выборки пользователей */
export interface UserFilter {
    role?: 'player' | 'referee' | 'admin';
    search?: string;
    tier?: string;
}
/** Варианты сортировки для списка пользователей */
export type UserSortBy = 'mmr' | 'name' | 'streak' | 'wr';
//# sourceMappingURL=user.types.d.ts.map