import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { httpStatus } from "../../utils/http-status";
import { purchaseService } from "./purchase.service";

export class PurchaseController {
  /**
   * POST /purchases
   * make a purchase
   */
  createPurchase = catchAsync(async (req: Request, res: Response) => {
    // identity comes from the httpOnly cookie, never the body
    const purchase = await purchaseService.createPurchase({
      reservation_id: req.body.reservation_id,
      user_id: req.userId as string,
    });

    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: "Purchase completed successfully",
      data: purchase,
    });
  });
}

export const purchaseController = new PurchaseController();
