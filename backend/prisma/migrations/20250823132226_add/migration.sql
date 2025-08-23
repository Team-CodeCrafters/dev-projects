/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `UserVerification` will be added. If there are existing duplicate values, this will fail.
  - Made the column `expiresAt` on table `UserVerification` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "UserVerification" ALTER COLUMN "expiresAt" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "UserVerification_email_key" ON "UserVerification"("email");
