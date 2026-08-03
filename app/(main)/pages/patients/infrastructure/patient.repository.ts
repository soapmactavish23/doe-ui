import { api } from '@/app/api/core/api';
import { Page } from '@/app/api/core/pageable';

import { PatientRequest, PatientResponse, PatientResponseDetail, PatientSearchRequest } from '../domain/patient';

const PATIENT_ENDPOINT = 'pacientes';

function createPatientFormData(request: PatientRequest, image: File | null): FormData {
    const formData = new FormData();

    const patientBlob = new Blob([JSON.stringify(request)], {
        type: 'application/json'
    });

    formData.append('patient', patientBlob);

    if (image) {
        formData.append('image', image);
    }

    return formData;
}

export const patientRepository = {
    async search(request: PatientSearchRequest): Promise<Page<PatientResponse>> {
        const response = await api.get<Page<PatientResponse>>(PATIENT_ENDPOINT, {
            params: {
                name: request.name,
                page: request.pageable.page,
                size: request.pageable.size
            }
        });

        return response.data;
    },

    async create(request: PatientRequest, image: File | null): Promise<PatientResponse> {
        const formData = createPatientFormData(request, image);

        const response = await api.post<PatientResponse>(PATIENT_ENDPOINT, formData);

        return response.data;
    },

    async update(request: PatientRequest, image: File | null): Promise<PatientResponse> {
        const formData = createPatientFormData(request, image);

        const response = await api.put<PatientResponse>(PATIENT_ENDPOINT, formData);

        return response.data;
    },

    async findById(id: string): Promise<PatientResponseDetail> {
        const response = await api.get<PatientResponseDetail>(`${PATIENT_ENDPOINT}/${id}`);

        return response.data;
    },

    async remove(id: string): Promise<void> {
        await api.delete(`${PATIENT_ENDPOINT}/${id}`);
    }
};
