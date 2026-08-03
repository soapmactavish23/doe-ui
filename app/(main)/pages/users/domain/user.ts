import { Group, createEmptyGroup } from '../../groups/domain/group';

export interface User {
    id: string | null;
    name: string;
    email: string;
    password: string;
    status: boolean;
    group: Group;
}

export interface EmailDTO {
    email: string;
}

export interface AuthLoginRequest {
    email: string;
    password: string;
}

export interface AuthLoginResponse {
    expires_in: number;
    access_token: string;
    refresh_token: string;
}

export let newUser: User = {
    id: null,
    email: '',
    name: '',
    group: createEmptyGroup(),
    password: '',
    status: true
};
