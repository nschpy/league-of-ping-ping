import { GameService } from './game.service.js';
/** Экземпляр сервиса игр (singleton) */
export declare const gameService: GameService;
export { GameService };
export type { IGame, ISet, GameFormat, GameStatus } from './game.model.js';
export type { CreateGameInput, RecordSetInput, GameFilter } from './game.types.js';
export { GameNotFoundError, InvalidStateTransitionError, InvalidSetScoreError, SetLimitExceededError, } from './game.errors.js';
//# sourceMappingURL=index.d.ts.map