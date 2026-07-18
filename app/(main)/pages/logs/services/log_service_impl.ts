import { Page } from '../../../../api/core/pageable';
import { LogRequest, LogResponse } from '../types/log';
import { LogRepositoryImpl } from '../repositories/log_repository_impl';
import { LogService } from './log_service';

class LogServiceImpl implements LogService {
    _repository = new LogRepositoryImpl();

    async search(request: LogRequest): Promise<Page<LogResponse>> {
        return await this._repository.search(request);
    }
    async findMethods(): Promise<string[]> {
        return await this._repository.findMethods();
    }
}

const logService = new LogServiceImpl();

export { logService };
