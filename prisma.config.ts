import path from 'node:path';
import { defineConfig } from 'prisma/config';

export default defineConfig({
  schema: path.join(import.meta.dirname, 'prisma/schema.prisma'),
  // Migrate commands (`migrate deploy` in the Railway pre-deploy step,
  // `migrate dev` locally) connect through this URL; Prisma errors if it's
  // missing. Read from process.env rather than prisma/config's env(), which
  // throws when unset and would break `prisma generate` in CI, where there's
  // no database. The CLI doesn't load .env, so export it locally first.
  datasource: {
    url: process.env.DATABASE_URL
  }
});
