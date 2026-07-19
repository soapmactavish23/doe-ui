import { api, apiUnAuth } from '../../../../api/core/api';
import { Page, Pageable } from '../../../../api/core/pageable';
import { AuthLoginRequest, AuthLoginResponse, PasswordDTO, ProfileDTO, User } from '../types/user';
import { UserRepository } from './user_repository';
export class UserRepositoryImpl implements UserRepository {
    async recoveryPassword(email: string) {
        await apiUnAuth.post(`usuarios/recuperar-senha?email=${email}`);
    }
    async changePassword(passwordDTO: PasswordDTO) {
        await api.put('usuarios/alterar-senha', passwordDTO);
    }
    async resetPassword(id: string) {
        await api.put(`usuarios/resetar-senha/${id}`);
    }
    async editProfile(profileDTO: ProfileDTO) {
        await api.put('usuarios/editar-perfil', profileDTO);
    }
    async login(authLogin: AuthLoginRequest): Promise<AuthLoginResponse> {
        const response = await apiUnAuth.post('usuarios/login', authLogin);
        return response.data;
    }
    async refreshToken(refreshToken: string): Promise<AuthLoginResponse> {
        const response = await apiUnAuth.post('usuarios/refresh', {
            refreshToken: refreshToken
        });
        return response.data;
    }

    async changeStatus(id: string) {
        await api.put(`usuarios/status/${id}`);
    }
    async search(name: string, email: string, pageable: Pageable): Promise<Page<User>> {
        const response = await api.get('usuarios', {
            params: {
                name,
                email,
                ...pageable
            }
        });
        return {
            content: response.data.content,
            page: response.data.page,
            size: response.data.size,
            totalElements: response.data.totalElements
        };
    }

    async create(t: User): Promise<User> {
        const response = await api.post('usuarios', t);
        return response.data;
    }
    async update(t: User): Promise<User> {
        const response = await api.put('usuarios', t);
        return response.data;
    }
    async remove(id: string) {
        await api.delete(`usuarios/${id}`);
    }

    async findById(id: string): Promise<User> {
        const response = await api.get(`usuarios/${id}`);
        return response.data;
    }
}
