import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { httpStatus } from "../../utils/http-status";
import { reservationService } from "./reservation.service";

export class ReservationController {
  /**
   * POST /reservations
   * reserve a unit and hold for user
   */
  createReservation = catchAsync(async (req: Request, res: Response) => {
    const reservation = await reservationService.createReservation({
      drop_id: req.body.drop_id,
      user_id: req.userId as string,
    });

    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: "Reservation created successfully",
      data: reservation,
    });
  });
}

export const reservationController = new ReservationController();
