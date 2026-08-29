import type { Drop } from "../../generated/prisma/client";
import type { TxContext } from "../../lib/unitOfWork";
import ApiError from "../../errors/api.error";
import { httpStatus } from "../../utils/http-status";
import { dropRepository } from "./drop.repository";
import { IDropType } from "./drop.interface";

/** Maps a Prisma Drop row to the feature's own domain shape */
function toIDrop(drop: Drop): IDropType.IDrop {
  return {
    id: drop.id,
    name: drop.name,
    price: drop.price.toNumber(),
    total_stock: drop.total_stock,
    available_stock: drop.available_stock,
    starts_at: drop.starts_at,
    created_at: drop.created_at,
  };
}

export class DropBusinessLogic {
  /**
   * Creates a drop
   * available stock starts equal to total stock
   */
  async createDropLogic(
    payload: IDropType.CreateDropDTO,
  ): Promise<IDropType.IDrop> {
    const drop = await dropRepository.create({
      name: payload.name,
      price: payload.price,
      total_stock: payload.total_stock,
      available_stock: payload.total_stock,
      starts_at: payload.starts_at,
    });
    return toIDrop(drop);
  }

  /**
   * Lists all drops items
   */
  async listDropsLogic(): Promise<IDropType.IDrop[]> {
    const drops = await dropRepository.findActiveDrops();
    return drops.map(toIDrop);
  }

  /**
   * Claims one unit of stock
   * If stock out -> throw http status 409 and out of stock message
   */
  async claimStockLogic(dropId: string, tx?: TxContext): Promise<number> {
    const drop = await dropRepository.findById(dropId, tx);
    if (!drop) {
      throw new ApiError(httpStatus.NOT_FOUND, "Drop not found");
    }

    const claimed = await dropRepository.decrementStock(dropId, tx);
    if (!claimed) {
      throw new ApiError(httpStatus.CONFLICT, "Out of stock");
    }

    return claimed.available_stock;
  }

  /**
   * Returns one unit of stock to a drop, used when a reservation expires
   */
  async restoreStockLogic(
    dropId: string,
    tx?: TxContext,
  ): Promise<number | null> {
    const restored = await dropRepository.restoreStock(dropId, tx);
    return restored ? restored.available_stock : null;
  }
}

export const dropBusinessLogic = new DropBusinessLogic();
