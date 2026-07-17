import { User } from '../api/models/user';
import { userService } from '../api/services/user/user_service_impl';
import { decodeToken } from '../api/core/api';

class UserContext {
    async getUserLogged(): Promise<User> {
        const decoded = decodeToken();
        return await userService.findByCode(decoded?.sub!);
    }
}

const userContext: UserContext = new UserContext();

export { userContext };
