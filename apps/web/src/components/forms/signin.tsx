'use client';

import { useEffect } from 'react';

import { useSearchParams } from 'next/navigation';

import { zodResolver } from '@hookform/resolvers/zod';
import { Loader } from 'lucide-react';
import { signIn } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import { FcGoogle } from 'react-icons/fc';
import { z } from 'zod';

import { ErrorCode, isErrorCode } from '@documenso/lib/next-auth/error-codes';
import { cn } from '@documenso/ui/lib/utils';
import { Button } from '@documenso/ui/primitives/button';
import { Input } from '@documenso/ui/primitives/input';
import { Label } from '@documenso/ui/primitives/label';
import { useToast } from '@documenso/ui/primitives/use-toast';

const ERROR_MESSAGES = {
  [ErrorCode.CREDENTIALS_NOT_FOUND]: 'The email or password provided is incorrect',
  [ErrorCode.INCORRECT_EMAIL_PASSWORD]: 'The email or password provided is incorrect',
  [ErrorCode.USER_MISSING_PASSWORD]:
    'This account appears to be using a social login method, please sign in using that method',
};

const LOGIN_REDIRECT_PATH = '/documents';

export const ZSignInFormSchema = z.object({
  email: z.string().email().min(1),
  password: z.string().min(6).max(72),
});

export type TSignInFormSchema = z.infer<typeof ZSignInFormSchema>;

export type SignInFormProps = {
  className?: string;
};

export const SignInForm = ({ className }: SignInFormProps) => {
  const searchParams = useSearchParams();

  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<TSignInFormSchema>({
    values: {
      email: '',
      password: '',
    },
    resolver: zodResolver(ZSignInFormSchema),
  });

  const errorCode = searchParams?.get('error');

  useEffect(() => {
    let timeout: NodeJS.Timeout | null = null;

    if (isErrorCode(errorCode)) {
      timeout = setTimeout(() => {
        toast({
          variant: 'destructive',
          description: ERROR_MESSAGES[errorCode] ?? 'An unknown error occurred',
        });
      }, 0);
    }

    return () => {
      if (timeout) {
        clearTimeout(timeout);
      }
    };
  }, [errorCode, toast]);

  const onFormSubmit = async ({ email, password }: TSignInFormSchema) => {
    try {
      await signIn('credentials', {
        email,
        password,
        callbackUrl: LOGIN_REDIRECT_PATH,
      }).catch((err) => {
        console.error(err);
      });
    } catch (err) {
      toast({
        title: 'An unknown error occurred',
        description:
          'We encountered an unknown error while attempting to sign you In. Please try again later.',
      });
    }
  };

  const onSignInWithGoogleClick = async () => {
    try {
      await signIn('google', { callbackUrl: LOGIN_REDIRECT_PATH });
    } catch (err) {
      toast({
        title: 'An unknown error occurred',
        description:
          'We encountered an unknown error while attempting to sign you In. Please try again later.',
        variant: 'destructive',
      });
    }
  };

  return (
    <form
      className={cn('flex w-full flex-col gap-y-4', className)}
      onSubmit={handleSubmit(onFormSubmit)}
    >
      <div>
        <Label htmlFor="email" className="text-slate-500">
          Email
        </Label>

        <Input id="email" type="email" className="bg-background mt-2" {...register('email')} />

        {errors.email && <span className="mt-1 text-xs text-red-500">{errors.email.message}</span>}
      </div>

      <div>
        <Label htmlFor="password" className="text-slate-500">
          Password
        </Label>

        <Input
          id="password"
          type="password"
          minLength={6}
          maxLength={72}
          autoComplete="current-password"
          className="bg-background mt-2"
          {...register('password')}
        />

        {errors.password && (
          <span className="mt-1 text-xs text-red-500">{errors.password.message}</span>
        )}
      </div>

      <Button size="lg" disabled={isSubmitting} className="dark:bg-documenso dark:hover:opacity-90">
        {isSubmitting && <Loader className="mr-2 h-5 w-5 animate-spin" />}
        Sign In
      </Button>

      <div className="relative flex items-center justify-center gap-x-4 py-2 text-xs uppercase">
        <div className="bg-border h-px flex-1" />
        <span className="text-muted-foreground bg-transparent">Or continue with</span>
        <div className="bg-border h-px flex-1" />
      </div>

      <Button
        type="button"
        size="lg"
        variant={'outline'}
        className="bg-background text-muted-foreground border"
        disabled={isSubmitting}
        onClick={onSignInWithGoogleClick}
      >
        <FcGoogle className="mr-2 h-5 w-5" />
        Google
      </Button>
    </form>
  );
};
