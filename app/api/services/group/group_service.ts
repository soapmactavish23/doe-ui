import { Group } from '../../models/group';

export interface GroupService {
    findAll(): Promise<Group[]>;
    create(group: Group): Promise<Group>;
    update(group: Group): Promise<Group>;
    remove(id: number): void;
}
