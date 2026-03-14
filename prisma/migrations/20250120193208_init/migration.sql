/*
  Warnings:

  - You are about to drop the column `orderId` on the `Service` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Service" DROP CONSTRAINT "Service_orderId_fkey";

-- AlterTable
ALTER TABLE "Service" DROP COLUMN "orderId";

-- CreateTable
CREATE TABLE "_OrderToServices" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_OrderToServices_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_OrderToServices_B_index" ON "_OrderToServices"("B");

-- AddForeignKey
ALTER TABLE "_OrderToServices" ADD CONSTRAINT "_OrderToServices_A_fkey" FOREIGN KEY ("A") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_OrderToServices" ADD CONSTRAINT "_OrderToServices_B_fkey" FOREIGN KEY ("B") REFERENCES "Service"("id") ON DELETE CASCADE ON UPDATE CASCADE;
