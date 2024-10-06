// src/routes/quiz/+page.server.js
import { error } from '@sveltejs/kit';

const mockQuiz = {
  quizId: 1,
  questions: [1, 2, 3, 4, 5, 6],
  completedQuestions: []
};

/** @type {import('./$types').PageServerLoad} */
export async function load() {
  try {
    // TODO Check if the user already has an active quiz and return if so

    // TODO If not, fetch create a new quiz ID and store in the database

    // Return the quiz ID to the client
    return mockQuiz;
  } catch (err) {
    throw error(500, 'Failed to fetch quiz ID');
  }
}
