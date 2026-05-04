import type { UserPublic } from '../user/user.types.js';
export interface SignUpInput {
    displayName: string;
    username: string;
    email: string;
    password: string;
    country?: string;
    avatarColor?: number;
    role?: 'player' | 'referee' | 'admin';
}
export interface SignInInput {
    email: string;
    password: string;
}
export interface AuthResponse {
    token: string;
    user: UserPublic;
}
//# sourceMappingURL=auth.types.d.ts.map