/*
  Warnings:

  - You are about to drop the column `offersId` on the `Packages` table. All the data in the column will be lost.
  - You are about to drop the column `offersId` on the `Points` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Packages" DROP CONSTRAINT "Packages_offersId_fkey";

-- DropForeignKey
ALTER TABLE "Points" DROP CONSTRAINT "Points_offersId_fkey";

-- AlterTable
ALTER TABLE "Packages" DROP COLUMN "offersId";

-- AlterTable
ALTER TABLE "Points" DROP COLUMN "offersId";

-- AddForeignKey
ALTER TABLE "Packages" ADD CONSTRAINT "Packages_id_fkey" FOREIGN KEY ("id") REFERENCES "Offers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Points" ADD CONSTRAINT "Points_id_fkey" FOREIGN KEY ("id") REFERENCES "Offers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
