/*
  Warnings:

  - You are about to drop the column `createAt` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `technicalRole` on the `Project` table. All the data in the column will be lost.
  - The `tools` column on the `Project` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `domain` to the `Project` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Tools" AS ENUM ('C', 'Python', 'Java', 'React', 'Node', 'HTML', 'CSS', 'Javascript', 'MongoDB', 'PostgreSQL', 'API', 'Git', 'ReactNative');

-- CreateEnum
CREATE TYPE "Domain" AS ENUM ('Frontend', 'Backend', 'FullStack', 'MobileDevelopment', 'AIML', 'UIUX');

-- DropIndex
DROP INDEX "Project_id_key";

-- DropIndex
DROP INDEX "User_id_key";

-- AlterTable
ALTER TABLE "Project" DROP COLUMN "createAt",
DROP COLUMN "technicalRole",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "createdById" TEXT,
ADD COLUMN     "domain" "Domain" NOT NULL,
DROP COLUMN "tools",
ADD COLUMN     "tools" "Tools"[],
ALTER COLUMN "usersCount" SET DEFAULT 0;

-- CreateTable
CREATE TABLE "Admin" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Admin_userId_key" ON "Admin"("userId");

-- AddForeignKey
ALTER TABLE "Admin" ADD CONSTRAINT "Admin_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
