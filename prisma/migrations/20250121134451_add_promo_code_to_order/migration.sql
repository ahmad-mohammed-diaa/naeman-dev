/*
  Warnings:

  - You are about to drop the column `promoCodeId` on the `Order` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_promoCodeId_fkey";

-- AlterTable
ALTER TABLE "Order" DROP COLUMN "promoCodeId",
ADD COLUMN     "promoCode" TEXT;
