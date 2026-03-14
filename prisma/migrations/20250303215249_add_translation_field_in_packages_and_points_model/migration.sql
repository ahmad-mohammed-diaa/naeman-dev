-- DropForeignKey
ALTER TABLE "Translation" DROP CONSTRAINT "Translation_offers_key";

-- AddForeignKey
ALTER TABLE "Translation" ADD CONSTRAINT "Translation_offers_key" FOREIGN KEY ("id") REFERENCES "Packages"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Translation" ADD CONSTRAINT "Translation_id_fkey" FOREIGN KEY ("id") REFERENCES "Points"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
