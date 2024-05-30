-- AlterTable
ALTER TABLE "User" ADD COLUMN     "authToken" TEXT,
ADD COLUMN     "emailVerified" BOOLEAN NOT NULL DEFAULT false;
