/*
  Warnings:

  - You are about to drop the column `pointLimiit` on the `Settings` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Settings" DROP COLUMN "pointLimiit",
ADD COLUMN     "pointLimit" INTEGER NOT NULL DEFAULT 100;
