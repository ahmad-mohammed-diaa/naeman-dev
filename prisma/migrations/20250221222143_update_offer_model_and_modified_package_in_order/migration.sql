/*
  Warnings:

  - You are about to drop the column `description` on the `Offers` table. All the data in the column will be lost.
  - You are about to drop the column `image` on the `Offers` table. All the data in the column will be lost.
  - You are about to drop the column `pointsId` on the `Offers` table. All the data in the column will be lost.
  - You are about to drop the column `price` on the `Offers` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `Offers` table. All the data in the column will be lost.
  - The `usedPackage` column on the `Order` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `createdAt` on the `Packages` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Packages` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Points` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Points` table. All the data in the column will be lost.
  - You are about to drop the `_ClientOffers` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `offerType` to the `Offers` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "OfferType" AS ENUM ('POINT', 'PACKAGE');

-- DropForeignKey
ALTER TABLE "Service" DROP CONSTRAINT "Service_offersId_fkey";

-- DropForeignKey
ALTER TABLE "_ClientOffers" DROP CONSTRAINT "_ClientOffers_A_fkey";

-- DropForeignKey
ALTER TABLE "_ClientOffers" DROP CONSTRAINT "_ClientOffers_B_fkey";

-- AlterTable
ALTER TABLE "Offers" DROP COLUMN "description",
DROP COLUMN "image",
DROP COLUMN "pointsId",
DROP COLUMN "price",
DROP COLUMN "title",
ADD COLUMN     "offerType" "OfferType" NOT NULL;

-- AlterTable
ALTER TABLE "Order" DROP COLUMN "usedPackage",
ADD COLUMN     "usedPackage" TEXT[];

-- AlterTable
ALTER TABLE "Packages" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt",
ADD COLUMN     "offersId" TEXT;

-- AlterTable
ALTER TABLE "Points" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt",
ADD COLUMN     "offersId" TEXT;

-- DropTable
DROP TABLE "_ClientOffers";

-- AddForeignKey
ALTER TABLE "Packages" ADD CONSTRAINT "Packages_offersId_fkey" FOREIGN KEY ("offersId") REFERENCES "Offers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Points" ADD CONSTRAINT "Points_offersId_fkey" FOREIGN KEY ("offersId") REFERENCES "Offers"("id") ON DELETE SET NULL ON UPDATE CASCADE;
