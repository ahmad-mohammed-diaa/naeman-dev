/*
  Warnings:

  - You are about to drop the column `packagesId` on the `Service` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Service" DROP CONSTRAINT "Service_packagesId_fkey";

-- AlterTable
ALTER TABLE "Service" DROP COLUMN "packagesId";

-- CreateTable
CREATE TABLE "_PackagesToServices" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_PackagesToServices_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_PackagesToServices_B_index" ON "_PackagesToServices"("B");

-- AddForeignKey
ALTER TABLE "_PackagesToServices" ADD CONSTRAINT "_PackagesToServices_A_fkey" FOREIGN KEY ("A") REFERENCES "Packages"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PackagesToServices" ADD CONSTRAINT "_PackagesToServices_B_fkey" FOREIGN KEY ("B") REFERENCES "Service"("id") ON DELETE CASCADE ON UPDATE CASCADE;
