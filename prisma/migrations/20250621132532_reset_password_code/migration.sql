-- CreateTable
CREATE TABLE "ResetPassword" (
    "id" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "expiredAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ResetPassword_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ResetPassword_phone_key" ON "ResetPassword"("phone");

-- CreateIndex
CREATE INDEX "ResetPassword_phone_idx" ON "ResetPassword"("phone");
