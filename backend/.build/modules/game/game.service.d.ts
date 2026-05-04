import { GameRepository } from './game.repository.js';
import type { IGame } from './game.model.js';
import type { CreateGameInput, RecordSetInput, GameFilter } from './game.types.js';
import type { UserService } from '../user/user.service.js';
import type { PaginationQuery, PaginationResult } from '../../shared/pagination.js';
import type { MmrCoreService } from './game.mmr-core.service.js';
/**
 * Сервис игр.
 * Содержит бизнес-логику: создание матчей, запись сетов, управление жизненным циклом,
 * расчёт и применение MMR изменений.
 */
export declare class GameService {
    private readonly repo;
    private readonly userService;
    private readonly mmrCoreService;
    constructor(repo: GameRepository, userService: UserService, mmrCoreService: MmrCoreService);
    create(input: CreateGameInput): Promise<IGame>;
    findById(id: string): Promise<IGame | null>;
    findAll(filter: GameFilter, page: PaginationQuery): Promise<PaginationResult<IGame>>;
    start(id: string): Promise<IGame>;
    recordSet(id: string, input: RecordSetInput): Promise<IGame>;
    cancel(id: string): Promise<IGame>;
    delete(id: string): Promise<void>;
}
//# sourceMappingURL=game.service.d.ts.map