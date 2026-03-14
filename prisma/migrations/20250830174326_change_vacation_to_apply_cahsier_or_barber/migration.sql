-- DropForeignKey
ALTER TABLE "Vacation" DROP CONSTRAINT "Vacation_barberId_fkey";

-- DropForeignKey
ALTER TABLE "Vacation" DROP CONSTRAINT "Vacation_cashierId_fkey";

-- AlterTable
ALTER TABLE "Vacation" ALTER COLUMN "cashierId" DROP NOT NULL,
ALTER COLUMN "barberId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Vacation" ADD CONSTRAINT "Vacation_barberId_fkey" FOREIGN KEY ("barberId") REFERENCES "Barber"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vacation" ADD CONSTRAINT "Vacation_cashierId_fkey" FOREIGN KEY ("cashierId") REFERENCES "Cashier"("id") ON DELETE SET NULL ON UPDATE CASCADE;
