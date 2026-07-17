'use client';

import { Button } from 'primereact/button';
import './styles.scss';
import imgLogo from '../../../assets/logo_not_background.png';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import LoadingContent from '@/layout/LoadingContent';

const menuItems = [
    { label: 'Home', href: '/home' },
    { label: 'Identificação', href: '/identificacao' },
    { label: 'Catálogo', href: '/catalogo' },
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Pesquisa Científica', href: '/pesquisa' },
    { label: 'Quem Somos', href: '/quem-somos' }
];

export default function Navbar() {
    const router = useRouter();
    const pathname = usePathname();
    const toggleRef = useRef<HTMLInputElement | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        let mounted = true;

        (async () => {
            const AOS = (await import('aos')).default;
            if (mounted) AOS.init({ duration: 800 });
        })();

        return () => {
            mounted = false;
        };
    }, []);

    useEffect(() => {
        setLoading(false);
        if (toggleRef.current) toggleRef.current.checked = false;
    }, [pathname]);

    const closeMenu = () => {
        if (toggleRef.current) toggleRef.current.checked = false;
    };

    const goTo = (href: string) => {
        if (href === pathname) {
            closeMenu();
            return;
        }

        closeMenu();
        setLoading(true);
        router.push(href);
    };

    return (
        <>
            {loading && <LoadingContent />}

            <header className="navbar-wrapper" data-aos="fade-down">
                <nav className="navbar">
                    <div className="navbar__inner">
                        <Link
                            href="/home"
                            className="navbar__brand"
                            onClick={(e) => {
                                e.preventDefault();
                                goTo('/home');
                            }}
                        >
                            <img src={imgLogo.src} alt="Radar Peçonhento" />
                            <div className="navbar__brand-text">
                                <strong>Radar Peçonhento</strong>
                                <span>IA</span>
                            </div>
                        </Link>

                        <input ref={toggleRef} id="nav-toggle" type="checkbox" className="navbar__toggle" />

                        <label htmlFor="nav-toggle" className="navbar__burger" aria-label="Abrir menu">
                            <span />
                            <span />
                            <span />
                        </label>

                        <ul className="navbar__menu">
                            {menuItems.map((item) => (
                                <li key={item.href}>
                                    <Link
                                        href={item.href}
                                        className={pathname === item.href ? 'active' : ''}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            goTo(item.href);
                                        }}
                                    >
                                        {item.label}
                                    </Link>
                                </li>
                            ))}

                            <li className="navbar__login">
                                <Button icon="pi pi-sign-in" label="Entrar" rounded className="navbar__button" onClick={() => goTo('/auth/login')} />
                            </li>
                        </ul>
                    </div>
                </nav>
            </header>
        </>
    );
}
