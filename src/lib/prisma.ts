import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { env } from '$env/dynamic/private';
import { building } from '$app/environment';

// Read at runtime (not inlined at build) so the connection string stays out of
// the build output and Railway can inject or rotate it without a rebuild.
// Fail at startup rather than on the first query. Skipped during `vite build`,
// where SvelteKit imports server modules without the runtime env.
if (!building && !env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not set');
}
const adapter = new PrismaPg({ connectionString: env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

export default prisma;
