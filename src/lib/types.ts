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
interface QuizData {
  id: string;
  title: string;
  userId: string;
  score: number;
  isCompleted: boolean;
  quizQuestions: QuizQuestion[];
}

export type { Question, QuizQuestion, QuizData };
