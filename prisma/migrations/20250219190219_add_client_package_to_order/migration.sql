/*
  Warnings:

  - You are about to drop the column `count` on the `PackagesServices` table. All the data in the column will be lost.
  - You are about to drop the column `orderId` on the `PackagesServices` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "PackagesServices" DROP CONSTRAINT "PackagesServices_orderId_fkey";

-- AlterTable
ALTER TABLE "PackagesServices" DROP COLUMN "count",
DROP COLUMN "orderId",
ADD COLUMN     "remainingCount" INTEGER;

-- CreateTable
CREATE TABLE "_UsedPackages" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_UsedPackages_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_UsedPackages_B_index" ON "_UsedPackages"("B");

-- AddForeignKey
ALTER TABLE "_UsedPackages" ADD CONSTRAINT "_UsedPackages_A_fkey" FOREIGN KEY ("A") REFERENCES "ClientPackages"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UsedPackages" ADD CONSTRAINT "_UsedPackages_B_fkey" FOREIGN KEY ("B") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;
