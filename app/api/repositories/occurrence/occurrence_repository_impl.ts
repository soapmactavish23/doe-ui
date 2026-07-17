import { api, apiUnAuth } from '../../core/api';
import { Occurrence, OccurrenceListResponse, OccurrenceRequest, OccurrenceResponse } from '../../models/occurrence';
import { QtdByDTO } from '../../models/qtd_by_dto';
import { DateRequest, TaxResponse } from '../../models/tax_dto';
import { VerifyResponse } from '../../models/response/verify_response';
import { OccurrenceRepository } from './occurrence_repository';
import { VerifyRequest } from '../../models/request/verify_request';

export class OccurrenceRepositoryImpl implements OccurrenceRepository {
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
    async countByMonth(): Promise<QtdByDTO[]> {
        const response = await apiUnAuth.get('ocorrencias/contar/mes');
        return response.data;
    }
    async countByAnimal(): Promise<QtdByDTO[]> {
        const response = await apiUnAuth.get('ocorrencias/contar/total');
        return response.data;
    }
    async countRightByAnimal(): Promise<QtdByDTO[]> {
        const response = await apiUnAuth.get('ocorrencias/contar/acerto');
        return response.data;
    }
    async countErrorByAnimal(): Promise<QtdByDTO[]> {
        const response = await apiUnAuth.get('ocorrencias/contar/erros');
        return response.data;
    }
    async findByDate(dto: DateRequest): Promise<Occurrence[]> {
        const response = await apiUnAuth.get(`ocorrencias?month=${dto.month}&year=${dto.year}`);
        return response.data;
    }
    async loadTax(): Promise<TaxResponse> {
        const response = await apiUnAuth.get(`ocorrencias/taxa-acerto`);
        return response.data;
    }

    async sendImage(dto: OccurrenceRequest): Promise<Occurrence> {
        const formData = new FormData();

        formData.append('animalSupposedId', String(dto.animalSupposedId));
        formData.append('image', dto.image);

        if (dto.latitude !== null && dto.latitude !== undefined) {
            formData.append('latitude', String(dto.latitude));
        }

        if (dto.longitude !== null && dto.longitude !== undefined) {
            formData.append('longitude', String(dto.longitude));
        }

        formData.append('deviceId', dto.deviceId);
        formData.append('firebaseToken', dto.firebaseToken);

        if (dto.audio) {
            formData.append('audio', dto.audio);
        }

        const response = await api.post('ocorrencias', formData);

        return response.data;
    }

    async loadForVerify(): Promise<VerifyResponse[]> {
        const response = await api.get('ocorrencias/verificar');
        return response.data;
    }

    async sendVerify(request: VerifyRequest): Promise<void> {
        await api.put('ocorrencias/verificar', request);
    }

    async loadByDeviceId(deviceId: string): Promise<OccurrenceListResponse[]> {
        const response = await api.get(`ocorrencias/device/${deviceId}`);
        return response.data;
    }

    async findDetail(id: number): Promise<OccurrenceResponse> {
        const response = await api.get(`ocorrencias/${id}`);
        return response.data;
    }
}
