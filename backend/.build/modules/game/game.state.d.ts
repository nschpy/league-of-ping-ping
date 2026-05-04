import { Types } from 'mongoose';
import type { ISet, GameFormat } from './game.model.js';
/**
 * Возвращает количество побед в сетах, необходимых для победы в матче.
 * @param format - Формат игры (bo1, bo3, bo5)
 * @returns Количество выигранных сетов для победы
 */
export declare function requiredWins(format: GameFormat): number;
/**
 * Возвращает максимальное количество сетов в матче для данного формата.
 * @param format - Формат игры (bo1, bo3, bo5)
 * @returns Максимальное количество сетов
 */
export declare function maxSets(format: GameFormat): number;
/**
 * Проверяет, является ли счёт валидным по правилам настольного тенниса.
 * @param p1 - Очки игрока 1
 * @param p2 - Очки игрока 2
 * @returns true если счёт валиден
 *
 * @description
 * Правила:
 * - Победитель должен набрать минимум 11 очков
 * - Отрыв победителя должен быть минимум 2 очка
 * - При счёте 10:10 (deuce) игра продолжается до отрыва в 2 очка
 */
export declare function isValidSetScore(p1: number, p2: number): boolean;
/**
 * Подсчитывает количество выигранных сетов игроком.
 * @param sets - Массив сыгранных сетов
 * @param playerId - ID игрока
 * @returns Количество побед игрока в сетах
 */
export declare function tallyWins(sets: ISet[], playerId: Types.ObjectId): number;
/**
 * Проверяет условие победы в матче.
 * @param sets - Массив сыгранных сетов
 * @param playerId - ID игрока
 * @param format - Формат игры
 * @returns true если игрок выиграл матч
 */
export declare function isWinCondition(sets: ISet[], playerId: Types.ObjectId, format: GameFormat): boolean;
//# sourceMappingURL=game.state.d.ts.map