import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { httpStatus } from '../../utils/http-status';
import { dropService } from './drop.service';

export class DropController {
  /**
   * POST /drops  
   * creates a new drop
   */
  createDrop = catchAsync(async (req: Request, res: Response) => {
    const drop = await dropService.createDropService(req.body);

    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: 'Drop created successfully',
      data: drop,
    });
  });

  /**
   * GET /drops
   * lists all drop items
   */
  listDrops = catchAsync(async (req: Request, res: Response) => {
    const drops = await dropService.listDropsService();

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Drops fetched successfully',
      data: drops,
    });
  });
}

export const dropController = new DropController();
