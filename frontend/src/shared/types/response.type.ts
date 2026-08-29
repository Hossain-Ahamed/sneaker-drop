/** Pagination data */
export type TMeta = {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
};

/** Response Type */
export type TResponse<TData = unknown> = {
  success: boolean;
  message: string;
  meta?: TMeta;
  data: TData;
};

/**Error type */
export type ApiError<TData = unknown> = {
  statusCode: number;
  message: string;
  data?: TData;
};
