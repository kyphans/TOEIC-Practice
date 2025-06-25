import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation';

export default async function OnboardingLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const user = await currentUser()
  console.log('metadata', user?.publicMetadata.onboardingComplete);
  if (user?.publicMetadata.onboardingComplete === true) {
    redirect('/dashboard');
  }

  return <>{children}</>;
}
