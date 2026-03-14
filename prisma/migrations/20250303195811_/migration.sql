/*
  Warnings:

  - You are about to drop the column `name` on the `Branch` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `ClientPackages` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `Packages` table. All the data in the column will be lost.
  - You are about to drop the column `image` on the `Packages` table. All the data in the column will be lost.
  - You are about to drop the column `price` on the `Packages` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `Packages` table. All the data in the column will be lost.
  - You are about to drop the column `price` on the `Points` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `Points` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `notification` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `notification` table. All the data in the column will be lost.
  - You are about to drop the `About` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[phone]` on the table `Branch` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `price` to the `Offers` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Language" AS ENUM ('EN', 'AR');

-- AlterTable
ALTER TABLE "Branch" DROP COLUMN "name";

-- AlterTable
ALTER TABLE "ClientPackages" DROP COLUMN "title";

-- AlterTable
ALTER TABLE "Offers" ADD COLUMN     "image" TEXT,
ADD COLUMN     "price" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Packages" DROP COLUMN "description",
DROP COLUMN "image",
DROP COLUMN "price",
DROP COLUMN "title";

-- AlterTable
ALTER TABLE "Points" DROP COLUMN "price",
DROP COLUMN "title";

-- AlterTable
ALTER TABLE "notification" DROP COLUMN "description",
DROP COLUMN "title";

-- DropTable
DROP TABLE "About";

-- CreateTable
CREATE TABLE "Static" (
    "id" TEXT NOT NULL,

    CONSTRAINT "Static_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "about" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "time" TEXT NOT NULL,

    CONSTRAINT "about_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "questions" (
    "id" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "answer" TEXT NOT NULL,

    CONSTRAINT "questions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Translation" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "language" "Language" NOT NULL,

    CONSTRAINT "Translation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TranslationDes" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "notificationId" TEXT,

    CONSTRAINT "TranslationDes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Translation_name_idx" ON "Translation"("name");

-- CreateIndex
CREATE INDEX "TranslationDes_name_idx" ON "TranslationDes"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Branch_phone_key" ON "Branch"("phone");

-- AddForeignKey
ALTER TABLE "about" ADD CONSTRAINT "about_id_fkey" FOREIGN KEY ("id") REFERENCES "Static"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "questions" ADD CONSTRAINT "questions_id_fkey" FOREIGN KEY ("id") REFERENCES "Static"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Translation" ADD CONSTRAINT "Translation_branch_key" FOREIGN KEY ("id") REFERENCES "Branch"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Translation" ADD CONSTRAINT "Translation_category_key" FOREIGN KEY ("id") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Translation" ADD CONSTRAINT "Translation_service_key" FOREIGN KEY ("id") REFERENCES "Service"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Translation" ADD CONSTRAINT "Translation_offers_key" FOREIGN KEY ("id") REFERENCES "Offers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TranslationDes" ADD CONSTRAINT "Translation_clientPackages_key" FOREIGN KEY ("id") REFERENCES "ClientPackages"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TranslationDes" ADD CONSTRAINT "Translation_notification_key" FOREIGN KEY ("notificationId") REFERENCES "notification"("id") ON DELETE SET NULL ON UPDATE CASCADE;
