/*
  Warnings:

  - Added the required column `latitude` to the `Branch` table without a default value. This is not possible if the table is not empty.
  - Added the required column `longitude` to the `Branch` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Branch" ADD COLUMN     "latitude" TEXT NOT NULL,
ADD COLUMN     "longitude" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Client" ADD COLUMN     "ban" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Complain" ADD COLUMN     "done" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Settings" ADD COLUMN     "canceledOrder" INTEGER NOT NULL DEFAULT 3,
ADD COLUMN     "pointLimiit" INTEGER NOT NULL DEFAULT 100,
ADD COLUMN     "referralPoints" INTEGER NOT NULL DEFAULT 1000;
