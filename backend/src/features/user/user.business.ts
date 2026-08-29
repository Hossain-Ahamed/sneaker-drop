import type { User } from '../../generated/prisma/client';
import { userRepository } from './user.repository';
import { IUserType } from './user.interface';

/** Maps a Prisma User row to the feature's own domain shape */
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
}

export const userBusinessLogic = new UserBusinessLogic();
