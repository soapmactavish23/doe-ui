'use client';

import React, { useEffect, useMemo } from 'react';
import { usePathname } from 'next/navigation';
import Navbar from '@/app/components/navbar/Navbar';
import Footer from '@/app/components/footer/Footer';
import AppConfig from '../../layout/AppConfig';
import AOS from 'aos';
import 'aos/dist/aos.css';

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
            {!shouldHideLayout && <Navbar />}
            <main className="min-h-[calc(100vh-160px)] flex-1">{children}</main>
            {!shouldHideLayout && <Footer />}
            <AppConfig simple />
        </>
    );
}
