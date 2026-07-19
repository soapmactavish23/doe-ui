import { CrudTemplate } from '../../../../api/core/crud';
import { Page, Pageable } from '../../../../api/core/pageable';
import { AuthLoginRequest, AuthLoginResponse, PasswordDTO, ProfileDTO, User } from '../types/user';

export interface UserRepository extends CrudTemplate<User> {
    search(name: string, email: string, pageable: Pageable): Promise<Page<User>>;
    changePassword(passwordDTO: PasswordDTO): void;
    resetPassword(id: string): void;
    editProfile(profileDTO: ProfileDTO): void;
    login(authLogin: AuthLoginRequest): Promise<AuthLoginResponse>;
    changeStatus(id: string): void;
    recoveryPassword(email: string): void;
    refreshToken(refreshToken: string): Promise<AuthLoginResponse>;
}
