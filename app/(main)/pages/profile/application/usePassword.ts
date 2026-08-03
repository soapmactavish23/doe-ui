'use client';

import { useState } from 'react';

import { ChangePasswordRequest } from '../domain/password';
import { profileService } from './profile.service';

export function usePassword() {
    const [saving, setSaving] = useState(false);

    const changePassword = async (request: ChangePasswordRequest): Promise<void> => {
        try {
            setSaving(true);

            await profileService.changePassword(request);
        } catch (error) {
            console.error('Erro ao alterar senha:', error);

            throw error;
        } finally {
            setSaving(false);
        }
    };

    return {
        saving,
        changePassword
    };
}
