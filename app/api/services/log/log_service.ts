import { Page } from "../../core/pageable";
import { LogRequest, LogResponse } from "../../models/log";

export interface LogService {
    search(request: LogRequest): Promise<Page<LogResponse>>;
    findMethods(): Promise<string[]>;
}
