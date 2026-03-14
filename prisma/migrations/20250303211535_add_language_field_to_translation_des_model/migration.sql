/*
  Warnings:

  - Added the required column `language` to the `TranslationDes` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "TranslationDes" ADD COLUMN     "language" "Language" NOT NULL;
