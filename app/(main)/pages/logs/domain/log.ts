import { Pageable } from '@/app/api/core/pageable';

export interface LogUser {
    id: string;
    name: string;
}

export interface LogResponse {
    id: number;
    endPoint: string;
    method: string;
    address: string;
    date: Date | string;
    user: LogUser;
}

export interface LogRequest {
    userId: string;
    startDate: string;
    endDate: string;
    method: string;
    pageable: Pageable;
}

export interface LogFilters {
    userId: string;
    method: string;
    startDate: string;
    endDate: string;
}

export function createInitialLogFilters(): LogFilters {
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - 1);

    const endDate = new Date();

    return {
        userId: '',
        method: '',
        startDate: formatDateInput(startDate),
        endDate: formatDateInput(endDate)
    };
}

function formatDateInput(date: Date): string {
    return date.toISOString().split('T')[0];
}
