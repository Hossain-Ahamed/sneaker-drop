import { userBusinessLogic } from "./user.business";
import { IUserType } from "./user.interface";

export class UserService {
  /**
   * Create user
   */
  async createUser(payload: IUserType.CreateUserDTO): Promise<IUserType.IUser> {
    return userBusinessLogic.createUserLogic(payload);
  }
}

export const userService = new UserService();
