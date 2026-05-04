import { Types } from 'mongoose';
import { GameRepository } from './game.repository.js';
import { GameNotFoundError, InvalidStateTransitionError, InvalidSetScoreError, SetLimitExceededError, } from './game.errors.js';
import { isValidSetScore, requiredWins, maxSets, tallyWins, isWinCondition, } from './game.state.js';
import { UserNotFoundError } from '../user/user.errors.js';
import { ValidationError } from '../../shared/errors.js';
import { toObjectId } from '../../shared/ids.js';
/**
 * Сервис игр.
 * Содержит бизнес-логику: создание матчей, запись сетов, управление жизненным циклом,
 * расчёт и применение MMR изменений.
 */
export class GameService {
    repo;
    userService;
    mmrCoreService;
    constructor(repo, userService, mmrCoreService) {
        this.repo = repo;
        this.userService = userService;
        this.mmrCoreService = mmrCoreService;
    }
    async create(input) {
        if (input.player1Id === input.player2Id) {
            throw new ValidationError('A player cannot play against themselves');
        }
        const [player1, player2, referee] = await Promise.all([
            this.userService.findById(input.player1Id),
            this.userService.findById(input.player2Id),
            this.userService.findById(input.refereeId),
        ]);
        if (!player1)
            throw new UserNotFoundError(input.player1Id);
        if (player1.role !== 'player')
            throw new ValidationError(`User ${input.player1Id} is not a player`);
        if (!player2)
            throw new UserNotFoundError(input.player2Id);
        if (player2.role !== 'player')
            throw new ValidationError(`User ${input.player2Id} is not a player`);
        if (!referee)
            throw new UserNotFoundError(input.refereeId);
        if (referee.role !== 'referee' && referee.role !== 'admin') {
            throw new ValidationError(`User ${input.refereeId} is not a referee`);
        }
        return this.repo.create({
            player1Id: toObjectId(input.player1Id),
            player2Id: toObjectId(input.player2Id),
            refereeId: toObjectId(input.refereeId),
            format: input.format,
            status: 'pending',
            sets: [],
            winnerId: null,
            player1MmrChange: null,
            player2MmrChange: null,
            player1MmrBefore: null,
            player2MmrBefore: null,
            scheduledAt: input.scheduledAt ?? null,
            court: input.court ?? null,
            notes: input.notes ?? null,
            startedAt: null,
            completedAt: null,
            cancelledAt: null,
        });
    }
    async findById(id) {
        return this.repo.findById(id);
    }
    async findAll(filter, page) {
        return this.repo.findAll(filter, page);
    }
    async start(id) {
        const game = await this.repo.findById(id);
        if (!game)
            throw new GameNotFoundError(id);
        if (game.status !== 'pending')
            throw new InvalidStateTransitionError(game.status, 'start');
        const updated = await this.repo.updateStatus(game._id, 'in_progress', {
            startedAt: new Date(),
        });
        if (!updated)
            throw new GameNotFoundError(id);
        return updated;
    }
    async recordSet(id, input) {
        const game = await this.repo.findById(id);
        if (!game)
            throw new GameNotFoundError(id);
        if (game.status !== 'in_progress') {
            throw new InvalidStateTransitionError(game.status, 'record set');
        }
        if (!isValidSetScore(input.player1Score, input.player2Score)) {
            throw new InvalidSetScoreError(input.player1Score, input.player2Score);
        }
        const currentSetsCount = game.sets.length;
        if (currentSetsCount >= maxSets(game.format)) {
            throw new SetLimitExceededError(game.format);
        }
        const setWinnerId = input.player1Score > input.player2Score
            ? game.player1Id
            : game.player2Id;
        const newSet = {
            setNumber: currentSetsCount + 1,
            player1Score: input.player1Score,
            player2Score: input.player2Score,
            winnerId: setWinnerId,
        };
        const allSets = [...game.sets, newSet];
        const gameOver = isWinCondition(allSets, game.player1Id, game.format) ||
            isWinCondition(allSets, game.player2Id, game.format);
        if (gameOver) {
            const p1Wins = tallyWins(allSets, game.player1Id);
            const gameWinnerId = p1Wins >= requiredWins(game.format)
                ? game.player1Id
                : game.player2Id;
            const [player1, player2] = await Promise.all([
                this.userService.findById(game.player1Id.toString()),
                this.userService.findById(game.player2Id.toString()),
            ]);
            if (!player1)
                throw new UserNotFoundError(game.player1Id.toString());
            if (!player2)
                throw new UserNotFoundError(game.player2Id.toString());
            const p1IsWinner = gameWinnerId.equals(game.player1Id);
            const { winnerDelta, loserDelta } = this.mmrCoreService.calculateDeltas(p1IsWinner ? player1.mmr : player2.mmr, p1IsWinner ? player2.mmr : player1.mmr, game.format);
            const player1MmrChange = p1IsWinner ? winnerDelta : loserDelta;
            const player2MmrChange = p1IsWinner ? loserDelta : winnerDelta;
            const updated = await this.repo.pushSetAndComplete(game._id, newSet, currentSetsCount, gameWinnerId, {
                player1MmrBefore: player1.mmr,
                player2MmrBefore: player2.mmr,
                player1MmrChange,
                player2MmrChange,
            });
            if (!updated) {
                throw new InvalidStateTransitionError('in_progress', 'record set (concurrent modification)');
            }
            await Promise.all([
                this.userService.applyGameResult(game.player1Id.toString(), {
                    mmrDelta: player1MmrChange,
                    won: p1IsWinner,
                }),
                this.userService.applyGameResult(game.player2Id.toString(), {
                    mmrDelta: player2MmrChange,
                    won: !p1IsWinner,
                }),
            ]);
            return updated;
        }
        const updated = await this.repo.pushSet(game._id, newSet, currentSetsCount);
        if (!updated) {
            throw new InvalidStateTransitionError('in_progress', 'record set (concurrent modification)');
        }
        return updated;
    }
    async cancel(id) {
        const game = await this.repo.findById(id);
        if (!game)
            throw new GameNotFoundError(id);
        if (game.status !== 'pending' && game.status !== 'in_progress') {
            throw new InvalidStateTransitionError(game.status, 'cancel');
        }
        const updated = await this.repo.updateStatus(game._id, 'cancelled', {
            cancelledAt: new Date(),
        });
        if (!updated)
            throw new GameNotFoundError(id);
        return updated;
    }
    async delete(id) {
        const game = await this.repo.findById(id);
        if (!game)
            throw new GameNotFoundError(id);
        await this.repo.deleteOne(id);
    }
}
//# sourceMappingURL=game.service.js.map