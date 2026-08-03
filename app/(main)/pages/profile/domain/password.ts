export interface ChangePasswordRequest {
    code: string;
    password: string;
    newPassword: string;
    confirmPassword: string;
}

export const createEmptyChangePasswordRequest = (): ChangePasswordRequest => ({
    code: '',
    password: '',
    newPassword: '',
    confirmPassword: ''
});
