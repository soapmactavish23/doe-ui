export interface LoginRequest {
    email: string;
    password: string;
}

export interface LoginResponse {
    expires_in: number;
    access_token: string;
    refresh_token: string;
}
