import type { Purchase } from "../../generated/prisma/client";
import type { TxContext } from "../../lib/unitOfWork";
import { purchaseRepository } from "./purchase.repository";
import { IPurchaseType } from "./purchase.interface";

/** Utility : Domain shaped Data */
function toIPurchase(purchase: Purchase): IPurchaseType.IPurchase {
  return {
    id: purchase.id,
    purchased_at: purchase.purchased_at,
    user_id: purchase.user_id,
    drop_id: purchase.drop_id,
    reservation_id: purchase.reservation_id,
  };
}

export class PurchaseBusinessLogic {
  /**
   * Writes the purchase row for a reservation the caller already completed
   */
  async createPurchaseLogic(
    reservation: { id: string; user_id: string; drop_id: string },
    tx: TxContext,
  ): Promise<IPurchaseType.IPurchase> {
    const purchase = await purchaseRepository.create(
      {
        reservation_id: reservation.id,
        user_id: reservation.user_id,
        drop_id: reservation.drop_id,
      },
      tx,
    );

    return toIPurchase(purchase);
  }
}

export const purchaseBusinessLogic = new PurchaseBusinessLogic();
