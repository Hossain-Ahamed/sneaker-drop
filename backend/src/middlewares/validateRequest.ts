import { NextFunction, Request, Response } from 'express';
import { ZodObject } from 'zod';
import catchAsync from '../utils/catchAsync';

export const validateRequest = (scheme: ZodObject<any>) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    // Parse and validate
    const parsed = await scheme.parseAsync({
      body: req.body,
      query: req.query,
      params: req.params,
      cookies: req.cookies,
    });

    req.body = parsed.body ?? req.body;

    next();
  });
};

/** validate data with zod */
export const validateData = async (scheme: ZodObject<any>, data: any) => {
  return await scheme.parseAsync(data);
};
