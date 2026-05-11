import { UserModel } from '../../core/models/User.js'
import type { IGame } from '../../core/models/Game.js'
import type { GameFormat } from './game.scoring.js'
import { gameWinner, isSetComplete, setsToWin } from './game.scoring.js'
import { mmrDelta } from './game.mmr.js'
import * as gameRepository from './game.repository.js'
import { notFound, forbidden, badRequest } from '../../utils/errors.js'

export async function createGame(dto: {
  player1Id: string
  player2Id: string
  format: GameFormat
  refereeId: string
}): Promise<IGame> {
  const { player1Id, player2Id, format, refereeId } = dto

  const [player1, player2] = await Promise.all([
    UserModel.findById(player1Id),
    UserModel.findById(player2Id),
  ])

  if (player1 === null) {
    throw notFound('Player 1 not found')
  }
  if (player2 === null) {
    throw notFound('Player 2 not found')
  }

  if (player1Id === player2Id) {
    throw badRequest('Player 1 and Player 2 must be different')
  }

  if (refereeId === player1Id || refereeId === player2Id) {
    throw badRequest('Referee cannot be a player')
  }

  const game = await gameRepository.create({
    player1Id,
    player2Id,
    refereeId,
    format,
    player1MmrBefore: player1.mmr,
    player2MmrBefore: player2.mmr,
  })

  game.sets.push({ player1Score: 0, player2Score: 0, points: [] })
  await gameRepository.save(game)

  const populated = await gameRepository.findByIdPopulated(game.id as string)
  if (populated === null) {
    throw notFound('Game not found after creation')
  }
  return populated
}

export async function getGame(id: string): Promise<IGame> {
  const game = await gameRepository.findByIdPopulated(id)
  if (game === null) {
    throw notFound('Game not found')
  }
  return game
}

export async function addPoint(
  gameId: string,
  scorer: 'p1' | 'p2',
  userId: string,
): Promise<IGame> {
  const game = await getGame(gameId)

  if (game.status !== 'in_progress') {
    throw badRequest('Game is not in progress')
  }

  if (game.refereeId.toString() !== userId) {
    throw forbidden('Only the referee can modify this game')
  }

  const currentSet = game.sets[game.sets.length - 1]
  if (currentSet === undefined) {
    throw badRequest('No active set found')
  }

  if (currentSet.completedAt !== undefined) {
    throw badRequest('Current set is already finalized')
  }

  if (scorer === 'p1') {
    currentSet.player1Score += 1
  } else {
    currentSet.player2Score += 1
  }

  currentSet.points.push({ scorer, at: new Date() })

  if (isSetComplete({ a: currentSet.player1Score, b: currentSet.player2Score })) {
    currentSet.completedAt = new Date()
  }

  await checkAndCompleteGame(game)
  await gameRepository.save(game)

  const populated = await gameRepository.findByIdPopulated(game.id as string)
  if (populated === null) {
    throw notFound('Game not found after update')
  }
  return populated
}

export async function undoLastPoint(gameId: string, userId: string): Promise<IGame> {
  const game = await getGame(gameId)

  if (game.status !== 'in_progress') {
    throw badRequest('Game is not in progress')
  }

  if (game.refereeId.toString() !== userId) {
    throw forbidden('Only the referee can modify this game')
  }

  const currentSet = game.sets[game.sets.length - 1]
  if (currentSet === undefined) {
    throw badRequest('No active set found')
  }

  if (currentSet.points.length === 0) {
    throw badRequest('No points to undo in the current set')
  }

  const lastPoint = currentSet.points[currentSet.points.length - 1]!
  currentSet.points.pop()

  if (lastPoint.scorer === 'p1') {
    currentSet.player1Score -= 1
  } else {
    currentSet.player2Score -= 1
  }

  if (currentSet.completedAt !== undefined) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ;(currentSet as any).completedAt = undefined
  }

  await gameRepository.save(game)

  const populated = await gameRepository.findByIdPopulated(game.id as string)
  if (populated === null) {
    throw notFound('Game not found after update')
  }
  return populated
}

export async function finalizeSet(
  gameId: string,
  dto: { player1Score: number; player2Score: number },
  userId: string,
): Promise<IGame> {
  const game = await getGame(gameId)

  if (game.status !== 'in_progress') {
    throw badRequest('Game is not in progress')
  }

  if (game.refereeId.toString() !== userId) {
    throw forbidden('Only the referee can modify this game')
  }

  const currentSet = game.sets[game.sets.length - 1]
  if (currentSet === undefined) {
    throw badRequest('No active set found')
  }

  if (currentSet.completedAt !== undefined) {
    throw badRequest('Set already finalized')
  }

  currentSet.player1Score = dto.player1Score
  currentSet.player2Score = dto.player2Score
  currentSet.completedAt = new Date()
  currentSet.points = []

  await checkAndCompleteGame(game)
  await gameRepository.save(game)

  const populated = await gameRepository.findByIdPopulated(game.id as string)
  if (populated === null) {
    throw notFound('Game not found after update')
  }
  return populated
}

export async function cancelGame(gameId: string, userId: string): Promise<IGame> {
  const game = await getGame(gameId)

  if (game.status !== 'in_progress') {
    throw badRequest('Game is not in progress')
  }

  if (game.refereeId.toString() !== userId) {
    throw forbidden('Only the referee can modify this game')
  }

  game.status = 'cancelled'
  game.cancelledAt = new Date()

  await gameRepository.save(game)

  const populated = await gameRepository.findByIdPopulated(game.id as string)
  if (populated === null) {
    throw notFound('Game not found after update')
  }
  return populated
}

async function checkAndCompleteGame(game: IGame): Promise<void> {
  const winner = gameWinner(game.sets, game.format)

  if (winner !== null) {
    game.status = 'completed'
    game.completedAt = new Date()

    // Use toString() to handle both populated and unpopulated ObjectId fields
    const winnerId = winner === 'p1' ? game.player1Id : game.player2Id
    game.winnerId = winnerId

    const p1Delta = mmrDelta(game.player1MmrBefore, game.player2MmrBefore, winner === 'p1', game.format)
    const p2Delta = mmrDelta(game.player2MmrBefore, game.player1MmrBefore, winner === 'p2', game.format)

    game.player1MmrChange = p1Delta
    game.player2MmrChange = p2Delta

    // Use the raw ObjectId string (toString handles both populated docs and ObjectIds)
    await Promise.all([
      UserModel.findByIdAndUpdate(game.player1Id.toString(), { $inc: { mmr: p1Delta } }),
      UserModel.findByIdAndUpdate(game.player2Id.toString(), { $inc: { mmr: p2Delta } }),
    ])
  } else {
    // Check if we need to push a new set
    const lastSet = game.sets[game.sets.length - 1]
    if (lastSet !== undefined && lastSet.completedAt !== undefined) {
      const completedSetsCount = game.sets.filter((s) => s.completedAt !== undefined).length
      const maxSets = setsToWin(game.format) * 2 - 1
      if (completedSetsCount < maxSets) {
        game.sets.push({ player1Score: 0, player2Score: 0, points: [] })
      }
    }
  }
}
