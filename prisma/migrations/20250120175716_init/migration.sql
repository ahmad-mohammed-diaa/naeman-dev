/*
  Warnings:

  - The values [UPCOMING,PAST] on the enum `OrderStatus` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `barberId` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `time` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `complain` on the `User` table. All the data in the column will be lost.
  - Added the required column `slot` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "BookingStatus" AS ENUM ('UPCOMING', 'PAST', 'CANCELLED');

-- AlterEnum
BEGIN;
CREATE TYPE "OrderStatus_new" AS ENUM ('PENDING', 'IN_PROGRESS', 'COMPLETED', 'PAID', 'CANCELLED');
ALTER TABLE "Order" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Order" ALTER COLUMN "status" TYPE "OrderStatus_new" USING ("status"::text::"OrderStatus_new");
ALTER TYPE "OrderStatus" RENAME TO "OrderStatus_old";
ALTER TYPE "OrderStatus_new" RENAME TO "OrderStatus";
DROP TYPE "OrderStatus_old";
ALTER TABLE "Order" ALTER COLUMN "status" SET DEFAULT 'PENDING';
COMMIT;

-- AlterTable
ALTER TABLE "Branch" ADD COLUMN     "rate" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "Category" ADD COLUMN     "available" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "Order" DROP COLUMN "barberId",
DROP COLUMN "time",
ADD COLUMN     "booking" "BookingStatus" NOT NULL DEFAULT 'UPCOMING',
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "slot" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "status" SET DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "available" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "Service" ADD COLUMN     "available" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "serviceImg" TEXT;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "complain",
ADD COLUMN     "rate" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "Complain" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "complain" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Complain_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Slot" (
    "id" TEXT NOT NULL,
    "start" TIMESTAMP(3) NOT NULL,
    "end" TIMESTAMP(3) NOT NULL,
    "slot" TEXT[],

    CONSTRAINT "Slot_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Complain" ADD CONSTRAINT "Complain_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
