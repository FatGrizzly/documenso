#!/bin/bash

# Exit on error.
set -e

# Navigate to the root of the project.
cd "$(dirname "$0")/../"

# Function which runs the required build steps.
build() {
  echo "[VercelBuild]: Building $DEPLOYMENT_TARGET website."

  npm run prisma:generate --workspace=@documenso/prisma
  turbo run build
}

# Check if the script is running on Vercel.
if [ -z "$VERCEL" ]; then
  echo "[VercelBuild]: ERROR - This script must be run as part of the Vercel build process."
  exit 1
fi

# Validate DEPLOYMENT_TARGET
if [ "$DEPLOYMENT_TARGET" != "webapp" ] && [ "$DEPLOYMENT_TARGET" != "marketing" ]; then
  echo "[VercelBuild]: ERROR - Missing or invalid DEPLOYMENT_TARGET environment variable."
  echo "[VercelBuild]: ERROR - DEPLOYMENT_TARGET must be either 'webapp' or 'marketing'."
  exit 1
fi

# Production builds do not need remapping.
if [ "$VERCEL_ENV" = "production" ]; then
  build
  exit 0
fi

# Remap the NEXT_PUBLIC_WEBAPP_URL to the Vercel URL.
if [ "$DEPLOYMENT_TARGET" = "webapp" ]; then
  export NEXT_PUBLIC_WEBAPP_URL="https://$VERCEL_URL"
fi

# Remap the NEXT_PUBLIC_MARKETING_URL to the Vercel URL.
if [ "$DEPLOYMENT_TARGET" = "marketing" ]; then
  export NEXT_PUBLIC_MARKETING_URL="https://$VERCEL_URL"
fi

export NEXTAUTH_URL="$NEXT_PUBLIC_WEBAPP_URL"

# Utilise Supabase environment variables if possible.
export NEXT_PRIVATE_DATABASE_URL="${POSTGRES_PRISMA_URL:-$NEXT_PRIVATE_DATABASE_URL}"
export NEXT_PRIVATE_DIRECT_DATABASE_URL="${POSTGRES_URL_NON_POOLING:-$NEXT_PRIVATE_DATABASE_URL}"

build
