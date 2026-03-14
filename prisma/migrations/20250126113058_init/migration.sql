/*
  Warnings:

  - You are about to drop the column `userId` on the `Complain` table. All the data in the column will be lost.
  - You are about to drop the column `duration` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `clientId` to the `Complain` table without a default value. This is not possible if the table is not empty.
  - Added the required column `barberId` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `gainPoints` to the `Service` table without a default value. This is not possible if the table is not empty.
  - Added the required column `points` to the `Service` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `start` on the `Slot` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `end` on the `Slot` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "Complain" DROP CONSTRAINT "Complain_userId_fkey";

-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_userId_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_branchId_fkey";

-- AlterTable
ALTER TABLE "Complain" DROP COLUMN "userId",
ADD COLUMN     "clientId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Order" DROP COLUMN "duration",
ADD COLUMN     "barberId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Service" ADD COLUMN     "gainPoints" INTEGER NOT NULL,
ADD COLUMN     "points" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Slot" DROP COLUMN "start",
ADD COLUMN     "start" INTEGER NOT NULL,
DROP COLUMN "end",
ADD COLUMN     "end" INTEGER NOT NULL;

-- DropTable
DROP TABLE "User";

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "avatar" TEXT NOT NULL DEFAULT 'https://i.ibb.co/P50Hk9p/avatar.png',
    "phone" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'USER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CLient" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "referralCode" TEXT,
    "points" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "CLient_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Barber" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "rate" INTEGER NOT NULL DEFAULT 0,
    "branchId" TEXT NOT NULL,

    CONSTRAINT "Barber_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_phone_key" ON "users"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "CLient_userId_key" ON "CLient"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Barber_userId_key" ON "Barber"("userId");

-- AddForeignKey
ALTER TABLE "CLient" ADD CONSTRAINT "CLient_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Barber" ADD CONSTRAINT "Barber_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Barber" ADD CONSTRAINT "Barber_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "Branch"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Complain" ADD CONSTRAINT "Complain_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "CLient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_barberId_fkey" FOREIGN KEY ("barberId") REFERENCES "Barber"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
