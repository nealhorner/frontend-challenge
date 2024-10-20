// import { json } from '@sveltejs/kit';
// import prisma from '$lib/prisma';

// export async function GET() {
//   // TODO implement this endpoint for global use outside of active quizzes

//   const questions = await prisma.question.findMany({
//     take: 10
//     // TODO improve randomization
//   });

//   const randomIndex = Math.floor(Math.random() * questions.length);
//   const question = questions[randomIndex];

//   if (!question) {
//     return json({ error: 'Question not found' }, { status: 404 });
//   }

//   return json(question);
// }

// export async function PUT({ params, request, cookies }) {
//   const { done } = await request.json();

//   // await database.toggleTodo({ userid, id: params.id, done });

//   const quiz_id = params.id;
//   const question_id = params.id;

//   return new Response(null, { status: 204 });
// }
