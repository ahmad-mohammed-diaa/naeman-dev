/*
  Warnings:

  - The primary key for the `Client` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `userId` on the `Client` table. All the data in the column will be lost.
  - You are about to drop the column `complain` on the `Complain` table. All the data in the column will be lost.
  - The required column `id` was added to the `Client` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `message` to the `Complain` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Client" DROP CONSTRAINT "Client_userId_fkey";

-- DropForeignKey
ALTER TABLE "Complain" DROP CONSTRAINT "Complain_userId_fkey";

-- AlterTable
ALTER TABLE "Client" DROP CONSTRAINT "Client_pkey",
DROP COLUMN "userId",
ADD COLUMN     "id" TEXT NOT NULL,
ADD CONSTRAINT "Client_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Complain" DROP COLUMN "complain",
ADD COLUMN     "message" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Client" ADD CONSTRAINT "Client_id_fkey" FOREIGN KEY ("id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Complain" ADD CONSTRAINT "Complain_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Client"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
