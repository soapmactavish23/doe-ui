import { Profile } from '../domain/profile';
import { ChangePasswordRequest } from '../domain/password';
import { api } from '@/app/api/core/api';
import { User } from '../../users/domain/user';

export const profileRepository = {
    async updateProfile(profile: Profile): Promise<Profile> {
        const response = await api.put<Profile>('usuarios/editar-perfil', profile);

        return response.data;
    },
    async changePassword(request: ChangePasswordRequest): Promise<void> {
        await api.put('usuarios/alterar-senha', request);
    }
};
