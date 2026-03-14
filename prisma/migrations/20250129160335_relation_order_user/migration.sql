/*
  Warnings:

  - You are about to drop the column `userId` on the `Barber` table. All the data in the column will be lost.
  - The primary key for the `Client` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `createdAt` on the `Client` table. All the data in the column will be lost.
  - You are about to drop the column `id` on the `Client` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Client` table. All the data in the column will be lost.
  - You are about to drop the column `clientId` on the `Complain` table. All the data in the column will be lost.
  - Added the required column `userId` to the `Complain` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Barber" DROP CONSTRAINT "Barber_userId_fkey";

-- DropForeignKey
ALTER TABLE "Complain" DROP CONSTRAINT "Complain_clientId_fkey";

-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_barberId_fkey";

-- DropIndex
DROP INDEX "Barber_userId_key";

-- DropIndex
DROP INDEX "Client_userId_key";

-- AlterTable
ALTER TABLE "Barber" DROP COLUMN "userId";

-- AlterTable
ALTER TABLE "Client" DROP CONSTRAINT "Client_pkey",
DROP COLUMN "createdAt",
DROP COLUMN "id",
DROP COLUMN "updatedAt",
ADD CONSTRAINT "Client_pkey" PRIMARY KEY ("userId");

-- AlterTable
ALTER TABLE "Complain" DROP COLUMN "clientId",
ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "cashierId" TEXT;

-- CreateTable
CREATE TABLE "Cashier" (
    "id" TEXT NOT NULL,
    "branchId" TEXT NOT NULL,

    CONSTRAINT "Cashier_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Admin" (
    "id" TEXT NOT NULL,

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Cashier" ADD CONSTRAINT "Cashier_id_fkey" FOREIGN KEY ("id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cashier" ADD CONSTRAINT "Cashier_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "Branch"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Barber" ADD CONSTRAINT "Barber_id_fkey" FOREIGN KEY ("id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Admin" ADD CONSTRAINT "Admin_id_fkey" FOREIGN KEY ("id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Complain" ADD CONSTRAINT "Complain_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Client"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_barberId_fkey" FOREIGN KEY ("barberId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_cashierId_fkey" FOREIGN KEY ("cashierId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
