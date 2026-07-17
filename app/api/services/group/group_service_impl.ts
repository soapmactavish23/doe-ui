import { Group } from '../../models/group';
import { GroupService } from './group_service';
import { GroupRepositoryImpl } from '../../repositories/group/group_repository_impl';

class GroupServiceImpl implements GroupService {
    _repository = new GroupRepositoryImpl();

    async findAll(): Promise<Group[]> {
        return await this._repository.findAll();
    }
    async create(group: Group): Promise<Group> {
        return await this._repository.create(group);
    }
    async update(group: Group): Promise<Group> {
        return await this._repository.update(group);
    }
    async remove(id: number) {
        await this._repository.remove(id);
    }
}

const groupService = new GroupServiceImpl();

export { groupService };
