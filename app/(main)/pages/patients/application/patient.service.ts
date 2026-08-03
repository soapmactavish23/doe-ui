import { Page } from '@/app/api/core/pageable';

import { PatientRequest, PatientResponse, PatientResponseDetail, PatientSearchRequest } from '../domain/patient';

import { patientRepository } from '../infrastructure/patient.repository';

export const patientService = {
    async search(request: PatientSearchRequest): Promise<Page<PatientResponse>> {
        const normalizedRequest: PatientSearchRequest = {
            ...request,
            name: request.name.trim()
        };

        return patientRepository.search(normalizedRequest);
    },

    async create(request: PatientRequest, image: File | null): Promise<PatientResponse> {
        const normalizedRequest = normalizePatientRequest(request);

        return patientRepository.create(normalizedRequest, image);
    },

    async update(request: PatientRequest, image: File | null): Promise<PatientResponse> {
        if (!request.id) {
            throw new Error('O ID do paciente é obrigatório para atualização');
        }

        const normalizedRequest = normalizePatientRequest(request);

        return patientRepository.update(normalizedRequest, image);
    },

    async findById(id: string): Promise<PatientResponseDetail> {
        if (!id) {
            throw new Error('O ID do paciente é obrigatório');
        }

        return patientRepository.findById(id);
    },

    async remove(id: string): Promise<void> {
        if (!id) {
            throw new Error('O ID do paciente é obrigatório para exclusão');
        }

        await patientRepository.remove(id);
    }
};

function normalizePatientRequest(request: PatientRequest): PatientRequest {
    return {
        ...request,
        name: request.name.trim(),
        cause: request.cause.trim(),

        responsables: request.responsables.map((responsable) => ({
            ...responsable,
            name: responsable.name.trim(),
            contact: responsable.contact.trim(),
            rg: responsable.rg.trim(),
            cpf: responsable.cpf.trim(),
            localWorker: responsable.localWorker.trim(),

            address: {
                ...responsable.address,
                zipCode: responsable.address.zipCode.trim(),
                street: responsable.address.street.trim(),
                complement: responsable.address.complement.trim(),
                district: responsable.address.district.trim(),
                city: responsable.address.city.trim(),
                state: responsable.address.state.trim().toUpperCase()
            }
        }))
    };
}
