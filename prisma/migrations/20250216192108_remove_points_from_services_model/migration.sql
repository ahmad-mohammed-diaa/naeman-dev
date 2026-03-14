/*
  Warnings:

  - You are about to drop the column `promoCodeId` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `gainPoints` on the `Service` table. All the data in the column will be lost.
  - You are about to drop the column `points` on the `Service` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "PackagesStatus" AS ENUM ('MULTIPLE', 'SINGLE');

-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_promoCodeId_fkey";

-- AlterTable
ALTER TABLE "Order" DROP COLUMN "promoCodeId",
ADD COLUMN     "promoCode" TEXT;

-- AlterTable
ALTER TABLE "PromoCode" ADD COLUMN     "active" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "Service" DROP COLUMN "gainPoints",
DROP COLUMN "points",
ADD COLUMN     "offersId" TEXT,
ADD COLUMN     "packagesId" TEXT;

-- CreateTable
CREATE TABLE "Settings" (
    "id" TEXT NOT NULL,
    "PointsPercentage" INTEGER NOT NULL DEFAULT 10,

    CONSTRAINT "Settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "About" (
    "id" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "time" TEXT NOT NULL,

    CONSTRAINT "About_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Points" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "points" INTEGER NOT NULL,
    "price" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Points_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Packages" (
    "id" TEXT NOT NULL,
    "description" TEXT,
    "title" TEXT NOT NULL,
    "image" TEXT,
    "price" INTEGER NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Packages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PackagesServices" (
    "id" TEXT NOT NULL,
    "serviceId" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "usedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "count" INTEGER,
    "orderId" TEXT,
    "ClientPackagesId" TEXT NOT NULL,

    CONSTRAINT "PackagesServices_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClientPackages" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "clientId" TEXT NOT NULL,

    CONSTRAINT "ClientPackages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Offers" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "image" TEXT,
    "price" INTEGER NOT NULL,
    "pointsId" TEXT,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Offers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ClientOffers" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_ClientOffers_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_ClientOffers_B_index" ON "_ClientOffers"("B");

-- CreateIndex
CREATE INDEX "Client_referralCode_idx" ON "Client"("referralCode");

-- CreateIndex
CREATE INDEX "users_phone_idx" ON "users"("phone");

-- CreateIndex
CREATE INDEX "users_role_idx" ON "users"("role");

-- AddForeignKey
ALTER TABLE "Service" ADD CONSTRAINT "Service_offersId_fkey" FOREIGN KEY ("offersId") REFERENCES "Offers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Service" ADD CONSTRAINT "Service_packagesId_fkey" FOREIGN KEY ("packagesId") REFERENCES "Packages"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_promoCode_fkey" FOREIGN KEY ("promoCode") REFERENCES "PromoCode"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PackagesServices" ADD CONSTRAINT "PackagesServices_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Service"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PackagesServices" ADD CONSTRAINT "PackagesServices_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PackagesServices" ADD CONSTRAINT "PackagesServices_ClientPackagesId_fkey" FOREIGN KEY ("ClientPackagesId") REFERENCES "ClientPackages"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClientPackages" ADD CONSTRAINT "ClientPackages_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ClientOffers" ADD CONSTRAINT "_ClientOffers_A_fkey" FOREIGN KEY ("A") REFERENCES "Client"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ClientOffers" ADD CONSTRAINT "_ClientOffers_B_fkey" FOREIGN KEY ("B") REFERENCES "Offers"("id") ON DELETE CASCADE ON UPDATE CASCADE;
