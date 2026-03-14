/*
  Warnings:

  - You are about to drop the column `vacations` on the `Barber` table. All the data in the column will be lost.
  - You are about to drop the column `vacations` on the `Cashier` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Barber" DROP COLUMN "vacations";

-- AlterTable
ALTER TABLE "Cashier" DROP COLUMN "vacations";

-- CreateTable
CREATE TABLE "Vacation" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "cashierId" TEXT NOT NULL,
    "barberId" TEXT NOT NULL,

    CONSTRAINT "Vacation_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Vacation" ADD CONSTRAINT "Vacation_barberId_fkey" FOREIGN KEY ("barberId") REFERENCES "Barber"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vacation" ADD CONSTRAINT "Vacation_cashierId_fkey" FOREIGN KEY ("cashierId") REFERENCES "Cashier"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
