/*
  Warnings:

  - Added the required column `packageId` to the `ClientPackages` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ClientPackages" ADD COLUMN     "packageId" TEXT NOT NULL;
