/*
  Warnings:

  - You are about to drop the column `name` on the `Category` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Service` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Category" DROP COLUMN "name";

-- AlterTable
ALTER TABLE "Service" DROP COLUMN "name";
