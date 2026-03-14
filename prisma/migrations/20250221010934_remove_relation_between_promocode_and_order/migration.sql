-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_promoCode_fkey";

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "discount" INTEGER NOT NULL DEFAULT 0;
