/*
  Warnings:

  - You are about to drop the column `discount` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `promoCode` on the `Order` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "PromoType" AS ENUM ('PERCENTAGE', 'AMOUNT');

-- AlterTable
ALTER TABLE "Order" DROP COLUMN "discount",
DROP COLUMN "promoCode";

-- CreateTable
CREATE TABLE "PromoCode" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "discount" INTEGER NOT NULL,
    "type" "PromoType" NOT NULL,
    "expiredAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PromoCode_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_OrderToPromoCode" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_OrderToPromoCode_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_OrderToPromoCode_B_index" ON "_OrderToPromoCode"("B");

-- AddForeignKey
ALTER TABLE "_OrderToPromoCode" ADD CONSTRAINT "_OrderToPromoCode_A_fkey" FOREIGN KEY ("A") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_OrderToPromoCode" ADD CONSTRAINT "_OrderToPromoCode_B_fkey" FOREIGN KEY ("B") REFERENCES "PromoCode"("id") ON DELETE CASCADE ON UPDATE CASCADE;
