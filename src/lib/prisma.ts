import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { DATABASE_URL } from '$env/static/private';

const adapter = new PrismaPg(DATABASE_URL);
const prisma = new PrismaClient({ adapter });

export default prisma;
