import prisma from '../../lib/prisma';
import type { User, Prisma, PrismaClient } from '../../generated/prisma/client';

export class UserRepository {
  /**
   * Create a new User in DB
   */
  async create(data: Prisma.UserCreateInput, tx: Prisma.TransactionClient | PrismaClient = prisma): Promise<User> {
    return tx.user.create({ data });
  }

  /**
   * get user by id
   */
  async findById(
    userId: string,
    tx: Prisma.TransactionClient | PrismaClient = prisma,
  ): Promise<User | null> {
    return tx.user.findUnique({ where: { id: userId } });
  }
}

export const userRepository = new UserRepository();
