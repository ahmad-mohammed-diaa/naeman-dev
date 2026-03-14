-- AlterTable
ALTER TABLE "Packages" ADD COLUMN     "count" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "type" "PackagesStatus" NOT NULL DEFAULT 'SINGLE';

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "fcmToken" TEXT;
