/*
  Warnings:

  - You are about to drop the column `ClientPackagesId` on the `PackagesServices` table. All the data in the column will be lost.
  - You are about to drop the column `PointsPercentage` on the `Settings` table. All the data in the column will be lost.
  - Added the required column `clientPackagesId` to the `PackagesServices` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "OrderItemSource" AS ENUM ('SERVICE', 'PACKAGE');

-- DropForeignKey
ALTER TABLE "PackagesServices" DROP CONSTRAINT "PackagesServices_ClientPackagesId_fkey";

-- AlterTable
ALTER TABLE "Branch" ADD COLUMN     "closingHour" INTEGER NOT NULL DEFAULT 24,
ADD COLUMN     "openingHour" INTEGER NOT NULL DEFAULT 6;


-- AlterTable
ALTER TABLE "PackagesServices" 
RENAME COLUMN  "ClientPackagesId" TO  "clientPackagesId" ;

-- AlterTable
ALTER TABLE "Settings" 
RENAME COLUMN  "PointsPercentage" TO  "pointsPercentage" ;

-- CreateTable
CREATE TABLE "OrderItem" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "serviceId" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "source" "OrderItemSource" NOT NULL,

    CONSTRAINT "OrderItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "idempotency_keys" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "orderId" TEXT,
    "expiredAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "idempotency_keys_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "idempotency_keys_key_key" ON "idempotency_keys"("key");

-- CreateIndex
CREATE INDEX "idempotency_keys_key_idx" ON "idempotency_keys"("key");

-- CreateIndex
CREATE INDEX "Order_branchId_date_idx" ON "Order"("branchId", "date");

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Service"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PackagesServices" ADD CONSTRAINT "PackagesServices_clientPackagesId_fkey" FOREIGN KEY ("clientPackagesId") REFERENCES "ClientPackages"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
