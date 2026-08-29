import prisma from "../../lib/prisma";
import type { Drop, Prisma, PrismaClient } from "../../generated/prisma/client";

/** A drop row plus its most recent purchases, each with the buyer attached */
export type TDropWithPurchases = Drop & {
  purchases: (Prisma.PurchaseGetPayload<{ include: { user: true } }>)[];
};

export class DropRepository {
  /**
   * Create a new Drop in DB
   */
  async create(
    data: Prisma.DropCreateInput,
    tx: Prisma.TransactionClient | PrismaClient = prisma,
  ): Promise<Drop> {
    return tx.drop.create({ data });
  }

  /**
   * get drops with their current stock &  newest purchases
   */
  async findActiveDrops(
    recentPurchasersLimit: number,
    tx: Prisma.TransactionClient | PrismaClient = prisma,
  ): Promise<TDropWithPurchases[]> {
    return tx.drop.findMany({
      orderBy: { created_at: "asc" },
      include: {
        purchases: {
          orderBy: { purchased_at: "desc" },
          take: recentPurchasersLimit,
          include: { user: true },
        },
      },
    });
  }

  /**
   * Decrements available stock by one
   * if stock remains
   * if stock > 0
   * Decrement stock keeping the row lock
   */
  async decrementStock(
    dropId: string,
    tx: Prisma.TransactionClient | PrismaClient = prisma,
  ): Promise<{ available_stock: number } | null> {
    const rows = await tx.$queryRaw<{ available_stock: number }[]>`
      UPDATE "Drop"
      SET available_stock = available_stock - 1
      WHERE id = ${dropId} AND available_stock > 0
      RETURNING available_stock
    `;
    return rows[0] ?? null;
  }

  /**
   * Gives one unit of stock back,
   * Increment available stock by one
   * capped in available_stock < total_stock
   */
  async restoreStock(
    dropId: string,
    tx: Prisma.TransactionClient | PrismaClient = prisma,
  ): Promise<{ available_stock: number } | null> {
    const rows = await tx.$queryRaw<{ available_stock: number }[]>`
      UPDATE "Drop"
      SET available_stock = available_stock + 1
      WHERE id = ${dropId} AND available_stock < total_stock
      RETURNING available_stock
    `;
    return rows[0] ?? null;
  }

  /**
   * Find drop by id
   */
  async findById(
    dropId: string,
    tx: Prisma.TransactionClient | PrismaClient = prisma,
  ): Promise<Drop | null> {
    return tx.drop.findUnique({ where: { id: dropId } });
  }
}

export const dropRepository = new DropRepository();
