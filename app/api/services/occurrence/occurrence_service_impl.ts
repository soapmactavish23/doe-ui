import { OccurrenceRepositoryImpl } from './../../repositories/occurrence/occurrence_repository_impl';
import { DateRequest, TaxResponse } from '../../models/tax_dto';
import { OccurrenceService } from './occurrence_service';
import { Occurrence, OccurrenceListResponse, OccurrenceRequest, OccurrenceResponse } from '../../models/occurrence';
import { QtdByDTO } from '../../models/qtd_by_dto';
import { VerifyResponse } from '../../models/response/verify_response';
import { VerifyRequest } from '../../models/request/verify_request';

class OccurrenceServiceImpl implements OccurrenceService {
    findAll?(): Promise<Occurrence[]> {
        throw new Error('Method not implemented.');
    }
    create?(t: Occurrence): Promise<Occurrence> {
        throw new Error('Method not implemented.');
    }
    update?(t: Occurrence): Promise<Occurrence> {
        throw new Error('Method not implemented.');
    }
    remove?(id: number): Promise<void> {
        throw new Error('Method not implemented.');
    }
    findById?(id: number): Promise<Occurrence> {
        throw new Error('Method not implemented.');
    }
    _repository = new OccurrenceRepositoryImpl();

    async findByDate(dto: DateRequest): Promise<Occurrence[]> {
        return await this._repository.findByDate(dto);
    }

    async loadTax(): Promise<TaxResponse> {
        const response = await this._repository.loadTax();
        return response;
    }

    async sendImage(dto: OccurrenceRequest): Promise<Occurrence> {
        const response = await this._repository.sendImage(dto);
        return response;
    }

    async countByAnimal(): Promise<QtdByDTO[]> {
        return await this._repository.countByAnimal();
    }
    async countRightByAnimal(): Promise<QtdByDTO[]> {
        return await this._repository.countRightByAnimal();
    }
    async countErrorByAnimal(): Promise<QtdByDTO[]> {
        return await this._repository.countErrorByAnimal();
    }

    async countByMonth(): Promise<QtdByDTO[]> {
        return await this._repository.countByMonth();
    }

    async loadForVerify(): Promise<VerifyResponse[]> {
        return await this._repository.loadForVerify();
    }

    async sendVerify(request: VerifyRequest): Promise<void> {
        return await this._repository.sendVerify(request);
    }

    async loadByDeviceId(deviceId: string): Promise<OccurrenceListResponse[]> {
        return await this._repository.loadByDeviceId(deviceId);
    }

    async findDetail(id: number): Promise<OccurrenceResponse> {
        return await this._repository.findDetail(id);
    }
}

const occurrenceService = new OccurrenceServiceImpl();

export { occurrenceService };
