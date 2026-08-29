/*
  Warnings:

  - You are about to drop the column `reservationId` on the `Purchase` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[reservation_id]` on the table `Purchase` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `reservation_id` to the `Purchase` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Purchase" DROP CONSTRAINT "Purchase_reservationId_fkey";

-- DropIndex
DROP INDEX "Purchase_reservationId_key";

-- AlterTable
ALTER TABLE "Purchase" DROP COLUMN "reservationId",
ADD COLUMN     "reservation_id" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Purchase_reservation_id_key" ON "Purchase"("reservation_id");

-- AddForeignKey
ALTER TABLE "Purchase" ADD CONSTRAINT "Purchase_reservation_id_fkey" FOREIGN KEY ("reservation_id") REFERENCES "Reservation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
