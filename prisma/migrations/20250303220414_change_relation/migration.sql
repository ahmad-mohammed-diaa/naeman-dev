/*
  Warnings:

  - You are about to drop the column `image` on the `Offers` table. All the data in the column will be lost.
  - You are about to drop the column `price` on the `Offers` table. All the data in the column will be lost.
  - You are about to drop the column `notificationId` on the `TranslationDes` table. All the data in the column will be lost.
  - Added the required column `image` to the `Packages` table without a default value. This is not possible if the table is not empty.
  - Added the required column `price` to the `Packages` table without a default value. This is not possible if the table is not empty.
  - Added the required column `image` to the `Points` table without a default value. This is not possible if the table is not empty.
  - Added the required column `price` to the `Points` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `notification` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Translation" DROP CONSTRAINT "Translation_id_fkey";

-- DropForeignKey
ALTER TABLE "Translation" DROP CONSTRAINT "Translation_offers_key";

-- DropForeignKey
ALTER TABLE "TranslationDes" DROP CONSTRAINT "Translation_notification_key";

-- AlterTable
ALTER TABLE "Offers" DROP COLUMN "image",
DROP COLUMN "price";

-- AlterTable
ALTER TABLE "Packages" ADD COLUMN     "image" TEXT NOT NULL,
ADD COLUMN     "price" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Points" ADD COLUMN     "image" TEXT NOT NULL,
ADD COLUMN     "price" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Translation" ADD COLUMN     "pointsId" TEXT;

-- AlterTable
ALTER TABLE "TranslationDes" DROP COLUMN "notificationId";

-- AlterTable
ALTER TABLE "notification" ADD COLUMN     "title" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "TranslationDes" ADD CONSTRAINT "TranslationDes_id_fkey" FOREIGN KEY ("id") REFERENCES "Points"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TranslationDes" ADD CONSTRAINT "Translation_package_key" FOREIGN KEY ("id") REFERENCES "Packages"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
