-- CreateEnum
CREATE TYPE "Difficulty" AS ENUM ('Beginner', 'Intermediate', 'Expert', 'Master');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "displayName" TEXT,
    "profilePicture" TEXT
);

-- CreateTable
CREATE TABLE "Project" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "about" TEXT NOT NULL,
    "images" TEXT[],
    "requirement" TEXT NOT NULL,
    "tools" TEXT[],
    "usersCount" INTEGER NOT NULL,
    "difficulty" "Difficulty" NOT NULL,
    "technicalRole" TEXT NOT NULL,
    "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_id_key" ON "User"("id");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Project_id_key" ON "Project"("id");
