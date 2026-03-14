-- DropForeignKey
ALTER TABLE "Slot" DROP CONSTRAINT "Slot_barberId_fkey";

-- DropForeignKey
ALTER TABLE "Slot" DROP CONSTRAINT "Slot_cashierId_fkey";

-- DropForeignKey
ALTER TABLE "Vacation" DROP CONSTRAINT "Vacation_barberId_fkey";

-- DropForeignKey
ALTER TABLE "Vacation" DROP CONSTRAINT "Vacation_cashierId_fkey";

-- AddForeignKey
ALTER TABLE "Vacation" ADD CONSTRAINT "Vacation_barberId_fkey" FOREIGN KEY ("barberId") REFERENCES "Barber"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vacation" ADD CONSTRAINT "Vacation_cashierId_fkey" FOREIGN KEY ("cashierId") REFERENCES "Cashier"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Slot" ADD CONSTRAINT "Slot_cashierId_fkey" FOREIGN KEY ("cashierId") REFERENCES "Cashier"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Slot" ADD CONSTRAINT "Slot_barberId_fkey" FOREIGN KEY ("barberId") REFERENCES "Barber"("id") ON DELETE CASCADE ON UPDATE CASCADE;
