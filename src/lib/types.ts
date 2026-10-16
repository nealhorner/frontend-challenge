// Type-only re-exports so client code can name the question shapes without
// importing the server module itself.
import type { PublicQuestion, RevealedQuestion } from '$lib/server/questions';

enum QuestionType {
  MultipleChoice = 'multiple_choice',
  BlindAnswer = 'blind_answer'
}

interface QuizQuestion {
  quizId: string;
  questionId: string;
  answer: string | null;
  isAnswered: boolean;
  isCorrect: boolean | null;
  askedTimestamp: Date | null;
  answeredTimestamp: Date | null;
  question: PublicQuestion;
}

type QuizQuestionWithoutQuestion = Omit<QuizQuestion, 'question'>;

interface QuizData {
  id: string;
  title: string;
  userId: string;
  score: number;
  isCompleted: boolean;
  quizQuestions: QuizQuestion[];
}

interface QuizDataWithoutQuestions {
  id: string;
  title: string;
  userId: string;
  score: number;
  isCompleted: boolean;
  quizQuestions: QuizQuestionWithoutQuestion[];
}

interface ParsedMultipleChoiceOptions {
  label: string;
  value: string;
}

export { QuestionType };

export type {
  PublicQuestion,
  RevealedQuestion,
  QuizQuestion,
  QuizData,
  QuizDataWithoutQuestions,
  ParsedMultipleChoiceOptions
};
