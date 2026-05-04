/**
 * Базовый класс для всех доменных ошибок.
 * @description
 * Все наследующиеся классы автоматически преобразуются в HTTP-ответы
 * плагином error-handler.ts с соответствующим статус-кодом.
 */
export declare class DomainError extends Error {
    readonly statusCode: number;
    /**
     * @param message - Человекочитаемое сообщение об ошибке
     * @param statusCode - HTTP статус-код ответа (по умолчанию 500)
     */
    constructor(message?: string, statusCode?: number);
}
/**
 * Ошибка "Ресурс не найден".
 * @HTTPStatus 404 Not Found
 */
export declare class NotFoundError extends DomainError {
    constructor(message?: string);
}
/**
 * Ошибка "Конфликт уникальности" (например, дублирование email или username).
 * @HTTPStatus 409 Conflict
 */
export declare class ConflictError extends DomainError {
    constructor(message?: string);
}
/**
 * Ошибка валидации входных данных.
 * @HTTPStatus 400 Bad Request
 */
export declare class ValidationError extends DomainError {
    constructor(message?: string);
}
/**
 * Ошибка "Недопустимый переход состояния".
 * @HTTPStatus 422 Unprocessable Entity
 */
export declare class InvalidStateError extends DomainError {
    constructor(message?: string);
}
/** @HTTPStatus 401 Unauthorized */
export declare class UnauthorizedError extends DomainError {
    constructor(message?: string);
}
/** @HTTPStatus 403 Forbidden */
export declare class ForbiddenError extends DomainError {
    constructor(message?: string);
}
//# sourceMappingURL=errors.d.ts.map