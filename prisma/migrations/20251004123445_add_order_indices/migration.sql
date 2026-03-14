-- CreateIndex
CREATE INDEX "Order_barberId_date_idx" ON "Order"("barberId", "date");

-- CreateIndex
CREATE INDEX "Order_userId_date_idx" ON "Order"("userId", "date");

-- CreateIndex
CREATE INDEX "Order_cashierId_date_idx" ON "Order"("cashierId", "date");

-- CreateIndex
CREATE INDEX "Order_date_booking_status_idx" ON "Order"("date", "booking", "status");
