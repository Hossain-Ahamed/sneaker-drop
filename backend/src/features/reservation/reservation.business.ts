import type { Reservation } from "../../generated/prisma/client";
import type { TxContext } from "../../lib/unitOfWork";
import ApiError from "../../errors/api.error";
import { httpStatus } from "../../utils/http-status";
import { reservationRepository } from "./reservation.repository";
import { IReservationType } from "./reservation.interface";
import { RESRVEATION_CONSTANTS } from "./reservation.constant";

/** Utility : Domain shaped Data*/
function toIReservation(
  reservation: Reservation,
): IReservationType.IReservation {
  return {
    id: reservation.id,
    status: reservation.status,
    expires_at: reservation.expires_at,
    created_at: reservation.created_at,
    user_id: reservation.user_id,
    drop_id: reservation.drop_id,
  };
}

export class ReservationBusinessLogic {
  /**
   *  reserve a unit and hold for user with DB TRANSACTION
   */
  async createReservationLogic(
    payload: IReservationType.CreateReservationDTO,
    tx: TxContext,
  ): Promise<IReservationType.IReservation> {
    const reservation = await reservationRepository.create(
      {
        drop_id: payload.drop_id,
        user_id: payload.user_id,
        expires_at: new Date(
          Date.now() + RESRVEATION_CONSTANTS.RESERVATION_TTL_MS,
        ),
      },
      tx,
    );

    return toIReservation(reservation);
  }

  /**
   * Expires one reservation, returns its drop_id or null when it was no longer ACTIVE
   */
  async expireReservationLogic(
    reservationId: string,
    tx: TxContext,
  ): Promise<string | null> {
    const expired = await reservationRepository.markReservationExpired(
      reservationId,
      tx,
    );

    return expired ? expired.drop_id : null;
  }

  /**
   * Lists reservations whose hold has elapsed and are still ACTIVE
   */
  async getAllExpiredReservationsLogic(
    limit: number,
  ): Promise<IReservationType.IReservation[]> {
    const reservations = await reservationRepository.getExpiredReservationsList(
      new Date(),
      limit,
    );
    return reservations.map(toIReservation);
  }
  /**
   * Completes one reservation, returns its owner and drop or null when it is no longer claimable
   */
  async completeReservationLogic(
    reservationId: string,
    userId: string,
    tx: TxContext,
  ): Promise<IReservationType.CompletedReservation> {
    const reservation = await reservationRepository.findById(reservationId, tx);
    
    if (!reservation) {
      throw new ApiError(httpStatus.NOT_FOUND, "Reservation not found");
    }
    
    if(reservation.status!=='ACTIVE'){
      throw new ApiError(httpStatus.BAD_REQUEST, "Reservation is not active")
    }

    if (reservation.user_id !== userId) {
      throw new ApiError(
        httpStatus.FORBIDDEN,
        "Reservation belongs to another user",
      );
    }

    const completed = await reservationRepository.markReservationCompleted(
      reservationId,
      new Date(),
      tx,
    );
    if (!completed) {
      throw new ApiError(
        httpStatus.CONFLICT,
        "Reservation is no longer active",
      );
    }

    return {
      id: reservationId,
      user_id: completed.user_id,
      drop_id: completed.drop_id,
    };
  }
}

export const reservationBusinessLogic = new ReservationBusinessLogic();
