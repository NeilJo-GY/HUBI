/*
  Warnings:

  - You are about to drop the column `updatedAt` on the `Reservation` table. All the data in the column will be lost.
  - You are about to alter the column `timestamp` on the `Reservation` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - Added the required column `addressLink` to the `Reservation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `linkColor` to the `Reservation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `timeAgo` to the `Reservation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `txLink` to the `Reservation` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Reservation" DROP COLUMN "updatedAt",
ADD COLUMN     "addressLink" TEXT NOT NULL,
ADD COLUMN     "linkColor" TEXT NOT NULL,
ADD COLUMN     "timeAgo" TEXT NOT NULL,
ADD COLUMN     "txLink" TEXT NOT NULL,
ALTER COLUMN "reservedAmount" SET DATA TYPE TEXT,
ALTER COLUMN "timestamp" SET DATA TYPE INTEGER;
