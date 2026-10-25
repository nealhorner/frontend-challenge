import fs from 'fs';
import prisma from '../src/lib/prisma.ts';
import { buildQuestionRows, type RawQuestion } from '../scripts/lib/questions.ts';

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

  // Load questions data from data/questions.json and insert every variant
  const question_data = JSON.parse(fs.readFileSync('data/questions.json', 'utf-8'));
  await prisma.question.createMany({
    data: buildQuestionRows(question_data.records as RawQuestion[])
  });
};

async function main() {
  // Seed the database with some data
  console.log('Seeding the database...');

  console.log('Seeding questions...');
  await replace_question_records_from_json();

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
