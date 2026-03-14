-- AlterTable
ALTER TABLE "Client" ADD COLUMN     "offersId" TEXT;

-- CreateTable
CREATE TABLE "_ClientOffers" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_ClientOffers_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_ClientOffers_B_index" ON "_ClientOffers"("B");

-- AddForeignKey
ALTER TABLE "_ClientOffers" ADD CONSTRAINT "_ClientOffers_A_fkey" FOREIGN KEY ("A") REFERENCES "Client"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ClientOffers" ADD CONSTRAINT "_ClientOffers_B_fkey" FOREIGN KEY ("B") REFERENCES "Offers"("id") ON DELETE CASCADE ON UPDATE CASCADE;
