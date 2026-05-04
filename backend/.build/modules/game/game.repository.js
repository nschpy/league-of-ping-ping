import { Types } from 'mongoose';
import { GameModel } from './game.model.js';
import { buildPagination } from '../../shared/pagination.js';
/**
 * Репозиторий игр.
 * Слой доступа к данным для коллекции `games`. Работает напрямую с Mongoose.
 */
export class GameRepository {
    async create(data) {
        const doc = await GameModel.create(data);
        return doc.toObject();
    }
    async findById(id) {
        const doc = await GameModel.findById(id).lean().exec();
        return doc;
    }
    async findAll(filter, page) {
        const query = {};
        if (filter.status !== undefined)
            query['status'] = filter.status;
        if (filter.refereeId !== undefined)
            query['refereeId'] = new Types.ObjectId(filter.refereeId);
        if (filter.playerId !== undefined) {
            const pid = new Types.ObjectId(filter.playerId);
            query['$or'] = [{ player1Id: pid }, { player2Id: pid }];
        }
        if (filter.scheduledFrom !== undefined || filter.scheduledTo !== undefined) {
            const range = {};
            if (filter.scheduledFrom)
                range['$gte'] = filter.scheduledFrom;
            if (filter.scheduledTo)
                range['$lte'] = filter.scheduledTo;
            query['scheduledAt'] = range;
        }
        const { skip, limit, page: pageNum } = buildPagination(page);
        const [data, total] = await Promise.all([
            GameModel.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).lean().exec(),
            GameModel.countDocuments(query).exec(),
        ]);
        return {
            data: data,
            total,
            page: pageNum,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    }
    async updateStatus(id, status, extra = {}) {
        const doc = await GameModel.findByIdAndUpdate(id, { $set: { status, ...extra } }, { new: true }).lean().exec();
        return doc;
    }
    async pushSet(gameId, set, expectedSetsLength) {
        const doc = await GameModel.findOneAndUpdate({
            _id: gameId,
            status: 'in_progress',
            $expr: { $eq: [{ $size: '$sets' }, expectedSetsLength] },
        }, { $push: { sets: set } }, { new: true }).lean().exec();
        return doc;
    }
    async pushSetAndComplete(gameId, set, expectedSetsLength, winnerId, mmr) {
        const doc = await GameModel.findOneAndUpdate({
            _id: gameId,
            status: 'in_progress',
            $expr: { $eq: [{ $size: '$sets' }, expectedSetsLength] },
        }, {
            $push: { sets: set },
            $set: {
                status: 'completed',
                winnerId,
                completedAt: new Date(),
                ...(mmr ?? {}),
            },
        }, { new: true }).lean().exec();
        return doc;
    }
    async deleteOne(id) {
        await GameModel.findByIdAndDelete(id).exec();
    }
}
//# sourceMappingURL=game.repository.js.map