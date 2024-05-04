// Import Prisma client
import { PrismaClient } from '@prisma/client';
import type { Question } from '@prisma/client';

const prisma = new PrismaClient();

// Function to fetch data with type safety
export const fetchQuestions = async (): Promise<Question[]> => {
	try {
		const data = await prisma.question.findMany();
		return data;
	} catch (error) {
		console.error('Error fetching data:', error);
		throw error; // Rethrow or handle as needed
	}
};
