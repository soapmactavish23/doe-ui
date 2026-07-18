'use client';

import React, { useEffect, useMemo } from 'react';
import { usePathname } from 'next/navigation';
import AppConfig from '../../layout/AppConfig';
import AOS from 'aos';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    // rotas que NÃO devem exibir Navbar/Footer
    const hideLayoutFor = useMemo(() => ['/auth/login', '/auth/recovery-password'], []);
    const shouldHideLayout = hideLayoutFor.includes(pathname);

    useEffect(() => {
        AOS.init({ duration: 1000 });
    }, []);

    return (
        <>
            <main className="min-h-[calc(100vh-160px)] flex-1">{children}</main>

            <AppConfig simple />
        </>
    );
}
