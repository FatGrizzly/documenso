import { NextRequest, NextResponse } from 'next/server';

import { JWT, getToken } from 'next-auth/jwt';

import { LOCAL_FEATURE_FLAGS, extractPostHogConfig } from '@documenso/lib/constants/feature-flags';
import { nanoid } from '@documenso/lib/universal/id';

import PostHogServerClient from '~/helpers/get-post-hog-server-client';

export const config = {
  runtime: 'edge',
};

/**
 * Evaluate a single feature flag based on the current user if possible.
 *
 * @param req The request with a query parameter `flag`. Example request URL: /api/feature-flag/get?flag=flag-name
 * @returns A Response with the feature flag value.
 */
export default async function handler(req: Request) {
  const { searchParams } = new URL(req.url ?? '');
  const flag = searchParams.get('flag');

  const requestHeaders = Object.fromEntries(req.headers.entries());

  const nextReq = new NextRequest(req, {
    headers: requestHeaders,
  });

  const token = await getToken({ req: nextReq });

  if (!flag) {
    return NextResponse.json(
      {
        error: 'Missing flag query parameter.',
      },
      {
        status: 400,
        headers: {
          'content-type': 'application/json',
        },
      },
    );
  }

  const postHog = PostHogServerClient();

  // Return the local feature flags if PostHog is not enabled, true by default.
  // The front end should not call this API if PostHog is disabled to reduce network requests.
  if (!postHog) {
    return NextResponse.json(LOCAL_FEATURE_FLAGS[flag] ?? true);
  }

  const distinctId = extractDistinctUserId(token, nextReq);

  const featureFlag = await postHog.getFeatureFlag(flag, distinctId, mapJwtToFlagProperties(token));

  const res = NextResponse.json(featureFlag);

  res.headers.set('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=300');

  return res;
}

/**
 * Map a JWT to properties which are consumed by PostHog to evaluate feature flags.
 *
 * @param jwt The JWT of the current user.
 * @returns A map of properties which are consumed by PostHog.
 */
export const mapJwtToFlagProperties = (
  jwt?: JWT | null,
): {
  groups?: Record<string, string>;
  personProperties?: Record<string, string>;
  groupProperties?: Record<string, Record<string, string>>;
} => {
  return {
    personProperties: {
      email: jwt?.email ?? '',
    },
    groupProperties: {
      // Add properties to group users into different groups, such as billing plan.
    },
  };
};

/**
 * Extract a distinct ID from a JWT and request.
 *
 * Will fallback to a random ID if no ID could be extracted from either the JWT or request.
 *
 * @param jwt The JWT of the current user.
 * @param request Request potentially containing a PostHog `distinct_id` cookie.
 * @returns A distinct user ID.
 */
export const extractDistinctUserId = (jwt: JWT | null, request: NextRequest): string => {
  const config = extractPostHogConfig();

  const email = jwt?.email;
  const userId = jwt?.id.toString();

  let fallbackDistinctId = nanoid();

  if (config) {
    try {
      const postHogCookie = JSON.parse(
        request.cookies.get(`ph_${config.key}_posthog`)?.value ?? '',
      );

      const postHogDistinctId = postHogCookie['distinct_id'];

      if (typeof postHogDistinctId === 'string') {
        fallbackDistinctId = postHogDistinctId;
      }
    } catch {
      // Do nothing.
    }
  }

  return email ?? userId ?? fallbackDistinctId;
};
