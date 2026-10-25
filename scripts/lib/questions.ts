/**
 * Turns the records in data/questions.json into the rows stored in the
 * Question table. Shared by the destructive `db:seed` and the idempotent
 * `seedReferenceData` deploy step.
 */
import { QuestionType } from '$lib/types';

// A record as written in data/questions.json
export interface RawQuestion {
  title: string;
  prompt: string;
  answers: string[];
  false_answers: string[];
  tags: string[];
}

export interface GeneratedQuestion {
  title: string;
  prompt: string;
  type: QuestionType;
  multiple_choice: string[];
  answers: string[];
  tags: string[];
}

export const shuffleArray = (array: string[]) => {
  const shuffled: string[] = [];
  const arrayCopy = array.concat();
  while (arrayCopy.length > 0) {
    const randomIndex = Math.floor(Math.random() * arrayCopy.length);
    shuffled.push(arrayCopy[randomIndex]);
    arrayCopy.splice(randomIndex, 1);
  }
  return shuffled;
};

/** Every question variant (multiple choice, "none correct", blind answer) for one record. */
export const generateQuestionPermutations = (question: RawQuestion) => {
  const permutations: GeneratedQuestion[] = [];

  // Multiple choice: the correct answers plus up to three wrong ones
  if (question.false_answers.length > 0) {
    const shuffledFalseAnswers = shuffleArray(question.false_answers);
    permutations.push({
      title: question.title,
      prompt: question.prompt,
      type: QuestionType.MultipleChoice,
      multiple_choice: question.answers.concat(shuffledFalseAnswers.slice(0, 3)),
      answers: question.answers,
      tags: question.tags
    });
  }

  // Multiple choice where none of the options is correct
  if (question.false_answers.length > 1) {
    const shuffledFalseAnswers = shuffleArray(question.false_answers);
    permutations.push({
      title: question.title,
      prompt: question.prompt,
      type: QuestionType.MultipleChoice,
      multiple_choice: shuffledFalseAnswers.slice(0, 4),
      answers: [],
      tags: question.tags
    });
  }

  // Blind answer: no options, the user types the answer
  permutations.push({
    title: question.title,
    prompt: question.prompt,
    type: QuestionType.BlindAnswer,
    multiple_choice: [],
    answers: question.answers,
    tags: question.tags
  });

  return permutations;
};

/** Question rows ready for `prisma.question.createMany`. One shared `family` id links a record's variants. */
export const buildQuestionRows = (records: RawQuestion[]) =>
  records.flatMap((record) => {
    const family = crypto.randomUUID();
    return generateQuestionPermutations(record).map((permutation) => ({
      family,
      title: permutation.title,
      prompt: permutation.prompt,
      type: permutation.type,
      multipleChoiceOptions: JSON.stringify(permutation.multiple_choice),
      answers: JSON.stringify(permutation.answers),
      tags: JSON.stringify(permutation.tags)
    }));
  });
