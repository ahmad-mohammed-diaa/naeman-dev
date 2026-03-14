-- DropForeignKey
ALTER TABLE "notification" DROP CONSTRAINT "notification_userId_fkey";

-- CreateTable
CREATE TABLE "_notifications" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_notifications_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_notifications_B_index" ON "_notifications"("B");

-- AddForeignKey
ALTER TABLE "_notifications" ADD CONSTRAINT "_notifications_A_fkey" FOREIGN KEY ("A") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_notifications" ADD CONSTRAINT "_notifications_B_fkey" FOREIGN KEY ("B") REFERENCES "notification"("id") ON DELETE CASCADE ON UPDATE CASCADE;
