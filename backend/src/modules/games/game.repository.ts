import { GameModel } from '../../core/models/Game.js'
import type { IGame } from '../../core/models/Game.js'
import type { GameFormat } from './game.scoring.js'

export async function create(data: {
  player1Id: string
  player2Id: string
  refereeId: string
  format: GameFormat
  player1MmrBefore: number
  player2MmrBefore: number
}): Promise<IGame> {
  return GameModel.create(data)
}

export async function findByIdPopulated(id: string): Promise<IGame | null> {
  return GameModel.findById(id).populate('player1Id player2Id refereeId', 'nickname mmr')
}

export async function save(game: IGame): Promise<IGame> {
  return game.save()
}
