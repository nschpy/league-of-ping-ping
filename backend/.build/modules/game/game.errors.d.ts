import { NotFoundError, InvalidStateError, ValidationError } from '../../shared/errors.js';
/** Ошибка: игра не найдена по указанному идентификатору */
export declare class GameNotFoundError extends NotFoundError {
    constructor(id: string);
}
/** Ошибка: попытка выполнить действие, недопустимое в текущем статусе игры */
export declare class InvalidStateTransitionError extends InvalidStateError {
    constructor(currentStatus: string, action: string);
}
/** Ошибка: счёт сета не соответствует правилам настольного тенниса */
export declare class InvalidSetScoreError extends ValidationError {
    constructor(p1: number, p2: number);
}
/** Ошибка: превышено максимальное количество сетов для данного формата игры */
export declare class SetLimitExceededError extends ValidationError {
    constructor(format: string);
}
//# sourceMappingURL=game.errors.d.ts.map