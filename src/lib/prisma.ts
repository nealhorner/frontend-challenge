import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { ENV } from 'varlock/env';

// Read at runtime (not inlined at build) so the connection string stays out of
// the build output and Railway can inject or rotate it without a rebuild.
// Varlock fails startup if DATABASE_URL is missing (see .env.schema).
const adapter = new PrismaPg({ connectionString: ENV.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

export default prisma;
