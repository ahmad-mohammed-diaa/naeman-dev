export const DEFAULT_LIMIT = 20;
export const MAX_LIMIT = 100;

export type PaginationParams = { page?: number; limit?: number };

export interface PaginatedResult<T> {
  data: T[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export function buildPagination(params: PaginationParams = {}): {
  pagination: { skip: number; take: number };
  buildResult<T>(data: T[], total: number): PaginatedResult<T>;
} {
  const page = Math.max(params.page ?? 1, 1);
  const limit = Math.min(params.limit ?? DEFAULT_LIMIT, MAX_LIMIT);
  const skip = (page - 1) * limit;

  return {
    pagination: { skip, take: limit },
    buildResult<T>(data: T[] = [], total = 0): PaginatedResult<T> {
      const totalPages = Math.ceil(total / limit);
      return {
        data,
        page,
        limit,
        total,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      };
    },
  };
}
