/*
  Warnings:

  - A unique constraint covering the columns `[userStatsId,date]` on the table `UserStatsTrends` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "UserStatsTrends_date_userStatsId_key";

-- CreateIndex
CREATE UNIQUE INDEX "UserStatsTrends_userStatsId_date_key" ON "UserStatsTrends"("userStatsId", "date");
