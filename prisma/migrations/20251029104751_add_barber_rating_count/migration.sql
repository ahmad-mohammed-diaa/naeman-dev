/*
  Warnings:

  - You are about to drop the `BarberRate` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."BarberRate" DROP CONSTRAINT "BarberRate_barberId_fkey";

-- DropForeignKey
ALTER TABLE "public"."BarberRate" DROP CONSTRAINT "BarberRate_clientId_fkey";

-- AlterTable
ALTER TABLE "Barber" ALTER COLUMN "rate" SET DEFAULT 0,
ALTER COLUMN "rate" SET DATA TYPE DOUBLE PRECISION;

-- DropTable
DROP TABLE "public"."BarberRate";

-- CreateTable
CREATE TABLE "BarberRating" (
    "id" TEXT NOT NULL,
    "barberId" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "rate" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BarberRating_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "BarberRating_barberId_clientId_idx" ON "BarberRating"("barberId", "clientId");

-- CreateIndex
CREATE UNIQUE INDEX "BarberRating_barberId_clientId_key" ON "BarberRating"("barberId", "clientId");

-- AddForeignKey
ALTER TABLE "BarberRating" ADD CONSTRAINT "BarberRating_barberId_fkey" FOREIGN KEY ("barberId") REFERENCES "Barber"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BarberRating" ADD CONSTRAINT "BarberRating_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
