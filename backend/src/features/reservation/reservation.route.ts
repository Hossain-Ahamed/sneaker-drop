import { Router } from "express";
import { validateRequest } from "../../middlewares/validateRequest";
import { ReservationValidationSchema } from "./reservation.validation";
import { reservationController } from "./reservation.controller";

const router = Router();

/**
 * @req POST /reservations
 * validate body
 * reserve a unit and hold for user
 */
router.post(
  "/",
  validateRequest(ReservationValidationSchema.createReservationSchema),
  reservationController.createReservation,
);

export const reservationRouter = router;
