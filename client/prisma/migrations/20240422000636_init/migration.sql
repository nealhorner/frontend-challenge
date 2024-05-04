/*
  Warnings:

  - You are about to drop the column `quizId` on the `Question` table. All the data in the column will be lost.
  - Added the required column `multipleChoiceOptions` to the `Question` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tags` to the `Question` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "QuizQuestion" (
    "quizId" INTEGER NOT NULL,
    "questionId" INTEGER NOT NULL,

    PRIMARY KEY ("quizId", "questionId"),
    CONSTRAINT "QuizQuestion_quizId_fkey" FOREIGN KEY ("quizId") REFERENCES "Quiz" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "QuizQuestion_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Question" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "prompt" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "multipleChoiceOptions" TEXT NOT NULL,
    "answers" TEXT NOT NULL,
    "tags" TEXT NOT NULL
);
INSERT INTO "new_Question" ("answers", "id", "prompt", "title", "type") SELECT "answers", "id", "prompt", "title", "type" FROM "Question";
DROP TABLE "Question";
ALTER TABLE "new_Question" RENAME TO "Question";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
