/*
  Warnings:

  - You are about to drop the column `email` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `emailVerified` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `hashedPassword` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `User` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "UserDetail" DROP CONSTRAINT "UserDetail_userId_fkey";

-- DropIndex
DROP INDEX "User_email_key";

-- DropIndex
DROP INDEX "User_name_key";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "email",
DROP COLUMN "emailVerified",
DROP COLUMN "hashedPassword",
DROP COLUMN "name";

-- CreateTable
CREATE TABLE "UserGuest" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "UserGuest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserAuthenticated" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "hashedPassword" TEXT NOT NULL,
    "emailVerified" BOOLEAN NOT NULL DEFAULT false,
    "userId" TEXT NOT NULL,

    CONSTRAINT "UserAuthenticated_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserGuest_userId_key" ON "UserGuest"("userId");

-- CreateIndex
CREATE INDEX "UserGuest_userId_idx" ON "UserGuest"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "UserAuthenticated_email_key" ON "UserAuthenticated"("email");

-- CreateIndex
CREATE UNIQUE INDEX "UserAuthenticated_name_key" ON "UserAuthenticated"("name");

-- CreateIndex
CREATE UNIQUE INDEX "UserAuthenticated_userId_key" ON "UserAuthenticated"("userId");

-- CreateIndex
CREATE INDEX "UserAuthenticated_userId_idx" ON "UserAuthenticated"("userId");

-- AddForeignKey
ALTER TABLE "UserGuest" ADD CONSTRAINT "UserGuest_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserAuthenticated" ADD CONSTRAINT "UserAuthenticated_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserDetail" ADD CONSTRAINT "UserDetail_userId_fkey" FOREIGN KEY ("userId") REFERENCES "UserAuthenticated"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
