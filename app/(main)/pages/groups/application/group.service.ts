import { Group } from '../domain/group';
import { groupRepository } from '../infrastructure/group.repository';

export const groupService = {
    async findAll(): Promise<Group[]> {
        return groupRepository.findAll();
    },

    async create(group: Group): Promise<Group> {
        const normalizedGroup: Group = {
            ...group,
            name: group.name.trim()
        };

        return groupRepository.create(normalizedGroup);
    },

    async update(group: Group): Promise<Group> {
        if (!group.id) {
            throw new Error('O ID do grupo é obrigatório para atualização');
        }

        const normalizedGroup: Group = {
            ...group,
            name: group.name.trim()
        };

        return groupRepository.update(normalizedGroup);
    },

    async remove(id: string): Promise<void> {
        if (!id) {
            throw new Error('O ID do grupo é obrigatório para exclusão');
        }

        await groupRepository.remove(id);
    }
};
