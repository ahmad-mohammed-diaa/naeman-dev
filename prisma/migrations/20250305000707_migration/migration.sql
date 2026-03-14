/*
  Warnings:

  - Added the required column `staticId` to the `questions` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "questions" DROP CONSTRAINT "questions_id_fkey";

-- AlterTable
ALTER TABLE "questions" ADD COLUMN     "staticId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "questions" ADD CONSTRAINT "questions_staticId_fkey" FOREIGN KEY ("staticId") REFERENCES "Static"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
