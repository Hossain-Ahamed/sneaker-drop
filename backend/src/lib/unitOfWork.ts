import prisma from './prisma';
import type { Prisma } from '../generated/prisma/client';

export type TxContext = Prisma.TransactionClient;

/**
 * DB Transaction utility
 */
export function transaction<T>(task: (tx: TxContext) => Promise<T>): Promise<T> {
  return prisma.$transaction(task);
}
