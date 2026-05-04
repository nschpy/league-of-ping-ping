import { Types } from 'mongoose';
import type { ISet, GameFormat } from './game.model.js';

export function requiredWins(format: GameFormat): number {
  if (format === 'bo1') return 1;
  if (format === 'bo3') return 2;
  return 3;
}

export function maxSets(format: GameFormat): number {
  if (format === 'bo1') return 1;
  if (format === 'bo3') return 3;
  return 5;
}

export function isValidSetScore(p1: number, p2: number): boolean {
  if (p1 < 0 || p2 < 0 || p1 === p2) return false;
  const max = Math.max(p1, p2);
  const min = Math.min(p1, p2);
  // До 11 очков (без дюса): победитель ровно 11, проигравший ≤9
  if (max === 11 && min <= 9) return true;
  // Дюс (10-10 и далее): отрыв ровно 2
  if (max >= 12 && max - min === 2) return true;
  return false;
}

export function tallyWins(sets: ISet[], playerId: Types.ObjectId): number {
  return sets.filter((s) => s.winnerId.equals(playerId)).length;
}

export function isWinCondition(sets: ISet[], playerId: Types.ObjectId, format: GameFormat): boolean {
  return tallyWins(sets, playerId) >= requiredWins(format);
}
