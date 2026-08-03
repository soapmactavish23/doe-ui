import { api } from '@/app/api/core/api';

import { LoginRequest, LoginResponse } from '../domain/authentication';

export const authenticationRepository = {
    async login(request: LoginRequest): Promise<LoginResponse> {
        const response = await api.post<LoginResponse>('usuarios/login', request);

        return response.data;
    }
};
