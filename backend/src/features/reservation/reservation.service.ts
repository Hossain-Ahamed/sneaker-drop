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
    const { reservation, available_stock } = await transaction(async (tx) => {
      const remaining = await dropService.claimStock(payload.drop_id, tx);
      const created = await reservationBusinessLogic.createReservationLogic(
        payload,
        tx,
      );
      return { reservation: created, available_stock: remaining };
    });

    // emitted after commit, a rolled back claim must never reach clients
    dropService.broadcastStockUpdated({
      drop_id: payload.drop_id,
      available_stock,
    });

    return reservation;
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
      const restored = await transaction(async (tx) => {
        const dropId = await reservationBusinessLogic.expireReservationLogic(
          reservation.id,
          tx,
        );
        if (!dropId) return null;

        const available_stock = await dropService.restoreStock(dropId, tx);
        return { drop_id: dropId, available_stock };
      });

      if (restored) {
        expiredCount += 1;

        // notify everyone that stock restored
        if (restored.available_stock !== null) {
          dropService.broadcastStockUpdated({
            drop_id: restored.drop_id,
            available_stock: restored.available_stock,
          });
        }
      }
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
