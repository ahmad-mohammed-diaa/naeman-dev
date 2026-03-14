/*
  Warnings:

  - You are about to drop the column `slotId` on the `Barber` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Slot" DROP CONSTRAINT "Slot_barberId_fkey";

-- DropForeignKey
ALTER TABLE "Slot" DROP CONSTRAINT "Slot_cashierId_fkey";

-- DropIndex
DROP INDEX "Barber_slotId_key";

-- AlterTable
ALTER TABLE "Barber" DROP COLUMN "slotId";

-- AlterTable
ALTER TABLE "Slot" ALTER COLUMN "barberId" DROP NOT NULL,
ALTER COLUMN "cashierId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Slot" ADD CONSTRAINT "Slot_cashierId_fkey" FOREIGN KEY ("cashierId") REFERENCES "Cashier"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Slot" ADD CONSTRAINT "Slot_barberId_fkey" FOREIGN KEY ("barberId") REFERENCES "Barber"("id") ON DELETE SET NULL ON UPDATE CASCADE;
