'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { RecoveryPasswordRequest } from '../domain/recovery-password';
import { recoveryPasswordService } from './recovery-password.service';

export function useRecoveryPassword() {
    const router = useRouter();

    const [isNavigating, setIsNavigating] = useState(false);

    const recoverPassword = async (request: RecoveryPasswordRequest): Promise<void> => {
        await recoveryPasswordService.recover(request);
    };

    const goToLogin = () => {
        if (isNavigating) {
            return;
        }

        setIsNavigating(true);
        router.push('/auth/login');
    };

    return {
        isNavigating,
        recoverPassword,
        goToLogin
    };
}
