/*
  Warnings:

  - You are about to drop the `CLient` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "CLient" DROP CONSTRAINT "CLient_userId_fkey";

-- DropForeignKey
ALTER TABLE "Complain" DROP CONSTRAINT "Complain_clientId_fkey";

-- DropTable
DROP TABLE "CLient";

-- CreateTable
CREATE TABLE "Client" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "referralCode" TEXT,
    "points" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Client_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Token" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL,

    CONSTRAINT "Token_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Client_userId_key" ON "Client"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Client_referralCode_key" ON "Client"("referralCode");

-- AddForeignKey
ALTER TABLE "Client" ADD CONSTRAINT "Client_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Complain" ADD CONSTRAINT "Complain_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
