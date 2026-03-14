/*
  Warnings:

  - You are about to drop the column `effectiveAt` on the `Slot` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Settings" ADD COLUMN     "effectiveSlotDurationDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Slot" DROP COLUMN "effectiveAt",
ADD COLUMN     "effectiveSlotDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
