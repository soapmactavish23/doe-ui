import { LogRequest, LogResponse } from '../types/log';
import { CrudTemplate } from '../../../../api/core/crud';
import { Page } from '../../../../api/core/pageable';

export interface LogRepository extends CrudTemplate<LogResponse> {
    search(request: LogRequest): Promise<Page<LogResponse>>;
    findMethods(): Promise<string[]>;
}
