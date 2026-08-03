import { userService } from '../(main)/pages/users/application/user.service';
import { User } from '../(main)/pages/users/domain/user';
import { decodeToken } from '../api/core/api';

class UserContext {
    async getUserLogged(): Promise<User> {
        const decoded = decodeToken();
        return await userService.findById!(decoded?.sub!);
    }
}

const userContext: UserContext = new UserContext();

export { userContext };
