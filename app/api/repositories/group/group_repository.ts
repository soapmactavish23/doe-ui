import { CrudTemplate } from '../../core/crud';
import { Group } from '../../models/group';

export interface GroupRepository extends CrudTemplate<Group> {}
