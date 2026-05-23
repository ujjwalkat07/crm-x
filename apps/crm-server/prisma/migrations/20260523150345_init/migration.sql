/*
  Warnings:

  - You are about to drop the column `currency` on the `Lead` table. All the data in the column will be lost.
  - You are about to drop the column `dealValue` on the `Lead` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Lead" DROP COLUMN "currency",
DROP COLUMN "dealValue";
