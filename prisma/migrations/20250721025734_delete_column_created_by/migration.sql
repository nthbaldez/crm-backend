/*
  Warnings:

  - You are about to drop the column `created_by` on the `customers` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "customers" DROP CONSTRAINT "customers_created_by_fkey";

-- AlterTable
ALTER TABLE "customers" DROP COLUMN "created_by";
