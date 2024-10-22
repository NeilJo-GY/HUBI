-- CreateTable
CREATE TABLE "Reservation" (
    "id" SERIAL NOT NULL,
    "userAddress" TEXT NOT NULL,
    "grantId" INTEGER NOT NULL,
    "reservedAmount" DECIMAL(65,30) NOT NULL,
    "transactionHash" TEXT NOT NULL,
    "timestamp" BIGINT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Reservation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Reservation_transactionHash_key" ON "Reservation"("transactionHash");
