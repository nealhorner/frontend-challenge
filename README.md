# Frontend Challenge

A simple CRUD application to help users practice their frontend skills.

## Developing

Create a `.env` file based on .env.example

```bash
npm install
npm run dev
```

### Updating the database

Create migration

```bash
npm run db:migrate
```

Seed the database

```bash
npx tsx prisma/seed.ts
```

## Building

```bash
npm run build
```
