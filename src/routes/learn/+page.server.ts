import prisma from '$lib/prisma';
import type { PageServerLoad } from './$types';
import { decodeHTML } from '$lib/utilities/decodeHTML';
import { cleanUnsafeHTML } from '$lib/utilities/cleanUnsafeHTML';

export const load = (async () => {
  try {
    const learning_resources = await prisma.learningResources.findMany();

    // Sanitize the description
    learning_resources.forEach((learning_resource) => {
      if (learning_resource.description) {
        let decodedHTML = decodeHTML(learning_resource.description);
        learning_resource.description = cleanUnsafeHTML(decodedHTML);
      }
    });

    return { learning_resources };
  } catch (error) {
    // Handle the error here
    console.error('Error retrieving learning resources:', error);
    throw error; // Rethrow the error to be handled by the caller
  }
}) satisfies PageServerLoad;
