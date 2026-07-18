import { api } from '../../../../api/core/api';
import { Group } from '../types/group';
import { GroupRepository } from './group_repository';

export class GroupRepositoryImpl implements GroupRepository {
    async findAll(): Promise<Group[]> {
        const response = await api.get('grupos');
        return response.data;
    }
    async create(group: Group): Promise<Group> {
        const response = await api.post('grupos', group);
        return response.data;
    }
    async update(group: Group): Promise<Group> {
        const response = await api.put('grupos', group);
        return response.data;
    }
    async remove(id: number) {
        await api.delete(`grupos/${id}`);
    }
}
