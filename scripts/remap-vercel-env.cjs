/** @typedef {import('@documenso/tsconfig/process-env')} */

/**
 * Remap Vercel environment variables to our defined Next.js environment variables.
 *
 * @returns {void}
 */
const remapVercelEnv = () => {
  if (!process.env.VERCEL || !process.env.DEPLOYMENT_TARGET) {
    return;
  }

  if (process.env.POSTGRES_URL) {
    process.env.NEXT_PRIVATE_DATABASE_URL = POSTGRES_URL;
  }

  if (process.env.POSTGRES_URL_NON_POOLING) {
    process.env.NEXT_PRIVATE_DIRECT_DATABASE_URL = POSTGRES_URL_NON_POOLING;
  }

  if (process.env.VERCEL_ENV !== 'production' && process.env.DEPLOYMENT_TARGET === 'webapp') {
    process.env.NEXTAUTH_URL = `https://${process.env.VERCEL_URL}`;
    process.env.NEXT_PUBLIC_WEBAPP_URL = `https://${process.env.VERCEL_URL}`;
  }

  if (process.env.VERCEL_ENV !== 'production' && process.env.DEPLOYMENT_TARGET === 'marketing') {
    process.env.NEXT_PUBLIC_MARKETING_URL = `https://${process.env.VERCEL_URL}`;
  }
};

module.exports = {
  remapVercelEnv,
};
