import { transaction } from "../../lib/unitOfWork";
import { reservationService } from "../reservation/reservation.service";
import { purchaseBusinessLogic } from "./purchase.business";
import { IPurchaseType } from "./purchase.interface";

export class PurchaseService {
  /**
   * purchase
   * 
   * reservation into a purchase
   * and create a purchase
   */
  async createPurchase(
    payload: IPurchaseType.CreatePurchaseDTO,
  ): Promise<IPurchaseType.IPurchase> {
    return transaction(async (tx) => {
      const reservation = await reservationService.completeReservation(
        payload.reservation_id,
        payload.user_id,
        tx,
      );
      return purchaseBusinessLogic.createPurchaseLogic(reservation, tx);
    });
  }
}

export const purchaseService = new PurchaseService();
