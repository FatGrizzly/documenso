/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');
const { withContentlayer } = require('next-contentlayer');

const { parsed: env } = require('dotenv').config({
  path: path.join(__dirname, '../../.env.local'),
});

/** @type {import('next').NextConfig} */
const config = {
  experimental: {
    serverActions: true,
    serverActionsBodySizeLimit: '10mb',
  },
  reactStrictMode: true,
  transpilePackages: ['@documenso/lib', '@documenso/prisma', '@documenso/trpc', '@documenso/ui'],
  env: {
    ...env,
    NEXT_PUBLIC_APP: 'marketing',
  },
};

module.exports = withContentlayer(config);
