-- CreateEnum
CREATE TYPE "CategoryType" AS ENUM ('GENERAL', 'MASSAGE', 'PEDICURE');

-- AlterTable
ALTER TABLE "Barber" ADD COLUMN     "type" "CategoryType" NOT NULL DEFAULT 'GENERAL';

-- AlterTable
ALTER TABLE "Category" ADD COLUMN     "type" "CategoryType" NOT NULL DEFAULT 'GENERAL';

-- AlterTable
ALTER TABLE "Slot" ADD COLUMN     "effectiveAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedSlot" TEXT[];
