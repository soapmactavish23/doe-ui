'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { LoginRequest } from '../domain/authentication';
import { authenticationService } from './authentication.service';

export function useLogin() {
    const router = useRouter();

    const [isNavigating, setIsNavigating] = useState(false);

    const [authenticationError, setAuthenticationError] = useState<Error | null>(null);

    const login = async (request: LoginRequest): Promise<void> => {
        try {
            setAuthenticationError(null);
            setIsNavigating(true);

            await authenticationService.login(request);

            router.replace('/');
        } catch (error) {
            setIsNavigating(false);

            const normalizedError = error instanceof Error ? error : new Error('Não foi possível realizar o login');

            setAuthenticationError(normalizedError);

            throw normalizedError;
        }
    };

    const goToRecoveryPassword = () => {
        if (isNavigating) {
            return;
        }

        setIsNavigating(true);

        router.push('/auth/recovery-password');
    };

    return {
        isNavigating,
        authenticationError,
        login,
        goToRecoveryPassword
    };
}
