import { Metadata } from 'next';
import SettingsPage from './page.client';

export const metadata: Metadata = {
  title: 'Settings | Minispace',
  description: 'Manage your account settings and preferences',
};

export default function SettingsPageWrapper() {
  return <SettingsPage />;
}
