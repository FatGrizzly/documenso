import { PrismaClient } from '@prisma/client';

import { getDatabaseUrl } from './helper';

declare global {
  // We need `var` to declare a global variable in TypeScript
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

if (!globalThis.prisma) {
  globalThis.prisma = new PrismaClient();
}

export const prisma =
  globalThis.prisma ||
  new PrismaClient({
    datasources: {
      db: {
        url: getDatabaseUrl(),
      },
    },
  });

export const getPrismaClient = () => prisma;
