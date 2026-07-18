import { Group, newGroup } from '../../groups/types/group';

export interface User {
    id: number | null;
    code: string;
    name: string;
    email: string;
    password: string;
    status: boolean;
    group: Group;
}

export interface PasswordDTO {
    code: string;
    password: string;
    confirmPassword: string;
    newPassword: string;
}

export interface ProfileDTO {
    id: number;
    name: string;
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
    code: '',
    email: '',
    name: '',
    group: newGroup,
    password: '',
    status: true
};
