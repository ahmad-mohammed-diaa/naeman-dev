-- DropForeignKey
ALTER TABLE "PackagesServices" DROP CONSTRAINT "PackagesServices_serviceId_fkey";

-- DropForeignKey
ALTER TABLE "Service" DROP CONSTRAINT "Service_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "Translation" DROP CONSTRAINT "Translation_category_key";

-- DropForeignKey
ALTER TABLE "Translation" DROP CONSTRAINT "Translation_service_key";

-- AddForeignKey
ALTER TABLE "Translation" ADD CONSTRAINT "Translation_category_key" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Translation" ADD CONSTRAINT "Translation_service_key" FOREIGN KEY ("serviceId") REFERENCES "Service"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Service" ADD CONSTRAINT "Service_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PackagesServices" ADD CONSTRAINT "PackagesServices_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Service"("id") ON DELETE CASCADE ON UPDATE CASCADE;
