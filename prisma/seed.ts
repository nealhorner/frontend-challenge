import fs from 'fs';
import prisma from '../src/lib/prisma.ts';

// Define the interface for each question
interface RawQuestion {
  title: string;
  prompt: string;
  answers: string[]; // Assuming answers are strings
  false_answers: string[]; // Assuming false_answers are strings
  tags: string[];
}

interface GeneratedQuestion {
  title: string;
  prompt: string;
  type: string;
  multiple_choice: string[];
  answers: string[];
  tags: string[];
}

const shuffle_array = (array: string[]) => {
  const shuffled: string[] = [];
  const array_copy = array.concat();
  while (array_copy.length > 0) {
    const random_index = Math.floor(Math.random() * array_copy.length);
    shuffled.push(array_copy[random_index]);
    array_copy.splice(random_index, 1);
  }
  return shuffled;
};

const generate_question_permutations = (question: RawQuestion) => {
  // Generate all possible permutations of the question

  const permutations: GeneratedQuestion[] = [];

  // True or False

  // Multiple Choice
  if (question.false_answers.length > 0) {
    const shuffled_false_answers = shuffle_array(question.false_answers);
    permutations.push({
      title: question.title,
      prompt: question.prompt,
      type: 'multiple_choice',
      multiple_choice: question.answers.concat(shuffled_false_answers.slice(0, 3)),
      answers: question.answers,
      tags: question.tags
    });
  }
  if (question.false_answers.length > 1) {
    const shuffled_false_answers = shuffle_array(question.false_answers);
    permutations.push({
      title: question.title,
      prompt: question.prompt,
      type: 'multiple_choice',
      multiple_choice: shuffled_false_answers.slice(0, 4),
      answers: [],
      tags: question.tags
    });
  }

  // Blind Answer
  permutations.push({
    title: question.title,
    prompt: question.prompt,
    type: 'blind_answer',
    multiple_choice: [],
    answers: question.answers,
    tags: question.tags
  });

  // Fill in the blank

  return permutations;
};

const get_records_from_json = (json_file_path: string) => {
  const data = JSON.parse(fs.readFileSync(json_file_path, 'utf-8'));
  return data.records;
};

const replace_question_records_from_json = async () => {
  // Remove all existing quiz question data
  await prisma.quizQuestion.deleteMany();

  // Remove all existing quiz data
  await prisma.quiz.deleteMany();

  // Remove all existing question data
  await prisma.question.deleteMany();

  // Load questions data from data/questions.json
  const question_data = JSON.parse(fs.readFileSync('data/questions.json', 'utf-8'));

  // Insert the questions into the database
  for (const raw_question of question_data.records) {
    // Generate a family UUID to link all permutations of the same question
    const family = crypto.randomUUID();

    for (const question_permutation of generate_question_permutations(raw_question)) {
      const prismaQuestionData = {
        title: question_permutation.title,
        family: family,
        prompt: question_permutation.prompt,
        type: question_permutation.type,
        multipleChoiceOptions: JSON.stringify(question_permutation.multiple_choice),
        answers: JSON.stringify(question_permutation.answers),
        tags: JSON.stringify(question_permutation.tags)
      };
      await prisma.question.create({ data: prismaQuestionData });
    }
  }
};

async function main() {
  // Seed the database with some data
  console.log('Seeding the database...');

  console.log('Seeding questions...');
  replace_question_records_from_json();

  // console.log('Seeding users...');
  // await prisma.user.createMany({ data: get_records_from_json('data/users.json') });

  console.log('Seeding learning resources...');
  await prisma.learningResources.deleteMany({});
  await prisma.learningResources.createMany({
    data: get_records_from_json('data/learning_resources.json')
  });
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
