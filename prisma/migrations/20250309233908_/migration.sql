/*
  Warnings:

  - A unique constraint covering the columns `[slotId]` on the table `Barber` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[barberId]` on the table `Slot` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[cashierId]` on the table `Slot` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `slotId` to the `Barber` table without a default value. This is not possible if the table is not empty.
  - Added the required column `barberId` to the `Slot` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cashierId` to the `Slot` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Slot" DROP CONSTRAINT "Slot_id_fkey";

-- AlterTable
ALTER TABLE "Barber" ADD COLUMN     "slotId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Slot" ADD COLUMN     "barberId" TEXT NOT NULL,
ADD COLUMN     "cashierId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Barber_slotId_key" ON "Barber"("slotId");

-- CreateIndex
CREATE UNIQUE INDEX "Slot_barberId_key" ON "Slot"("barberId");

-- CreateIndex
CREATE UNIQUE INDEX "Slot_cashierId_key" ON "Slot"("cashierId");

-- AddForeignKey
ALTER TABLE "Slot" ADD CONSTRAINT "Slot_cashierId_fkey" FOREIGN KEY ("cashierId") REFERENCES "Cashier"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Slot" ADD CONSTRAINT "Slot_barberId_fkey" FOREIGN KEY ("barberId") REFERENCES "Barber"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
