import { GameRepository } from './game.repository.js';
import { GameService } from './game.service.js';
import { userService } from '../user/index.js';

const repository = new GameRepository();
export const gameService = new GameService(repository, userService);

export { GameService };
export type { IGame, ISet, GameFormat, GameStatus } from './game.model.js';
export type { CreateGameInput, RecordSetInput, GameFilter } from './game.types.js';
export {
  GameNotFoundError,
  InvalidStateTransitionError,
  InvalidSetScoreError,
  SetLimitExceededError,
} from './game.errors.js';
