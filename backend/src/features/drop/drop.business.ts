import type { Drop } from '../../generated/prisma/client';
import { dropRepository } from './drop.repository';
import { IDropType } from './drop.interface';

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
  async createDropLogic(payload: IDropType.CreateDropDTO): Promise<IDropType.IDrop> {
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
}

export const dropBusinessLogic = new DropBusinessLogic();
