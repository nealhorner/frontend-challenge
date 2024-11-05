interface Question {
  id: string;
  family: string;
  title: string;
  prompt: string;
  type: string;
  multipleChoiceOptions: string;
  answers: string;
  tags: string;
}
interface QuizQuestion {
  quizId: string;
  questionId: string;
  answer: string | null;
  isAnswered: boolean;
  isCorrect: boolean | null;
  askedTimestamp: Date | null;
  answeredTimestamp: Date | null;
  question: Question;
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

export type {
  Question,
  QuizQuestion,
  QuizData,
  QuizDataWithoutQuestions,
  ParsedMultipleChoiceOptions
};
