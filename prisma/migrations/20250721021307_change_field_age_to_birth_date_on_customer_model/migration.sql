/*
  Warnings:

  - You are about to drop the column `age` on the `customers` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "customers" DROP COLUMN "age",
ADD COLUMN     "birth_date" TIMESTAMP(3);
