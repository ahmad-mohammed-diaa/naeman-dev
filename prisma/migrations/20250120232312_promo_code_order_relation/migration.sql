/*
  Warnings:

  - You are about to drop the `_OrderToPromoCode` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_OrderToPromoCode" DROP CONSTRAINT "_OrderToPromoCode_A_fkey";

-- DropForeignKey
ALTER TABLE "_OrderToPromoCode" DROP CONSTRAINT "_OrderToPromoCode_B_fkey";

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "promoCodeId" TEXT;

-- DropTable
DROP TABLE "_OrderToPromoCode";

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_promoCodeId_fkey" FOREIGN KEY ("promoCodeId") REFERENCES "PromoCode"("id") ON DELETE SET NULL ON UPDATE CASCADE;
