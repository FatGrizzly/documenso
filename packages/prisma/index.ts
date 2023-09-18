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
  .filter((key) => key.startsWith('NEXT_'))
  .forEach((key) => console.log({ [key]: process.env[key] }));

export const prisma = globalThis.prisma || new PrismaClient();

export const getPrismaClient = () => prisma;
