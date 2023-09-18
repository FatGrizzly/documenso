import { PrismaClient } from '@prisma/client';

declare global {
  // We need `var` to declare a global variable in TypeScript
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

if (!globalThis.prisma) {
  globalThis.prisma = new PrismaClient();
}

Object.keys(process.env)
  .filter(
    (key) => key.includes('DATABASE') || key.includes('POSTGRES') || key.includes('NEXT_AUTH'),
  )
  .forEach((key) => console.log({ [key]: process.env[key] }));

export const prisma =
  globalThis.prisma ||
  new PrismaClient({
    datasources: {
      db: {
        url: process.env.NEXT_PRIVATE_DATABASE_URL,
      },
    },
  });

export const getPrismaClient = () => prisma;
