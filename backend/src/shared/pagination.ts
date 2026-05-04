export interface PaginationQuery {
  page?: number;
  limit?: number;
}

export interface PaginationResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export function buildPagination(query: PaginationQuery): { skip: number; limit: number; page: number } {
  const limit = Math.min(query.limit ?? 20, 100);
  const page = Math.max(query.page ?? 1, 1);
  const skip = (page - 1) * limit;
  return { skip, limit, page };
}
