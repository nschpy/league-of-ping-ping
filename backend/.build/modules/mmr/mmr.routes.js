import { UserModel } from '../user/user.model.js';
import { MmrCoreService } from '../game/game.mmr-core.service.js';
import { ValidationError } from '../../shared/errors.js';
const mmrCoreService = new MmrCoreService();
const mmrRoutes = async (fastify) => {
    fastify.get('/forecast', async (request, reply) => {
        const { aId, bId, format } = request.query;
        if (!aId || !bId)
            throw new ValidationError('aId and bId are required');
        const validFormats = ['bo1', 'bo3', 'bo5'];
        const gameFormat = validFormats.includes(format)
            ? format
            : 'bo3';
        const [userA, userB] = await Promise.all([
            UserModel.findById(aId).select('mmr').lean().exec(),
            UserModel.findById(bId).select('mmr').lean().exec(),
        ]);
        if (!userA)
            throw new ValidationError(`User not found: ${aId}`);
        if (!userB)
            throw new ValidationError(`User not found: ${bId}`);
        const expA = 1 / (1 + Math.pow(10, (userB.mmr - userA.mmr) / 400));
        const expB = 1 - expA;
        const aWin = mmrCoreService.calculateDeltas(userA.mmr, userB.mmr, gameFormat);
        const bWin = mmrCoreService.calculateDeltas(userB.mmr, userA.mmr, gameFormat);
        return reply.send({
            format: gameFormat,
            expA: Math.round(expA * 100),
            expB: Math.round(expB * 100),
            aWin: { a: aWin.winnerDelta, b: aWin.loserDelta },
            bWin: { a: bWin.loserDelta, b: bWin.winnerDelta },
        });
    });
};
export default mmrRoutes;
//# sourceMappingURL=mmr.routes.js.map