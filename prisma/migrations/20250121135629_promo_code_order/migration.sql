/*
  Warnings:

  - You are about to drop the column `promoCode` on the `Order` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Order" DROP COLUMN "promoCode",
ADD COLUMN     "promoCodeId" TEXT;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_promoCodeId_fkey" FOREIGN KEY ("promoCodeId") REFERENCES "PromoCode"("id") ON DELETE SET NULL ON UPDATE CASCADE;
