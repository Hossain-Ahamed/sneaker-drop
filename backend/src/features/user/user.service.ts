import type { TxContext } from "../../lib/unitOfWork";
import { userBusinessLogic } from "./user.business";
import { IUserType } from "./user.interface";

export class UserService {
  /**
   * Create user
   */
  async createUser(payload: IUserType.CreateUserDTO): Promise<IUserType.IUser> {
    return userBusinessLogic.createUserLogic(payload);
  }

  /**
   * Sign in an existing user by username
   */
  async signIn(username: string): Promise<IUserType.IUser> {
    return userBusinessLogic.signInLogic(username);
  }

  /**
   * get user by ID
   */
  async getUser(userId: string, tx?: TxContext): Promise<IUserType.IUser> {
    return userBusinessLogic.getUserLogic(userId, tx);
  }
}

export const userService = new UserService();
