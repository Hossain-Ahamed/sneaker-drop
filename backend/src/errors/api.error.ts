import { HttpStatus, httpStatusMessage } from "../utils/http-status";

class ApiError extends Error {
  public statusCode: number;

  constructor(statusCode: number, message?: string, stack = '') {
    const defaultMessage =
      statusCode in httpStatusMessage
        ? httpStatusMessage[statusCode as HttpStatus]
        : 'Unknown Error';

    super(message || defaultMessage);
    this.statusCode = statusCode;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export default ApiError;
