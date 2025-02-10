import prisma from '$lib/prisma';
import type { PageServerLoad } from './$types';

export const load = (async () => {
  try {
    const learning_resources = await prisma.learningResources.findMany();
    return learning_resources;
  } catch (error) {
    // Handle the error here
    console.error('Error retrieving learning resources:', error);
    throw error; // Rethrow the error to be handled by the caller
  }
}) satisfies PageServerLoad;
