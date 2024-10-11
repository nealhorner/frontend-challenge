// src/routes/quiz/+page.server.js
import { error } from '@sveltejs/kit';

const mockQuiz = {
  quizId: 1,
  questions: [
    '3333a5e0-8230-4157-8dbd-f5e10d56fdbd',
    'ec7ce1bf-52b0-4859-8d59-e19b5da83bca',
    'fd3119c0-eb10-40fa-b1fa-6109decd4da4'
  ],
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
