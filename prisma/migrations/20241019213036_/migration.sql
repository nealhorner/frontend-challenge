/*
  Warnings:

  - You are about to drop the `QuizResult` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `answer` to the `QuizQuestion` table without a default value. This is not possible if the table is not empty.
  - Added the required column `answeredTimestamp` to the `QuizQuestion` table without a default value. This is not possible if the table is not empty.
  - Added the required column `askedTimestamp` to the `QuizQuestion` table without a default value. This is not possible if the table is not empty.
  - Added the required column `isAnswered` to the `QuizQuestion` table without a default value. This is not possible if the table is not empty.
  - Added the required column `isCorrect` to the `QuizQuestion` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "QuizResult" DROP CONSTRAINT "QuizResult_quizId_fkey";

-- AlterTable
ALTER TABLE "QuizQuestion" ADD COLUMN     "answer" TEXT NOT NULL,
ADD COLUMN     "answeredTimestamp" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "askedTimestamp" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "isAnswered" BOOLEAN NOT NULL,
ADD COLUMN     "isCorrect" BOOLEAN NOT NULL;

-- DropTable
DROP TABLE "QuizResult";
