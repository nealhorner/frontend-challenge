/**
 * Load the reference data the app needs (quiz questions and learning
 * resources) without touching user data.
 *
 * Runs in the `predeploy` step, after migrations and before the Open Graph
 * population. It is safe to run on every deploy:
 *  - learning resources are matched by `url` (or by `title` when only the url
 *    changed) and only title, url and type are updated, so Open Graph data
 *    already fetched is kept;
 *  - questions are inserted only when the Question table is empty. Existing
 *    questions are never changed, because quizzes reference them. To replace
 *    them, use `npm run db:seed` (destructive, wipes all quizzes).
 *
 * Unlike the Open Graph step this is not best-effort: a failure exits non-zero
 * and stops the deploy.
 */
import fs from 'node:fs';
import prisma from '$lib/prisma';
import { buildQuestionRows, type RawQuestion } from './lib/questions';

interface RawLearningResource {
  title: string;
  type: string;
  url: string;
}

const readRecords = <T>(path: string): T[] => JSON.parse(fs.readFileSync(path, 'utf-8')).records;

const seedQuestionsIfEmpty = async () => {
  const existing = await prisma.question.count();
  if (existing > 0) {
    console.log(`✓ Questions: ${existing} already in the database, leaving them alone`);
    return;
  }
  const rows = buildQuestionRows(readRecords<RawQuestion>('data/questions.json'));
  const { count } = await prisma.question.createMany({ data: rows });
  console.log(`✓ Questions: inserted ${count}`);
};

const upsertLearningResources = async () => {
  const records = readRecords<RawLearningResource>('data/learning_resources.json');
  for (const { title, type, url } of records) {
    // Both url and title are unique. Match by url first; if the url changed
    // but the title didn't, update that row's url rather than failing on a
    // duplicate title (which would block every deploy).
    const byUrl = await prisma.learningResources.findUnique({ where: { url } });
    if (byUrl) {
      await prisma.learningResources.update({ where: { url }, data: { title, type } });
      continue;
    }
    const byTitle = await prisma.learningResources.findUnique({ where: { title } });
    if (byTitle) {
      await prisma.learningResources.update({ where: { title }, data: { url, type } });
      continue;
    }
    await prisma.learningResources.create({ data: { title, type, url } });
  }
  console.log(`✓ Learning resources: ${records.length} synced`);
};

try {
  await seedQuestionsIfEmpty();
  await upsertLearningResources();
} catch (error) {
  console.error('✗ Failed to seed reference data:', error);
  process.exitCode = 1;
} finally {
  await prisma.$disconnect();
}
