import { transaction } from "../../lib/unitOfWork";
import { reservationService } from "../reservation/reservation.service";
import { userService } from "../user/user.service";
import { dropService } from "../drop/drop.service";
import { emitToRoom } from "../../lib/socket";
import { dropRoom } from "../drop/drop.constant";
import { purchaseBusinessLogic } from "./purchase.business";
import { IPurchaseType } from "./purchase.interface";
import { PURCHASE_CONSTANTS } from "./purchase.constant";

export class PurchaseService {
  /**
   * purchase
   *
   * reservation into a purchase
   * and create a purchase
   * 
   * notify
   */
  async createPurchase(
    payload: IPurchaseType.CreatePurchaseDTO,
  ): Promise<IPurchaseType.IPurchase> {
    const purchase = await transaction(async (tx) => {
      const reservation = await reservationService.completeReservation(
        payload.reservation_id,
        payload.user_id,
        tx,
      );
      return purchaseBusinessLogic.createPurchaseLogic(reservation, tx);
    });


    try {
      await this.broadcastPurchase(purchase);
    } catch (err) {
      console.error(`Purchase broadcast failed: ${err}`);
    }

    return purchase;
  }

  /**
   * broadcast the order info=
   * 
   */
  private async broadcastPurchase(
    purchase: IPurchaseType.IPurchase,
  ): Promise<void> {
    const [buyer, drop] = await Promise.all([
      userService.getUser(purchase.user_id),
      dropService.getDrop(purchase.drop_id),
    ]);

    emitToRoom<IPurchaseType.TNewPurchase>(
      dropRoom(purchase.drop_id),
      PURCHASE_CONSTANTS.NEW_PURCHASE_EVENT,
      {
        drop_id: purchase.drop_id,
        purchased_at: purchase.purchased_at,
        username: buyer.username,
      },
    );

    // order confirmation message
    dropService.broadcastStockUpdated({
      drop_id: purchase.drop_id,
      available_stock: drop.available_stock,
    });
  }
}

export const purchaseService = new PurchaseService();
