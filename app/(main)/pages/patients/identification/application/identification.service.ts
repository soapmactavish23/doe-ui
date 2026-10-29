import { IdentificationRequest, IdentificationResponse, IdentificationResultResponse } from '../domain/identification';

import { identificationRepository } from '../infrastructure/identification.repository';
import { identificationStorage } from './identification.storage';
import { getFirebaseToken } from '@/firebase';

export const identificationService = {
    async create(file: File): Promise<IdentificationResponse> {
        const pushToken = await getFirebaseToken();

        if (!pushToken?.trim()) {
            throw new Error('Não foi possível ativar as notificações Firebase.');
        }

        const request: IdentificationRequest = {
            file,
            pushToken
        };

        const response = await identificationRepository.create(request);

        identificationStorage.saveIdentificationId(response.id);

        return response;
    },

    async findById(id: string): Promise<IdentificationResultResponse> {
        return identificationRepository.findById(id);
    },

    getSavedIdentificationId(): string | null {
        return identificationStorage.getIdentificationId();
    },

    clear(): void {
        identificationStorage.clearIdentification();
    }
};
