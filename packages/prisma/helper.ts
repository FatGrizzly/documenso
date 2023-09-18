/// <reference types="@documenso/tsconfig/process-env.d.ts" />

export const getDatabaseUrl = () => {
  if (process.env.POSTGRES_PRISMA_URL) {
    return process.env.POSTGRES_PRISMA_URL;
  }

  if (process.env.POSTGRES_URL) {
    // If we're using a connection pool, we need to let Prisma know that
    // we're using PgBouncer.
    if (process.env.POSTGRES_URL !== process.env.POSTGRES_URL_NON_POOLING) {
      const url = new URL(process.env.POSTGRES_URL);

      url.searchParams.set('pgbouncer', 'true');

      return url.toString();
    }
  }

  return process.env.POSTGRES_URL;
};
