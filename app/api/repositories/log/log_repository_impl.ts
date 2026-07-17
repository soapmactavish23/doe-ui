import { api } from '../../core/api';
import { Page } from '../../core/pageable';
import { LogRequest, LogResponse } from './../../models/log';
import { LogRepository } from './log_respository';

export class LogRepositoryImpl implements LogRepository {
    async search(request: LogRequest): Promise<Page<LogResponse>> {
        const response = await api.get(`log?userId=${request.userId}&startDate=${request.startDate}&endDate=${request.endDate}&method=${request.method}&page=${request.pageable.page}&size=${request.pageable.size}`);
        return response.data;
    }
    async findMethods(): Promise<string[]> {
        const response = await api.get('log/metodos');
        return response.data;
    }
}
