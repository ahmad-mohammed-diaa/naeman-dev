-- DropForeignKey
ALTER TABLE "Translation" DROP CONSTRAINT "Translation_branch_key";

-- DropForeignKey
ALTER TABLE "Translation" DROP CONSTRAINT "Translation_category_key";

-- DropForeignKey
ALTER TABLE "Translation" DROP CONSTRAINT "Translation_service_key";

-- DropForeignKey
ALTER TABLE "TranslationDes" DROP CONSTRAINT "TranslationDes_id_fkey";

-- DropForeignKey
ALTER TABLE "TranslationDes" DROP CONSTRAINT "Translation_clientPackages_key";

-- DropForeignKey
ALTER TABLE "TranslationDes" DROP CONSTRAINT "Translation_package_key";

-- AlterTable
ALTER TABLE "Translation" ADD COLUMN     "branchId" TEXT,
ADD COLUMN     "categoryId" TEXT,
ADD COLUMN     "serviceId" TEXT;

-- AlterTable
ALTER TABLE "TranslationDes" ADD COLUMN     "clientPackageId" TEXT,
ADD COLUMN     "packageId" TEXT,
ADD COLUMN     "pointsId" TEXT;

-- AddForeignKey
ALTER TABLE "Translation" ADD CONSTRAINT "Translation_branch_key" FOREIGN KEY ("branchId") REFERENCES "Branch"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Translation" ADD CONSTRAINT "Translation_category_key" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Translation" ADD CONSTRAINT "Translation_service_key" FOREIGN KEY ("serviceId") REFERENCES "Service"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TranslationDes" ADD CONSTRAINT "Translation_clientPackages_key" FOREIGN KEY ("clientPackageId") REFERENCES "ClientPackages"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TranslationDes" ADD CONSTRAINT "TranslationDes_pointsId_fkey" FOREIGN KEY ("pointsId") REFERENCES "Points"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TranslationDes" ADD CONSTRAINT "Translation_package_key" FOREIGN KEY ("packageId") REFERENCES "Packages"("id") ON DELETE SET NULL ON UPDATE CASCADE;
