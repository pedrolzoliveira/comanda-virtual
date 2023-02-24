-- CreateEnum
CREATE TYPE "TransactionType" AS ENUM ('payment', 'charge');

-- CreateTable
CREATE TABLE "Comanda" (
    "id" TEXT NOT NULL,
    "cellPhone" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,

    CONSTRAINT "Comanda_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Transaction" (
    "id" TEXT NOT NULL,
    "comandaId" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "type" "TransactionType" NOT NULL,

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Comanda_cellPhone_key" ON "Comanda"("cellPhone");

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_comandaId_fkey" FOREIGN KEY ("comandaId") REFERENCES "Comanda"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
