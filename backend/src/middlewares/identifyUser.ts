import { NextFunction, Request, Response } from "express";
import ApiError from "../errors/api.error";
import { httpStatus } from "../utils/http-status";
import { USER_COOKIE } from "../features/user/user.constant";

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}

export const identifyUser = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const userId = req.cookies?.[USER_COOKIE.NAME] as string | undefined;

  if (!userId) {
    throw new ApiError(
      httpStatus.UNAUTHORIZED,
      "Create a user",
    );
  }

  req.userId = userId;
  next();
};
