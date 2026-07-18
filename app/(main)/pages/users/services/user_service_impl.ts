import { Page } from '../../../../api/core/pageable';
import { User, PasswordDTO, ProfileDTO, AuthLoginRequest, AuthLoginResponse } from '../types/user';
import { UserRepositoryImpl } from '../repositories/user_repository_impl';
import { SearchDTO, UserService } from './user_service';

class UserServiceImpl implements UserService {
    async refreshToken(refreshToken: string): Promise<AuthLoginResponse> {
        return await this._repository.refreshToken(refreshToken);
    }
    async recoveryPassword(email: string) {
        await this._repository.recoveryPassword(email);
    }
    findAll?(): Promise<User[]> {
        throw new Error('Method not implemented.');
    }
    findById?(id: number): Promise<User> {
        throw new Error('Method not implemented.');
    }
    _repository = new UserRepositoryImpl();

    async findByCode(code: string): Promise<User> {
        return await this._repository.findByCode(code);
    }
    async search(props: SearchDTO): Promise<Page<User>> {
        return await this._repository.search(props.name, props.email, props.pageable);
    }
    async changePassword(passwordDTO: PasswordDTO) {
        await this._repository.changePassword(passwordDTO);
    }
    async resetPassword(id: number) {
        await this._repository.resetPassword(id);
    }
    async editProfile(profileDTO: ProfileDTO) {
        await this._repository.editProfile(profileDTO);
    }
    async login(authLogin: AuthLoginRequest): Promise<AuthLoginResponse> {
        return await this._repository.login(authLogin);
    }
    async changeStatus(id: number) {
        await this._repository.changeStatus(id);
    }

    async create?(t: User): Promise<User> {
        return await this._repository.create(t);
    }
    async update?(t: User): Promise<User> {
        return await this._repository.update(t);
    }
    async remove?(id: number) {
        await this._repository.remove(id);
    }
}

const userService: UserService = new UserServiceImpl();

export { userService };
