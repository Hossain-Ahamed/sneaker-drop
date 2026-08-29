import { CookieOptions, Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { httpStatus } from "../../utils/http-status";
import ApiError from "../../errors/api.error";
import config from "../../config";
import { userService } from "./user.service";
import { USER_COOKIE } from "./user.constant";

/**
 * httpOnly so client JS can never read or forge the identity; SameSite/secure
 * relax in dev because the API and the Vite server are different origins
 */
function identityCookieOptions(): CookieOptions {
  const isProduction = config.NODE_ENV === "production";

  return {
    httpOnly: true,
    sameSite: isProduction ? "none" : "lax",
    secure: isProduction,
    maxAge: USER_COOKIE.MAX_AGE_MS,
    path: "/",
  };
}

export class UserController {
  /**
   * POST /users
   * creates a user and puts their identity in an httpOnly cookie
   */
  createUser = catchAsync(async (req: Request, res: Response) => {
    const user = await userService.createUser(req.body);

    res.cookie(USER_COOKIE.NAME, user.id, identityCookieOptions());

    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: "user created successfully",
      data: user,
    });
  });

  /**
   * POST /users/signin
   * signs an existing user in by username and re-issues their identity cookie
   */
  signIn = catchAsync(async (req: Request, res: Response) => {
    const user = await userService.signIn(req.body.username);

    res.cookie(USER_COOKIE.NAME, user.id, identityCookieOptions());

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "signed in successfully",
      data: user,
    });
  });

  /**
   * GET /users/me
   * resolves the caller from their identity cookie
   */
  getCurrentUser = catchAsync(async (req: Request, res: Response) => {
    const userId = req.cookies?.[USER_COOKIE.NAME] as string | undefined;

    if (!userId) {
      throw new ApiError(httpStatus.UNAUTHORIZED, "No identity cookie");
    }

    // a cookie pointing at a user the DB no longer has (a reset between demos)
    // must not keep being sent — clear it so the client starts clean
    try {
      const user = await userService.getUser(userId);

      sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "user fetched successfully",
        data: user,
      });
    } catch (error) {
      res.clearCookie(USER_COOKIE.NAME, identityCookieOptions());
      throw error;
    }
  });

  /**
   * POST /users/signout
   * drops the identity cookie
   */
  signOut = catchAsync(async (_req: Request, res: Response) => {
    res.clearCookie(USER_COOKIE.NAME, identityCookieOptions());

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "signed out successfully",
      data: null,
    });
  });
}

export const userController = new UserController();
