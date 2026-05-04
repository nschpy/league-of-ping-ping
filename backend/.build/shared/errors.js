/**
 * Базовый класс для всех доменных ошибок.
 * @description
 * Все наследующиеся классы автоматически преобразуются в HTTP-ответы
 * плагином error-handler.ts с соответствующим статус-кодом.
 */
export class DomainError extends Error {
    statusCode;
    /**
     * @param message - Человекочитаемое сообщение об ошибке
     * @param statusCode - HTTP статус-код ответа (по умолчанию 500)
     */
    constructor(message = "An unexpected error occurred", statusCode = 500) {
        super(message);
        this.statusCode = statusCode;
        this.name = this.constructor.name;
    }
}
/**
 * Ошибка "Ресурс не найден".
 * @HTTPStatus 404 Not Found
 */
export class NotFoundError extends DomainError {
    constructor(message = "Resource not found") {
        super(message, 404);
    }
}
/**
 * Ошибка "Конфликт уникальности" (например, дублирование email или username).
 * @HTTPStatus 409 Conflict
 */
export class ConflictError extends DomainError {
    constructor(message = "Resource already exists") {
        super(message, 409);
    }
}
/**
 * Ошибка валидации входных данных.
 * @HTTPStatus 400 Bad Request
 */
export class ValidationError extends DomainError {
    constructor(message = "Validation failed") {
        super(message, 400);
    }
}
/**
 * Ошибка "Недопустимый переход состояния".
 * @HTTPStatus 422 Unprocessable Entity
 */
export class InvalidStateError extends DomainError {
    constructor(message = "Invalid state") {
        super(message, 422);
    }
}
/** @HTTPStatus 401 Unauthorized */
export class UnauthorizedError extends DomainError {
    constructor(message = "Authentication required") {
        super(message, 401);
    }
}
/** @HTTPStatus 403 Forbidden */
export class ForbiddenError extends DomainError {
    constructor(message = "Access denied") {
        super(message, 403);
    }
}
//# sourceMappingURL=errors.js.map