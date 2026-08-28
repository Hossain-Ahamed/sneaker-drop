import { ErrorRequestHandler } from 'express';
import { ZodError } from 'zod';
import config from '../config';
import { TErrorSources } from '../interfaces';
import { httpStatus, httpStatusMessage } from '../utils/http-status';
import ApiError from '../errors/api.error';
import handleZodError from '../errors/zod.error';
import handlePrismaError, { isPrismaError } from '../errors/prisma.error';

export const globalErrorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
  console.error('🚨 globalErrorHandler', error);

  let statusCode: number = httpStatus.INTERNAL_SERVER_ERROR;
  let message: string = httpStatusMessage[httpStatus.INTERNAL_SERVER_ERROR];
  let errorSources: TErrorSources = [];

  if (error instanceof ZodError) {
    ({ statusCode, message, errorSources } = handleZodError(error));
  } else if (isPrismaError(error)) {
    ({ statusCode, message, errorSources } = handlePrismaError(error));
  } else if (error instanceof ApiError) {
    statusCode = error.statusCode;
    message = error.message;
    errorSources = [
      {
        path: '',
        message: error.message,
      },
    ];
  } else if (error instanceof Error) {
    message = error.message;
    errorSources = [
      {
        path: '',
        message: error.message,
      },
    ];
  }

  res.status(statusCode).json({
    success: false,
    message,
    errorSources,
    stack: config.NODE_ENV === 'production' ? undefined : error?.stack,
  });
};

export default globalErrorHandler;
