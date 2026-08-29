import type { Drop } from '../../generated/prisma/client';
import { dropBusinessLogic } from './drop.business';
import { IDropType } from './drop.interface';

export class DropService {
  /** 
   * Creates a drop
   */
  async createDropService(payload: IDropType.CreateDropDTO): Promise<Drop> {
    return dropBusinessLogic.createDropLogic(payload);
  }
}

export const dropService = new DropService();
