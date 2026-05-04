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
export function buildPagination(query) {
    const limit = Math.min(query.limit ?? 20, 100);
    const page = Math.max(query.page ?? 1, 1);
    const skip = (page - 1) * limit;
    return { skip, limit, page };
}
//# sourceMappingURL=pagination.js.map