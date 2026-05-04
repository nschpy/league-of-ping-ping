import { GameRepository } from './game.repository.js';
import { GameService } from './game.service.js';
import { MmrCoreService } from './game.mmr-core.service.js';
import { userService } from '../user/index.js';
const repository = new GameRepository();
const mmrCoreService = new MmrCoreService();
/** Экземпляр сервиса игр (singleton) */
export const gameService = new GameService(repository, userService, mmrCoreService);
export { GameService };
export { GameNotFoundError, InvalidStateTransitionError, InvalidSetScoreError, SetLimitExceededError, } from './game.errors.js';
//# sourceMappingURL=index.js.map