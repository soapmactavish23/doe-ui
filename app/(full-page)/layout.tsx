// app/(full-page)/layout.tsx
import type { Metadata } from 'next';
import ClientLayout from './ClientLayout';

export const metadata: Metadata = {
  title: 'Radar Peçonhento',
  description:
    'The ultimate collection of design-agnostic, flexible and accessible React UI Components.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <ClientLayout>{children}</ClientLayout>;
}
