-- AlterTable
ALTER TABLE "Token" ADD COLUMN     "accessToken" TEXT,
ADD COLUMN     "refreshToken" TEXT,
ADD COLUMN     "userId" TEXT;
