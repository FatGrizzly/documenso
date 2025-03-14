import { getRequiredServerComponentSession } from '@documenso/lib/next-auth/get-server-session';

import { PasswordForm } from '~/components/forms/password';

export default async function PasswordSettingsPage() {
  const user = await getRequiredServerComponentSession();

  return (
    <div>
      <h3 className="text-lg font-medium">Password</h3>

      <p className="mt-2 text-sm text-slate-500">Here you can update your password.</p>

      <hr className="my-4" />

      <PasswordForm user={user} className="max-w-xl" />
    </div>
  );
}
