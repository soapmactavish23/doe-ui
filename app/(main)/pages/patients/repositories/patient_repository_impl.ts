import { PatientParam } from './../types/patient';
import { Pageable, Page } from '@/app/api/core/pageable';
import { PatientResponse, PatientRequest, PatientResponseDetail } from '../types/patient';
import { PatientRepository } from './patient_repository';
import { api } from '@/app/api/core/api';

export class PatientRepositoryImpl implements PatientRepository {
    async search(dto: PatientParam): Promise<Page<PatientResponse>> {
        const response = await api.get('pacientes', {
            params: {
                name: dto.name,
                page: dto.pageable.page,
                size: dto.pageable.size
            }
        });
        return response.data;
    }
    async create(request: PatientRequest, image: File | null): Promise<PatientResponse> {
        const formData = new FormData();

        const patientBlob = new Blob([JSON.stringify(request)], { type: 'application/json' });

        formData.append('patient', patientBlob);

        if (image) {
            formData.append('image', image);
        }

        const response = await api.post<PatientResponse>('/pacientes', formData);

        return response.data;
    }

    async update(request: PatientRequest, image: File | null): Promise<PatientResponse> {
        const formData = new FormData();

        const patientBlob = new Blob([JSON.stringify(request)], { type: 'application/json' });

        formData.append('patient', patientBlob);

        if (image) {
            formData.append('image', image);
        }

        const response = await api.put<PatientResponse>(`/pacientes`, formData);

        return response.data;
    }
    async findById(id: string): Promise<PatientResponseDetail> {
        const response = await api.get<PatientResponseDetail>(`/pacientes/${id}`);
        return response.data;
    }
    async remove(id: string): Promise<void> {
        await api.delete(`/pacientes/${id}`);
    }
}
