export interface ChangeEmailRequest {
    email: string;
}

export const createEmptyChangeEmailRequest = (): ChangeEmailRequest => ({
    email: ''
});
