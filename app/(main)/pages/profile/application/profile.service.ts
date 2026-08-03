import { User } from '../../users/domain/user';
import { ChangePasswordRequest } from '../domain/password';
import { Profile } from '../domain/profile';
import { profileRepository } from '../infrastructure/profile.repository';

export const profileService = {
    async updateProfile(profile: Profile): Promise<Profile> {
        if (!profile.id) {
            throw new Error('O ID do usuário é obrigatório');
        }

        const normalizedProfile: Profile = {
            ...profile,
            name: profile.name.trim()
        };

        return profileRepository.updateProfile(normalizedProfile);
    },

    async changePassword(request: ChangePasswordRequest): Promise<void> {
        if (!request.code) {
            throw new Error('O código do usuário é obrigatório');
        }

        if (request.newPassword !== request.confirmPassword) {
            throw new Error('A confirmação da senha não corresponde à nova senha');
        }

        if (request.password === request.newPassword) {
            throw new Error('A nova senha deve ser diferente da senha atual');
        }

        await profileRepository.changePassword(request);
    }
};
