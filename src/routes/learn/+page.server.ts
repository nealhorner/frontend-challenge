import prisma from '$lib/prisma';
import type { PageServerLoad } from './$types';
import DOMPurify from 'isomorphic-dompurify';

export const load = (async () => {
  try {
    const learning_resources = await prisma.learningResources.findMany();

    // Sanitize the description field
    // TODO move this to cron job
    for (const resource of learning_resources) {
      if (resource.description) {
        resource.description = DOMPurify.sanitize(resource.description);
      }
    }

    return { learning_resources };
  } catch (error) {
    // Handle the error here
    console.error('Error retrieving learning resources:', error);
    throw error; // Rethrow the error to be handled by the caller
  }
}) satisfies PageServerLoad;
