import { api } from '@/app/api/core/api';
import { Page } from '@/app/api/core/pageable';

import { User, UserSearchRequest } from '../domain/user';

const USER_ENDPOINT = 'usuarios';

export const userRepository = {
    async search(request: UserSearchRequest): Promise<Page<User>> {
        const response = await api.get<Page<User>>(USER_ENDPOINT, {
            params: {
                name: request.name,
                email: request.email,
                page: request.pageable.page,
                size: request.pageable.size
            }
        });

        return response.data;
    },

    async findById(id: string): Promise<User> {
        const response = await api.get<User>(`${USER_ENDPOINT}/${id}`);

        return response.data;
    },

    async create(user: User): Promise<User> {
        const response = await api.post<User>(USER_ENDPOINT, user);

        return response.data;
    },

    async update(user: User): Promise<User> {
        const response = await api.put<User>(USER_ENDPOINT, user);

        return response.data;
    },

    async remove(id: string): Promise<void> {
        await api.delete(`${USER_ENDPOINT}/${id}`);
    },

    async resetPassword(id: string): Promise<void> {
        await api.put(`${USER_ENDPOINT}/resetar-senha/${id}`);
    },

    async changeStatus(id: string): Promise<void> {
        await api.put(`${USER_ENDPOINT}/status/${id}`);
    }
};
