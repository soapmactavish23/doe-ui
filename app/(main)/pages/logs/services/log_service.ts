import { Page } from '../../../../api/core/pageable';
import { LogRequest, LogResponse } from '../types/log';

export interface LogService {
    search(request: LogRequest): Promise<Page<LogResponse>>;
    findMethods(): Promise<string[]>;
}
