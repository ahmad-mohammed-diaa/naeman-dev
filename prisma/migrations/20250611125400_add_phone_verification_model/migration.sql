-- CreateTable
CREATE TABLE "PhoneVerification" (
    "id" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "expiredAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PhoneVerification_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PhoneVerification_phone_key" ON "PhoneVerification"("phone");

-- CreateIndex
CREATE INDEX "PhoneVerification_phone_idx" ON "PhoneVerification"("phone");
