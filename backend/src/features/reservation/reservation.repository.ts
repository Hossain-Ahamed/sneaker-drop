import prisma from "../../lib/prisma";
import type {
  Reservation,
  Prisma,
  PrismaClient,
} from "../../generated/prisma/client";

export class ReservationRepository {
  /**
   * Create a new Reservation in DB
   */
  async create(
    data: Prisma.ReservationUncheckedCreateInput,
    tx: Prisma.TransactionClient | PrismaClient = prisma,
  ): Promise<Reservation> {
    return tx.reservation.create({ data });
  }

  /**
   * Finds a single reservation by id, null when it does not exist
   */
  async findById(
    reservationId: string,
    tx: Prisma.TransactionClient | PrismaClient = prisma,
  ): Promise<Reservation | null> {
    return tx.reservation.findUnique({ where: { id: reservationId } });
  }

  /**
   * get Expired reservations list
   */
  async getExpiredReservationsList(
    now: Date,
    limit: number,
    tx: Prisma.TransactionClient | PrismaClient = prisma,
  ): Promise<Reservation[]> {
    return tx.reservation.findMany({
      where: { status: "ACTIVE", expires_at: { lte: now } },
      orderBy: { expires_at: "asc" },
      take: limit,
    });
  }

  /**
   * Mark reservation to EXPIRED 
   * when status ACTIVE
   * returns null if not found
   */
  async markReservationExpired(
    reservationId: string,
    tx: Prisma.TransactionClient | PrismaClient = prisma,
  ): Promise<{ drop_id: string } | null> {
    const rows = await tx.$queryRaw<{ drop_id: string }[]>`
      UPDATE "Reservation"
      SET status = 'EXPIRED'
      WHERE id = ${reservationId} AND status = 'ACTIVE'
      RETURNING drop_id
    `;
    return rows[0] ?? null;
  }
}

export const reservationRepository = new ReservationRepository();
