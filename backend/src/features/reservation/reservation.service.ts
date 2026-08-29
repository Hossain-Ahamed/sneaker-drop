import { transaction, type TxContext } from "../../lib/unitOfWork";
import { dropService } from "../drop/drop.service";
import { reservationBusinessLogic } from "./reservation.business";
import { IReservationType } from "./reservation.interface";
import { RESRVEATION_CONSTANTS } from "./reservation.constant";

export class ReservationService {
  /**
   * Creates a reservation, stock claim and reservation row commit together
   */
  async createReservation(
    payload: IReservationType.CreateReservationDTO,
  ): Promise<IReservationType.IReservation> {
    return transaction(async (tx) => {
      await dropService.claimStock(payload.drop_id, tx);
      return reservationBusinessLogic.createReservationLogic(payload, tx);
    });
  }

  /**
   * Mark expired the reservation which crossed the expiry time
   */
  async expireDueReservations(): Promise<number> {
    const list =
      await reservationBusinessLogic.getAllExpiredReservationsLogic(
        RESRVEATION_CONSTANTS.EXPIRY_SWEEP_BATCH_SIZE,
      );

    let expiredCount = 0;
    for (const reservation of list) {
      // own transaction per reservation, one failure must not abort the rest
      const expired = await transaction(async (tx) => {
        const dropId = await reservationBusinessLogic.expireReservationLogic(
          reservation.id,
          tx,
        );
        if (!dropId) return false;

        await dropService.restoreStock(dropId, tx);
        return true;
      });

      if (expired) expiredCount += 1;
    }

    return expiredCount;
  }
  /**
   * Completes an active reservation for its owner, joins the caller's transaction
   */
  async completeReservation(
    reservationId: string,
    userId: string,
    tx: TxContext,
  ): Promise<IReservationType.CompletedReservation> {
    return reservationBusinessLogic.completeReservationLogic(
      reservationId,
      userId,
      tx,
    );
  }
}

export const reservationService = new ReservationService();
