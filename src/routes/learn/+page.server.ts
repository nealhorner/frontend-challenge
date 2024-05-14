import prisma from '$lib/prisma';
import type { PageServerLoad } from './$types';

export const load = (async () => {
  const learning_resources = await prisma.learningResources.findMany();
  return { learning_resources };
}) satisfies PageServerLoad;
