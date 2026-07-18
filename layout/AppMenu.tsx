/* eslint-disable @next/next/no-img-element */
import React, { useCallback, useEffect, useRef, useState } from 'react';
import AppMenuitem from './AppMenuitem';
import { MenuProvider } from './context/menucontext';
import { AppMenuItem } from '@/types';
import { usePathname } from 'next/navigation';
import LoadingContent from './LoadingContent';

const AppMenu = () => {
    const pathname = usePathname();
    const prevPathRef = useRef<string>(pathname);
    const navStartRef = useRef<number | null>(null);
    const [loading, setLoading] = useState(false);
    const timeoutRef = useRef<number | null>(null);

    // Inicia a cronometragem e mostra overlay
    const beginMeasure = useCallback(() => {
        if (navStartRef.current !== null) return; // já medindo
        navStartRef.current = performance.now();
        setLoading(true);

        // Failsafe: se a rota não mudar por algum motivo, some depois de 8s
        if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
        timeoutRef.current = window.setTimeout(() => {
            navStartRef.current = null;
            setLoading(false);
        }, 8000);
    }, []);

    // Encerra medição quando o pathname muda
    useEffect(() => {
        if (navStartRef.current !== null && pathname !== prevPathRef.current) {
            const elapsed = performance.now() - navStartRef.current;
            console.log(`[NAV] ${prevPathRef.current} -> ${pathname} | ${Math.round(elapsed)} ms`);
            navStartRef.current = null;
            setLoading(false);
            if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
            prevPathRef.current = pathname;
        }
    }, [pathname]);

    // Captura cliques no menu (delegação) para iniciar o loading/cronômetro
    const onMenuClickCapture: React.MouseEventHandler<HTMLUListElement> = (e) => {
        const target = e.target as HTMLElement | null;
        const anchor = target?.closest?.('a[href]') as HTMLAnchorElement | null;
        if (!anchor) return;

        // Apenas links internos (mesmo host) e não âncoras/telefones/mailto
        const href = anchor.getAttribute('href') || '';
        if (href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) {
            return;
        }

        // Considera navegação interna do Next (rota diferente)
        try {
            const url = new URL(href, window.location.origin);
            const isSameOrigin = url.origin === window.location.origin;
            if (isSameOrigin && url.pathname !== pathname) {
                beginMeasure();
            }
        } catch {
            // href relativo simples (ex.: "/pages/animal")
            if (href !== pathname) beginMeasure();
        }
    };

    const model: AppMenuItem[] = [
        {
            label: 'Home',
            items: [{ label: 'Dashboard', icon: 'pi pi-fw pi-home', to: '/' }]
        },
        {
            label: 'Administração de pacientes',
            items: [{ label: 'Pacientes', icon: 'pi pi-fw pi-sitemap', to: '/pages/patients' }]
        },
        {
            label: 'Administração de Usuários',
            items: [
                { label: 'Gerenciamentos de Usuários', icon: 'pi pi-fw pi-users', to: '/pages/users' },
                { label: 'Gerenciamentos de Grupos', icon: 'pi pi-fw pi-clone', to: '/pages/groups' },
                { label: 'Consulta de Logs', icon: 'pi pi-fw pi-search', to: '/pages/logs' }
            ]
        }
    ];

    return (
        <MenuProvider>
            {loading && <LoadingContent />}

            <ul className="layout-menu" onClickCapture={onMenuClickCapture}>
                {model.map((item, i) => (!item?.seperator ? <AppMenuitem item={item} root={true} index={i} key={item.label} /> : <li className="menu-separator" key={`sep-${i}`}></li>))}
            </ul>
        </MenuProvider>
    );
};

export default AppMenu;
