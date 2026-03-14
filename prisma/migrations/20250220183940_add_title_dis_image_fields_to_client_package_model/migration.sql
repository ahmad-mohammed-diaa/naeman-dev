/*
  Warnings:

  - Added the required column `title` to the `ClientPackages` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ClientPackages" ADD COLUMN     "description" TEXT,
ADD COLUMN     "image" TEXT,
ADD COLUMN     "title" TEXT NOT NULL;
