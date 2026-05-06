import { UserRepository } from '../user/user.repository.js';
import { MmrCoreService } from '../game/game.mmr-core.service.js';
import { MmrService } from './mmr.service.js';

const userRepository = new UserRepository();
const mmrCoreService = new MmrCoreService();

export const mmrService = new MmrService(userRepository, mmrCoreService);

export { MmrService };
export type { MmrForecast } from './mmr.service.js';
