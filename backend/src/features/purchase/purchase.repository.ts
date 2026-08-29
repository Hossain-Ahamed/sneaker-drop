import prisma from "../../lib/prisma";
import type {
  Purchase,
  Prisma,
  PrismaClient,
} from "../../generated/prisma/client";

export class PurchaseRepository {
  /**
   * Create a new Purchase in DB
   */
  async create(
    data: Prisma.PurchaseUncheckedCreateInput,
    tx: Prisma.TransactionClient | PrismaClient = prisma,
  ): Promise<Purchase> {
    return tx.purchase.create({ data });
  }
}

export const purchaseRepository = new PurchaseRepository();
