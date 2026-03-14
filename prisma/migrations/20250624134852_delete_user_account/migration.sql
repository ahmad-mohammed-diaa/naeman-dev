-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "deleted" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "deleted" BOOLEAN NOT NULL DEFAULT false;
