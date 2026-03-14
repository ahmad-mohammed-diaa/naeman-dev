-- CreateEnum
CREATE TYPE "discount" AS ENUM ('PERCENTAGE', 'AMOUNT');

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "freeService" TEXT,
ADD COLUMN     "type" "discount" NOT NULL DEFAULT 'PERCENTAGE';
