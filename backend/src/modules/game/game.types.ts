import type { GameFormat, GameStatus } from './game.model.js';

export interface CreateGameInput {
  player1Id: string;
  player2Id: string;
  refereeId: string;
  format: GameFormat;
}

export interface RecordSetInput {
  player1Score: number;
  player2Score: number;
}

export interface GameFilter {
  status?: GameStatus;
  playerId?: string;
  refereeId?: string;
}
