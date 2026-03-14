-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "shouldBeReviewedByAdmin" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Settings" ADD COLUMN     "password" TEXT;
