import { api } from '../../../../api/core/api';
import { Group } from '../domain/group';

const GROUP_ENDPOINT = 'grupos';

export const groupRepository = {
    async findAll(): Promise<Group[]> {
        const response = await api.get<Group[]>(GROUP_ENDPOINT);

        return response.data;
    },

    async findById(id: string): Promise<Group> {
        const response = await api.get<Group>(`${GROUP_ENDPOINT}/${id}`);

        return response.data;
    },

    async create(group: Group): Promise<Group> {
        const response = await api.post<Group>(GROUP_ENDPOINT, group);

        return response.data;
    },

    async update(group: Group): Promise<Group> {
        if (!group.id) {
            throw new Error('O ID do grupo é obrigatório para atualização');
        }

        const response = await api.put<Group>(`${GROUP_ENDPOINT}/${group.id}`, group);

        return response.data;
    },

    async remove(id: string): Promise<void> {
        await api.delete(`${GROUP_ENDPOINT}/${id}`);
    }
};
