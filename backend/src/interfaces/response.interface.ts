import { HttpStatus } from "../utils/http-status";

export type TMeta = {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
};

export type TResponse<T> = {
  statusCode: HttpStatus;
  success: boolean;
  message: string;
  meta?: TMeta;
  data: T;
};
