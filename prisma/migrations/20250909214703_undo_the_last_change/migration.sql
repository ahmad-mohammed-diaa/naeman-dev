/*
  Warnings:

  - Made the column `effectiveAt` on table `Slot` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Slot" ALTER COLUMN "effectiveAt" SET NOT NULL;
