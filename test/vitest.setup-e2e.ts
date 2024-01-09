import 'dotenv/config';

import { PrismaClient } from '@prisma/client';
import { afterAll, beforeAll } from 'vitest';
import { randomUUID } from 'crypto';
import { execSync } from 'child_process';

const prisma = new PrismaClient();
const schemaId = randomUUID();

function generateDatabaseUrl(schemaId: string) {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL env is not set.');
  }

  const url = new URL(process.env.DATABASE_URL);
  url.searchParams.set('schema', schemaId);

  return url.toString();
}

beforeAll(async () => {
  const databaseUrl = generateDatabaseUrl(schemaId);
  process.env.DATABASE_URL = databaseUrl;
  console.log(`Using database URL: ${databaseUrl}`);

  execSync('npx prisma migrate deploy');
});

afterAll(async () => {
  await prisma.$executeRawUnsafe(`DROP SCHEMA IF EXISTS "${schemaId}" CASCADE`);
  await prisma.$disconnect();
});
