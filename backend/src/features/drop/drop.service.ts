import type { TxContext } from "../../lib/unitOfWork";
import { emitToRoom } from "../../lib/socket";
import { dropBusinessLogic } from "./drop.business";
import { IDropType } from "./drop.interface";
import { DROP_CONSTANTS, dropRoom } from "./drop.constant";

export class DropService {
  /**
   * Creates a drop
   */
  async createDrop(payload: IDropType.CreateDropDTO): Promise<IDropType.IDrop> {
    return dropBusinessLogic.createDropLogic(payload);
  }

  /**
   * Lists all drop items
   */
  async listDrops(): Promise<IDropType.IDrop[]> {
    return dropBusinessLogic.listDropsLogic();
  }

  /**
   * get drop by id
   */
  async getDrop(dropId: string, tx?: TxContext): Promise<IDropType.IDrop> {
    return dropBusinessLogic.getDropLogic(dropId, tx);
  }

  /**
   * Claims one unit of stock for a drop, returns the remaining available stock
   */
  async claimStock(dropId: string, tx?: TxContext): Promise<number> {
    return dropBusinessLogic.claimStockLogic(dropId, tx);
  }

  /**
   * Returns one unit of stock to a drop, null if already full (available stock == total stock)
   */
  async restoreStock(dropId: string, tx?: TxContext): Promise<number | null> {
    return dropBusinessLogic.restoreStockLogic(dropId, tx);
  }

  /**
   * broadcast the stock info for that drop
   */
  broadcastStockUpdated(payload: IDropType.TStockUpdated): void {
    emitToRoom(
      dropRoom(payload.drop_id),
      DROP_CONSTANTS.STOCK_UPDATED_EVENT,
      payload,
    );
  }
}

export const dropService = new DropService();
