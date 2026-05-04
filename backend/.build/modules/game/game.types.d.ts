import type { GameFormat, GameStatus } from './game.model.js';
/** Входные данные для создания новой игры */
export interface CreateGameInput {
    player1Id: string;
    player2Id: string;
    refereeId: string;
    format: GameFormat;
    court?: string;
    scheduledAt?: Date;
    notes?: string;
}
/** Счёт одного сета, передаваемый судьёй */
export interface RecordSetInput {
    player1Score: number;
    player2Score: number;
}
/** Фильтр для выборки игр */
export interface GameFilter {
    status?: GameStatus;
    /** Фильтрует игры, в которых участвует указанный игрок (player1 или player2) */
    playerId?: string;
    refereeId?: string;
    scheduledFrom?: Date;
    scheduledTo?: Date;
}
//# sourceMappingURL=game.types.d.ts.map