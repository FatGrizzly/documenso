import { PrismaClient } from '@prisma/client';

declare global {
  // We need `var` to declare a global variable in TypeScript
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

if (!globalThis.prisma) {
  globalThis.prisma = new PrismaClient();
}

console.log({
  ['process.env']: process.env,
});

export const prisma = globalThis.prisma || new PrismaClient();

export const getPrismaClient = () => prisma;
