'use client';

import { useCallback, useEffect, useState } from 'react';

import { createEmptyProfile, Profile } from '../domain/profile';

import { profileService } from './profile.service';
import { userContext } from '@/app/context/user_context';

export function useProfile() {
    const [profile, setProfile] = useState<Profile>(createEmptyProfile());

    const [loading, setLoading] = useState(false);

    const [saving, setSaving] = useState(false);

    const loadProfile = useCallback(async () => {
        try {
            setLoading(true);

            const result = await userContext.getUserLogged();

            setProfile({
                id: result.id!,
                name: result.name
            });
        } catch (error) {
            console.error('Erro ao carregar perfil:', error);

            throw error;
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        void loadProfile();
    }, [loadProfile]);

    const saveProfile = async (data: Profile): Promise<Profile> => {
        try {
            setSaving(true);

            const updatedProfile = await profileService.updateProfile(data);

            setProfile(updatedProfile);

            return updatedProfile;
        } catch (error) {
            console.error('Erro ao atualizar perfil:', error);

            throw error;
        } finally {
            setSaving(false);
        }
    };

    return {
        profile,
        loading,
        saving,

        loadProfile,
        saveProfile
    };
}
