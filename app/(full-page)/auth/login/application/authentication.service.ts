import { LoginRequest, LoginResponse } from '../domain/authentication';

import { authenticationRepository } from '../infrastructure/authentication.repository';

const ACCESS_TOKEN_KEY = 'access_token';
const REFRESH_TOKEN_KEY = 'refresh_token';

export const authenticationService = {
    async login(request: LoginRequest): Promise<LoginResponse> {
        const normalizedRequest: LoginRequest = {
            email: request.email.trim().toLowerCase(),
            password: request.password
        };

        const response = await authenticationRepository.login(normalizedRequest);

        this.saveTokens(response);

        return response;
    },

    saveTokens(response: LoginResponse): void {
        if (typeof window === 'undefined') {
            return;
        }

        localStorage.setItem(ACCESS_TOKEN_KEY, response.access_token);

        localStorage.setItem(REFRESH_TOKEN_KEY, response.refresh_token);
    },

    getAccessToken(): string | null {
        if (typeof window === 'undefined') {
            return null;
        }

        return localStorage.getItem(ACCESS_TOKEN_KEY);
    },

    getRefreshToken(): string | null {
        if (typeof window === 'undefined') {
            return null;
        }

        return localStorage.getItem(REFRESH_TOKEN_KEY);
    },

    clearTokens(): void {
        if (typeof window === 'undefined') {
            return;
        }

        localStorage.removeItem(ACCESS_TOKEN_KEY);

        localStorage.removeItem(REFRESH_TOKEN_KEY);
    }
};
