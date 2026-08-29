import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { httpStatus } from '../../utils/http-status';
import { userService } from './user.service';

export class UserController {
  /**
   * POST /users
   * creates a user
   */
  createUser = catchAsync(async (req: Request, res: Response) => {
    const user = await userService.createUserService(req.body);

    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: 'user created successfully',
      data: user,
    });
  });
}

export const userController = new UserController();
