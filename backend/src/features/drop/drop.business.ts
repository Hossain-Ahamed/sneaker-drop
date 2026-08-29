import type { Drop } from '../../generated/prisma/client';
import { dropRepository } from './drop.repository';
import { IDropType } from './drop.interface';

export class DropBusinessLogic {
  /** 
   * Creates a drop
   * available stock starts equal to total stock 
   */
  async createDropLogic(payload: IDropType.CreateDropDTO): Promise<Drop> {
    return dropRepository.create({
      name: payload.name,
      price: payload.price,
      total_stock: payload.totalStock,
      available_stock: payload.totalStock,
      starts_at: payload.startsAt,
    });
  }
}

export const dropBusinessLogic = new DropBusinessLogic();
