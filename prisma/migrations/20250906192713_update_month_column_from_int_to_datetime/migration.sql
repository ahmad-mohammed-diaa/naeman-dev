/*
  Warnings:

  - The `month` column on the `Vacation` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Vacation" DROP COLUMN "month",
ADD COLUMN     "month" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
