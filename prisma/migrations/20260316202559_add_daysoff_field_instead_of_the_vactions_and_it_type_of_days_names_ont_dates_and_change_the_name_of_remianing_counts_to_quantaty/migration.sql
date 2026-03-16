/*
  Warnings:

  - You are about to drop the column `remainingCount` on the `PackagesServices` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Barber" ADD COLUMN     "daysOff" "Days"[];

-- AlterTable
ALTER TABLE "Cashier" ADD COLUMN     "daysOff" "Days"[];

-- AlterTable
ALTER TABLE "PackagesServices" 
RENAME COLUMN  "remainingCount" TO   "quantity" ;
