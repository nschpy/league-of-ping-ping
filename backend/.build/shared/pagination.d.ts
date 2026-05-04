/** Параметры пагинации из HTTP-запроса */
export interface PaginationQuery {
    /** Номер страницы (начиная с 1). По умолчанию 1. */
    page?: number;
    /** Количество элементов на страницу. По умолчанию 20, максимум 100. */
    limit?: number;
}
/** Результат постраничного запроса */
export interface PaginationResult<T> {
    /** Массив элементов текущей страницы */
    data: T[];
    /** Общее количество элементов */
    total: number;
    /** Номер текущей страницы */
    page: number;
    /** Количество элементов на странице */
    limit: number;
    /** Общее количество страниц */
    totalPages: number;
}
/**
 * Вычисляет параметры пагинации для MongoDB-запроса.
 * @param query - Параметры пагинации из запроса
 * @returns Объект с `skip`, `limit` и нормализованным `page`
 *
 * @description
 * - Максимальный `limit` ограничен 100 для предотвращения слишком больших выборок
 * - Номер страницы меньше 1 приводится к 1
 * - Если `limit` не передан, используется значение по умолчанию 20
 */
export declare function buildPagination(query: PaginationQuery): {
    skip: number;
    limit: number;
    page: number;
};
//# sourceMappingURL=pagination.d.ts.map