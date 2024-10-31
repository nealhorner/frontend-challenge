-- AlterTable
ALTER TABLE "Quiz" ADD COLUMN     "completedTimestamp" TIMESTAMP(3),
ADD COLUMN     "startedTimestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
