/*
  Warnings:

  - Made the column `quantity` on table `PackagesServices` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "PackagesServices" ALTER COLUMN "quantity" SET NOT NULL,
ALTER COLUMN "quantity" SET DEFAULT 1;
