'use client';

import { LayoutProvider } from '../layout/context/layoutcontext';
import { PrimeReactProvider } from 'primereact/api';
import 'primereact/resources/primereact.css';
import 'primeflex/primeflex.css';
import 'primeicons/primeicons.css';
import '../styles/layout/layout.scss';
import '../styles/demo/Demos.scss';
import '../styles/global.scss';
import '../styles/hover.css';
import '../styles/aos.css';

import AuthGuard from './components/AuthGuard';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './lib/react-query';

interface RootLayoutProps {
    children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
    return (
        <html lang="pt" suppressHydrationWarning>
            <head>
                <link id="theme-css" href={`/themes/lara-light-indigo/theme.css`} rel="stylesheet" />
            </head>
            <body>
                <PrimeReactProvider>
                    <QueryClientProvider client={queryClient}>
                        <LayoutProvider>
                            <AuthGuard>{children}</AuthGuard>
                        </LayoutProvider>
                    </QueryClientProvider>
                </PrimeReactProvider>
            </body>
        </html>
    );
}
