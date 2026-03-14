-- AlterTable
ALTER TABLE "Settings" ALTER COLUMN "effectiveSlotDurationDate" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Slot" ALTER COLUMN "effectiveSlotDate" DROP NOT NULL;
