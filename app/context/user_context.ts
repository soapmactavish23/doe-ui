import { User } from '../(main)/pages/users/types/user';
import { userService } from '../(main)/pages/users/services/user_service_impl';
import { decodeToken } from '../api/core/api';

class UserContext {
    async getUserLogged(): Promise<User> {
        const decoded = decodeToken();
        return await userService.findByCode(decoded?.sub!);
    }
}

const userContext: UserContext = new UserContext();

export { userContext };
