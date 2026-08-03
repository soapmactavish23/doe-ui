import { Pageable } from '@/app/api/core/pageable';

import { Group, createEmptyGroup } from '../../groups/domain/group';

export interface User {
    id: string | null;
    name: string;
    email: string;
    password: string;
    status: boolean;
    group: Group;
}

export interface UserSearchRequest {
    name: string;
    email: string;
    pageable: Pageable;
}

export const createEmptyUser = (): User => ({
    id: null,
    email: '',
    name: '',
    group: createEmptyGroup(),
    password: '',
    status: true
});
