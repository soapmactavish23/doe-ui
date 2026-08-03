import { api } from '@/app/api/core/api';
import { Page } from '@/app/api/core/pageable';

import { LogRequest, LogResponse } from '../domain/log';

const LOG_ENDPOINT = 'log';

export const logRepository = {
    async search(request: LogRequest): Promise<Page<LogResponse>> {
        const response = await api.get<Page<LogResponse>>(LOG_ENDPOINT, {
            params: {
                userId: request.userId,
                startDate: request.startDate,
                endDate: request.endDate,
                method: request.method,
                page: request.pageable.page,
                size: request.pageable.size
            }
        });

        return response.data;
    },

    async findMethods(): Promise<string[]> {
        const response = await api.get<string[]>(`${LOG_ENDPOINT}/metodos`);

        return response.data;
    }
};
