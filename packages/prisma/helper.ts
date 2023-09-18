/// <reference types="@documenso/tsconfig/process-env.d.ts" />

export const getDatabaseUrl = () => {
  if (process.env.NEXT_PRIVATE_DATABASE_URL) {
    return process.env.NEXT_PRIVATE_DATABASE_URL;
  }

  if (process.env.POSTGRES_PRISMA_URL) {
    return process.env.POSTGRES_PRISMA_URL;
  }

  if (process.env.POSTGRES_URL) {
    if (
      process.env.POSTGRES_URL_NON_POOLING &&
      process.env.POSTGRES_URL !== process.env.POSTGRES_URL_NON_POOLING
    ) {
      const url = new URL(process.env.POSTGRES_URL);

      url.searchParams.set('pgbouncer', 'true');

      return url.toString();
    }

    return process.env.POSTGRES_URL;
  }

  throw new Error('Missing database URL');
};
