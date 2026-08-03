import { User, UserSearchRequest } from '../domain/user';

import { userRepository } from '../infrastructure/user.repository';

export const userService = {
    async search(request: UserSearchRequest) {
        return userRepository.search({
            ...request,
            name: request.name.trim(),
            email: request.email.trim().toLowerCase()
        });
    },

    async findById(id: string): Promise<User> {
        if (!id) {
            throw new Error('O ID do usuário é obrigatório');
        }

        return userRepository.findById(id);
    },

    async create(user: User): Promise<User> {
        const normalizedUser: User = {
            ...user,
            name: user.name.trim(),
            email: user.email.trim().toLowerCase()
        };

        return userRepository.create(normalizedUser);
    },

    async update(user: User): Promise<User> {
        if (!user.id) {
            throw new Error('O ID do usuário é obrigatório para atualização');
        }

        const normalizedUser: User = {
            ...user,
            name: user.name.trim(),
            email: user.email.trim().toLowerCase()
        };

        return userRepository.update(normalizedUser);
    },

    async remove(id: string): Promise<void> {
        if (!id) {
            throw new Error('O ID do usuário é obrigatório para exclusão');
        }

        await userRepository.remove(id);
    },

    async resetPassword(id: string): Promise<void> {
        if (!id) {
            throw new Error('O ID do usuário é obrigatório para redefinir a senha');
        }

        await userRepository.resetPassword(id);
    },

    async changeStatus(id: string): Promise<void> {
        if (!id) {
            throw new Error('O ID do usuário é obrigatório para alterar o status');
        }

        await userRepository.changeStatus(id);
    }
};
