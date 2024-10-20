-- AlterTable
ALTER TABLE "QuizQuestion" ALTER COLUMN "answer" DROP NOT NULL,
ALTER COLUMN "answeredTimestamp" DROP NOT NULL,
ALTER COLUMN "askedTimestamp" DROP NOT NULL,
ALTER COLUMN "isAnswered" SET DEFAULT false,
ALTER COLUMN "isCorrect" DROP NOT NULL;
