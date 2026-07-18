'use client';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { userService } from '@/app/(main)/pages/users/services/user_service_impl';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const [loading, setLoading] = useState(true);
    const runningRef = useRef(false);

    const pathGranted: string[] = ['/auth/login', '/auth/recovery-password'];

    const base64UrlToBase64 = (input: string) => {
        let str = input.replace(/-/g, '+').replace(/_/g, '/');
        const pad = str.length % 4;
        if (pad) str += '='.repeat(4 - pad);
        return str;
    };

    const decodeJwtPayload = (jwt: string): any | null => {
        try {
            const part = jwt.split('.')[1];
            if (!part) return null;
            const json = atob(base64UrlToBase64(part));
            return JSON.parse(json);
        } catch (e) {
            return null;
        }
    };

    const getExp = (jwt: string): number | null => {
        const payload = decodeJwtPayload(jwt);
        const exp = Number(payload?.exp);
        return Number.isFinite(exp) ? exp : null;
    };

    const isExpired = (exp: number | null) => {
        const now = Math.floor(Date.now() / 1000);
        const expired = !exp || now >= exp;
        return expired;
    };

    useEffect(() => {
        if (runningRef.current) {
            return;
        }
        runningRef.current = true;

        (async () => {
            const access = localStorage.getItem('access_token');
            const refresh = localStorage.getItem('refresh_token');

            if (!access) {
                if (!pathGranted.includes(pathname)) {
                    router.replace(pathGranted[0]);
                } else {
                    setLoading(false);
                }
                return;
            }

            const accessExp = getExp(access);
            if (!isExpired(accessExp)) {
                setLoading(false);
                return;
            }

            if (!refresh) {
                localStorage.removeItem('access_token');
                localStorage.removeItem('refresh_token');
                router.replace(pathGranted[0]);
                return;
            }

            const refreshExp = getExp(refresh);
            if (isExpired(refreshExp)) {
                localStorage.removeItem('access_token');
                localStorage.removeItem('refresh_token');
                router.replace(pathGranted[0]);
                return;
            }

            try {
                const data = await userService.refreshToken(refresh);

                localStorage.setItem('access_token', data.access_token);
                localStorage.setItem('refresh_token', data.refresh_token);

                setLoading(false);
            } catch (e) {
                localStorage.removeItem('access_token');
                localStorage.removeItem('refresh_token');
                router.replace(pathGranted[0]);
            }
        })().finally(() => {
            runningRef.current = false;
        });
    }, [pathname, router]);

    if (loading) {
        return null;
    }

    return <>{children}</>;
}
