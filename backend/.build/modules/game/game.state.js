import { Types } from 'mongoose';
/**
 * Возвращает количество побед в сетах, необходимых для победы в матче.
 * @param format - Формат игры (bo1, bo3, bo5)
 * @returns Количество выигранных сетов для победы
 */
export function requiredWins(format) {
    if (format === 'bo1')
        return 1;
    if (format === 'bo3')
        return 2;
    return 3;
}
/**
 * Возвращает максимальное количество сетов в матче для данного формата.
 * @param format - Формат игры (bo1, bo3, bo5)
 * @returns Максимальное количество сетов
 */
export function maxSets(format) {
    if (format === 'bo1')
        return 1;
    if (format === 'bo3')
        return 3;
    return 5;
}
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
export function isValidSetScore(p1, p2) {
    if (p1 < 0 || p2 < 0 || p1 === p2)
        return false;
    const max = Math.max(p1, p2);
    const min = Math.min(p1, p2);
    // До 11 очков (без дюса): победитель ровно 11, проигравший ≤9
    if (max === 11 && min <= 9)
        return true;
    // Дюс (10-10 и далее): отрыв ровно 2
    if (max >= 12 && max - min === 2)
        return true;
    return false;
}
/**
 * Подсчитывает количество выигранных сетов игроком.
 * @param sets - Массив сыгранных сетов
 * @param playerId - ID игрока
 * @returns Количество побед игрока в сетах
 */
export function tallyWins(sets, playerId) {
    return sets.filter((s) => s.winnerId.equals(playerId)).length;
}
/**
 * Проверяет условие победы в матче.
 * @param sets - Массив сыгранных сетов
 * @param playerId - ID игрока
 * @param format - Формат игры
 * @returns true если игрок выиграл матч
 */
export function isWinCondition(sets, playerId, format) {
    return tallyWins(sets, playerId) >= requiredWins(format);
}
//# sourceMappingURL=game.state.js.map