/*
  Warnings:

  - You are about to drop the `UserDetails` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "UserDetails" DROP CONSTRAINT "UserDetails_userId_fkey";

-- DropTable
DROP TABLE "UserDetails";

-- CreateTable
CREATE TABLE "UserDetail" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "company" TEXT,
    "website" TEXT,
    "location" TEXT,
    "github" TEXT,
    "linkedIn" TEXT,
    "twitter" TEXT,
    "bluesky" TEXT,
    "pronouns" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserDetail_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserDetail_userId_key" ON "UserDetail"("userId");

-- CreateIndex
CREATE INDEX "UserDetail_userId_idx" ON "UserDetail"("userId");

-- AddForeignKey
ALTER TABLE "UserDetail" ADD CONSTRAINT "UserDetail_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
