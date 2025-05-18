import { Suspense } from 'react';
import ProfileClient from './page.client';
import LoadingDots from '@/components/LoadingDots';

export default function ProfilePage() {
  return (
    <Suspense fallback={<LoadingDots />}>
      <ProfileClient />
    </Suspense>
  );
}
