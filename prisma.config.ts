import path from 'node:path';
import { defineConfig } from 'prisma/config';
import { PrismaPg } from '@prisma/adapter-pg';

export default defineConfig({
  schema: path.join(import.meta.dirname, 'prisma/schema.prisma'),
  migrate: {
    adapter(env) {
      if (!env.DATABASE_URL) {
        throw new Error('DATABASE_URL is required');
      }
      return new PrismaPg({ connectionString: env.DATABASE_URL });
    }
  }
});
