import prisma from '../../lib/prisma';
import type { Drop, Prisma, PrismaClient } from '../../generated/prisma/client';

export class DropRepository {
  /** 
   * Create a new Drop in DB
   */
  async create(data: Prisma.DropCreateInput, tx: Prisma.TransactionClient | PrismaClient = prisma): Promise<Drop> {
    return tx.drop.create({ data });
  }

  /**
   * Lists all drops with their current available stock
   */
  async findActiveDrops(tx: Prisma.TransactionClient | PrismaClient = prisma): Promise<Drop[]> {
    return tx.drop.findMany();
  }
}

export const dropRepository = new DropRepository();
