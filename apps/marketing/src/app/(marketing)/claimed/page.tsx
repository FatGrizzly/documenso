import { Caveat } from 'next/font/google';
import Link from 'next/link';
import { redirect } from 'next/navigation';

import { ArrowRight } from 'lucide-react';

import { redis } from '@documenso/lib/server-only/redis';
import { stripe } from '@documenso/lib/server-only/stripe';
import { prisma } from '@documenso/prisma';
import { cn } from '@documenso/ui/lib/utils';
import { Button } from '@documenso/ui/primitives/button';

import { PasswordReveal } from '~/components/(marketing)/password-reveal';

const fontCaveat = Caveat({
  weight: ['500'],
  subsets: ['latin'],
  display: 'swap',
});

export type ClaimedPlanPageProps = {
  searchParams?: {
    sessionId?: string;
  };
};

export default async function ClaimedPlanPage({ searchParams = {} }: ClaimedPlanPageProps) {
  const { sessionId } = searchParams;

  if (typeof sessionId !== 'string') {
    redirect('/');
  }

  const session = await stripe.checkout.sessions.retrieve(sessionId);

  const user = await prisma.user.findFirst({
    where: {
      id: Number(session.client_reference_id),
    },
  });

  if (!user) {
    redirect('/');
  }

  const signatureText = session.metadata?.signatureText || user.name;
  let signatureDataUrl = '';

  if (session.metadata?.signatureDataUrl) {
    const result = await redis.get<string>(`signature:${session.metadata.signatureDataUrl}`);

    if (result) {
      signatureDataUrl = result;
    }
  }

  const password = await redis.get<string>(`user:${user.id}:temp-password`);

  return (
    <div className="mt-12">
      <h1 className="text-3xl font-bold text-slate-900 md:text-4xl">
        Welcome to the <span className="text-primary">open signing</span> revolution{' '}
        <u>{user.name}</u>
      </h1>

      <p className="mt-4 max-w-prose text-base text-slate-500 md:text-lg">
        It's not every day you get to be part of a revolution.
      </p>

      <p className="mt-4 max-w-prose text-base text-slate-500 md:text-lg">
        But today is that day, by signing up to Documenso, you're joining a movement of people who
        want to make the world a better place.
      </p>

      <p className="mt-4 max-w-prose text-base text-slate-500 md:text-lg">
        We're going to change the way people sign documents. We're going to make it easier, faster,
        and more secure. And we're going to do it together.
      </p>

      <div className="mt-12">
        <h2 className="text-2xl font-bold text-slate-900">Let's do it together</h2>

        <div className="-mx-4 mt-8 flex md:-mx-8">
          <div className="flex flex-1 flex-col justify-end gap-y-4 border-r px-4 last:border-r-0 md:px-8 lg:flex-none">
            <p
              className={cn(
                'text-4xl font-semibold text-slate-900 md:text-5xl',
                fontCaveat.className,
              )}
            >
              Timur
            </p>

            <p className="text-sm text-slate-500 md:text-lg">
              Timur Ercan
              <span className="block lg:hidden" />
              <span className="hidden lg:inline"> - </span>
              Co Founder
            </p>
          </div>

          <div className="flex flex-1 flex-col justify-end gap-y-4 border-r px-4 last:border-r-0 md:px-8 lg:flex-none">
            <p
              className={cn(
                'text-4xl font-semibold text-slate-900 md:text-5xl',
                fontCaveat.className,
              )}
            >
              Lucas
            </p>

            <p className="text-sm text-slate-500 md:text-lg">
              Lucas Smith
              <span className="block lg:hidden" />
              <span className="hidden lg:inline"> - </span>
              Co Founder
            </p>
          </div>

          <div className="flex flex-1 flex-col justify-end gap-y-4 border-r px-4 last:border-r-0 md:px-8 lg:flex-none">
            {signatureDataUrl && (
              <img src={signatureDataUrl} alt="your-signature" className="max-w-[172px]" />
            )}
            {!signatureDataUrl && (
              <p
                className={cn(
                  'text-4xl font-semibold text-slate-900 md:text-5xl',
                  fontCaveat.className,
                )}
              >
                {signatureText}
              </p>
            )}

            <p className="text-sm text-slate-500 md:text-lg">
              {user.name}
              <span className="block lg:hidden" />
              <span className="hidden lg:inline"> - </span>
              Our new favourite customer
            </p>
          </div>
        </div>
      </div>

      <div className="mt-12">
        <h2 className="text-2xl font-bold text-slate-900">Your sign in details</h2>

        <div className="mt-4">
          <p className="text-lg text-slate-500">
            <span className="font-bold">Email:</span> {user.email}
          </p>

          <p className="mt-2 text-lg text-slate-500">
            <span className="font-bold">Password:</span>{' '}
            <PasswordReveal password={password ?? 'password'} />
          </p>
        </div>

        <p className="mt-4 text-sm italic text-slate-500">
          This is a temporary password. Please change it as soon as possible.
        </p>

        <Link
          href={`${process.env.NEXT_PUBLIC_APP_URL}/login`}
          target="_blank"
          className="mt-4 block"
        >
          <Button size="lg" className="text-base">
            Let's get started!
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
