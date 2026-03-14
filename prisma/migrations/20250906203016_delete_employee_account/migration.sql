-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_barberId_fkey";

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "barberName" TEXT,
ALTER COLUMN "barberId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_barberId_fkey" FOREIGN KEY ("barberId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
