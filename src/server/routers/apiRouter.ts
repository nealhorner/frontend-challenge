import { PrismaClient } from '@prisma/client'
import express from 'express';

const router = express.Router();
const prisma = new PrismaClient();

// Define routes here
router.get('/', (req, res) => {
  res.send('API Home');
});

router.get('/questions', async (req, res) => {
  const questions = await prisma.question.findMany();
  res.json(questions);
});

router.get('/questions/:id', async (req, res) => {
  const question = await prisma.question.findUnique({
    where: {
      id: Number(req.params.id)
    }
  });
  res.json(question);
});

router.get('/quiz', async (req, res) => {
  const questions = await prisma.question.findMany();
  const shuffled_questions = questions.sort(() => Math.random() - 0.5);
  res.json(shuffled_questions.slice(0, 10));
})

router.get('/users', async (req, res) => {
  const users = await prisma.user.findMany();
  res.json(users);
});

router.get('/quiz-result/:id', (req, res) => {
  res.send('quiz result');
})

export const apiRouter = router;
