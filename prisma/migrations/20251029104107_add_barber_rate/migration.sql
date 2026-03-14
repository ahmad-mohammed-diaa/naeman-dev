-- CreateTable
CREATE TABLE "BarberRate" (
    "id" TEXT NOT NULL,
    "barberId" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "rate" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BarberRate_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "BarberRate_barberId_clientId_idx" ON "BarberRate"("barberId", "clientId");

-- AddForeignKey
ALTER TABLE "BarberRate" ADD CONSTRAINT "BarberRate_barberId_fkey" FOREIGN KEY ("barberId") REFERENCES "Barber"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BarberRate" ADD CONSTRAINT "BarberRate_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
