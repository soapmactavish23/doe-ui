import { LogRequest, LogResponse } from './../../models/log';
import { CrudTemplate } from '../../core/crud';
import { Page } from '../../core/pageable';

export interface LogRepository extends CrudTemplate<LogResponse> {
    search(request: LogRequest): Promise<Page<LogResponse>>;
    findMethods() : Promise<string[]>;
}
