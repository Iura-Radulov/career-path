import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin Panel — CareerPath',
  robots: 'noindex, nofollow',
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
