import { dropBusinessLogic } from './drop.business';
import { IDropType } from './drop.interface';

export class DropService {
  /**
   * Creates a drop
   */
  async createDropService(payload: IDropType.CreateDropDTO): Promise<IDropType.IDrop> {
    return dropBusinessLogic.createDropLogic(payload);
  }

  /**
   * Lists all drop items
   */
  async listDropsService(): Promise<IDropType.IDrop[]> {
    return dropBusinessLogic.listDropsLogic();
  }
}

export const dropService = new DropService();
