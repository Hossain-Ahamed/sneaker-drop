import { ZodError, z } from 'zod';
import { TErrorSources, TGenericErrorResponse } from '../interfaces';
import { httpStatus, httpStatusMessage } from '../utils/http-status';

const handleZodError = (err: ZodError): TGenericErrorResponse => {
  const statusCode = httpStatus.BAD_REQUEST;

  const errorSources: TErrorSources = err.issues.map((issue: z.core.$ZodIssue) => {
    const pathValue = issue.path[issue.path.length - 1];
    return {
      path:
        typeof pathValue === 'symbol'
          ? pathValue.toString()
          : (pathValue ?? 'unknown'),
      message: issue.message,
    };
  });

  return {
    statusCode,
    message: httpStatusMessage[statusCode],
    errorSources,
  };
};

export default handleZodError;
