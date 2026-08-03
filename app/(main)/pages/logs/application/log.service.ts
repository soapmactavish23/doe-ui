import { Page } from '@/app/api/core/pageable';

import { LogFilters, LogResponse } from '../domain/log';

import { logRepository } from '../infrastructure/log.repository';

interface SearchLogsParams {
    filters: LogFilters;
    page: number;
    size: number;
}

export const logService = {
    async search({ filters, page, size }: SearchLogsParams): Promise<Page<LogResponse>> {
        const startDate = filters.startDate ? `${filters.startDate}T00:00:00` : '';

        const endDate = filters.endDate ? `${filters.endDate}T23:59:59` : '';

        return logRepository.search({
            userId: filters.userId,
            method: filters.method,
            startDate,
            endDate,
            pageable: {
                page,
                size
            }
        });
    },

    async findMethods(): Promise<string[]> {
        return logRepository.findMethods();
    }
};
