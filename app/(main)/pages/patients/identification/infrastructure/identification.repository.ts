import { api } from '@/app/api/core/api';

import { IdentificationRequest, IdentificationResponse, IdentificationResultResponse } from '../domain/identification';

const IDENTIFICATION_ENDPOINT = 'identifications';

function createFormData(request: IdentificationRequest): FormData {
    const formData = new FormData();
    console.log(request.pushToken);
    const identificationBlob = new Blob(
        [
            JSON.stringify({
                pushToken: request.pushToken
            })
        ],
        { type: 'application/json' }
    );

    formData.append('identification', identificationBlob);
    formData.append('file', request.file);

    return formData;
}

export const identificationRepository = {
    async create(request: IdentificationRequest): Promise<IdentificationResponse> {
        const response = await api.post<IdentificationResponse>(IDENTIFICATION_ENDPOINT, createFormData(request));

        return response.data;
    },

    async findById(id: string): Promise<IdentificationResultResponse> {
        const response = await api.get<IdentificationResultResponse>(`${IDENTIFICATION_ENDPOINT}/${id}/status`);

        return response.data;
    }
};
