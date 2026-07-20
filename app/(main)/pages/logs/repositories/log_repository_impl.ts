import { api } from '../../../../api/core/api';
import { Page } from '../../../../api/core/pageable';
import { LogRequest, LogResponse } from '../types/log';
import { LogRepository } from './log_respository';

export class LogRepositoryImpl implements LogRepository {
    async search(request: LogRequest): Promise<Page<LogResponse>> {
        const response = await api.get('log', {
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
    }
    async findMethods(): Promise<string[]> {
        const response = await api.get('log/metodos');
        return response.data;
    }
}
