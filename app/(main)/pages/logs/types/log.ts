import { Pageable } from '../../../../api/core/pageable';
import { User } from '../../users/types/user';

export interface LogResponse {
    id: number;
    endPoint: string;
    method: string;
    address: string;
    date: Date;
    user: User;
}

export interface LogRequest {
    userId: string;
    startDate: string;
    endDate: string;
    method: string;
    pageable: Pageable;
}
