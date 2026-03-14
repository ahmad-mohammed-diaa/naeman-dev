/*
  Warnings:

  - You are about to drop the column `date` on the `Vacation` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Vacation" DROP COLUMN "date",
ADD COLUMN     "dates" TIMESTAMP(3)[],
ADD COLUMN     "month" INTEGER NOT NULL DEFAULT 1;
