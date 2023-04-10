/*
  Warnings:

  - You are about to drop the column `cellPhone` on the `Comanda` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[cellphone]` on the table `Comanda` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `cellphone` to the `Comanda` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Comanda_cellPhone_key";

-- AlterTable
ALTER TABLE "Comanda" DROP COLUMN "cellPhone",
ADD COLUMN     "cellphone" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Comanda_cellphone_key" ON "Comanda"("cellphone");
