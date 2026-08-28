import { Request, Response } from 'express';
import { httpStatus, httpStatusMessage } from '../utils/http-status';

export const notFound = (req: Request, res: Response) => {
  res.status(httpStatus.NOT_FOUND).json({
    success: false,
    message: httpStatusMessage[httpStatus.NOT_FOUND],
    errorSources: [
      {
        path: req.originalUrl,
        message: "The requested API endpoint doesn't exist",
      },
    ],
  });
};

export default notFound;
