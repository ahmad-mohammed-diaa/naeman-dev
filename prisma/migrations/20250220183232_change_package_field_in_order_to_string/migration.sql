/*
  Warnings:

  - You are about to drop the `_UsedPackages` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_UsedPackages" DROP CONSTRAINT "_UsedPackages_A_fkey";

-- DropForeignKey
ALTER TABLE "_UsedPackages" DROP CONSTRAINT "_UsedPackages_B_fkey";

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "usedPackage" TEXT;

-- DropTable
DROP TABLE "_UsedPackages";
