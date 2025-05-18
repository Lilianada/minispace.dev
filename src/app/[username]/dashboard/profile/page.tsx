import { Suspense } from 'react';
import ProfileClient from './page.client';
import LoadingScreen from '@/components/LoadingScreen';

export default function ProfilePage() {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <ProfileClient />
    </Suspense>
  );
}
