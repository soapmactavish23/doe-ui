import { CrudTemplate } from '../../core/crud';
import { Page, Pageable } from '../../core/pageable';
import { AuthLoginRequest, AuthLoginResponse, PasswordDTO, ProfileDTO, User } from '../../models/user';

export interface UserRepository extends CrudTemplate<User> {
    search(name: string, email: string, pageable: Pageable): Promise<Page<User>>;
    changePassword(passwordDTO: PasswordDTO): void;
    resetPassword(id: number): void;
    editProfile(profileDTO: ProfileDTO): void;
    login(authLogin: AuthLoginRequest): Promise<AuthLoginResponse>;
    changeStatus(id: number): void;
    findByCode(code: string): Promise<User>;
    recoveryPassword(email: string): void;
    refreshToken(refreshToken: string): Promise<AuthLoginResponse>;
}
