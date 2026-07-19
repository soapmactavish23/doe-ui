import { CrudTemplate } from '../../../../api/core/crud';
import { Page, Pageable } from '../../../../api/core/pageable';
import { AuthLoginRequest, AuthLoginResponse, PasswordDTO, ProfileDTO, User } from '../types/user';

export interface SearchDTO {
    name: string;
    email: string;
    pageable: Pageable;
}

export interface UserService extends CrudTemplate<User> {
    search(props: SearchDTO): Promise<Page<User>>;
    changePassword(passwordDTO: PasswordDTO): Promise<void>;
    resetPassword(id: string): Promise<void>;
    editProfile(profileDTO: ProfileDTO): Promise<void>;
    login(authLogin: AuthLoginRequest): Promise<AuthLoginResponse>;
    changeStatus(id: string): void;
    recoveryPassword(email: string): void;
    refreshToken(refreshToken: string): Promise<AuthLoginResponse>;
}
