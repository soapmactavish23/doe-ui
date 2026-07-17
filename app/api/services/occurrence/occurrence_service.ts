import { QtdByDTO } from '../../models/qtd_by_dto';
import { VerifyRequest } from '../../models/request/verify_request';
import { VerifyResponse } from '../../models/response/verify_response';
import { DateRequest, TaxResponse } from '../../models/tax_dto';
import { CrudTemplate } from './../../core/crud';
import { Occurrence, OccurrenceListResponse, OccurrenceRequest, OccurrenceResponse } from './../../models/occurrence';

export interface OccurrenceService extends CrudTemplate<Occurrence> {
    loadTax(): Promise<TaxResponse>;
    findByDate(dto: DateRequest): Promise<Occurrence[]>;
    sendImage(dto: OccurrenceRequest): Promise<Occurrence>;
    countByAnimal(): Promise<QtdByDTO[]>;
    countRightByAnimal(): Promise<QtdByDTO[]>;
    countErrorByAnimal(): Promise<QtdByDTO[]>;
    countByMonth(): Promise<QtdByDTO[]>;
    loadForVerify(): Promise<VerifyResponse[]>;
    sendVerify(request: VerifyRequest): Promise<void>;
    loadByDeviceId(deviceId: string): Promise<OccurrenceListResponse[]>;
    findDetail(id: number): Promise<OccurrenceResponse>;
}
