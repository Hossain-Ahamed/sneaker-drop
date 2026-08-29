import type { User } from '../../generated/prisma/client';
import type { TxContext } from '../../lib/unitOfWork';
import ApiError from '../../errors/api.error';
import { httpStatus } from '../../utils/http-status';
import { userRepository } from './user.repository';
import { IUserType } from './user.interface';

/** Utility : Domain shaped Data*/
function toIUser(user: User): IUserType.IUser {
  return {
    id: user.id,
    username: user.username,
    name: user.name,
    created_at: user.created_at,
  };
}

export class UserBusinessLogic {
  /**
   * Creates a test user
   */
  async createUserLogic(payload: IUserType.CreateUserDTO): Promise<IUserType.IUser> {
    const user = await userRepository.create({
      username: payload.username,
      name: payload.name,
    });
    return toIUser(user);
  }

  /**
   * Fetches one user, throws 404 when the id matches nobody
   */
  async getUserLogic(userId: string, tx?: TxContext): Promise<IUserType.IUser> {
    const user = await userRepository.findById(userId, tx);
    if (!user) {
      throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
    }
    return toIUser(user);
  }
}

export const userBusinessLogic = new UserBusinessLogic();
