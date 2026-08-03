import { Pageable } from '@/app/api/core/pageable';

import { Responsable } from './responsable';

export type PatientSex = 'MALE' | 'FEMALE';

export interface PatientSearchRequest {
    name: string;
    pageable: Pageable;
}

export interface PatientRequest {
    id: string | null;
    name: string;
    birthDate: Date | null;
    sex: PatientSex | undefined;
    cause: string;
    startTreatment: Date | null;
    responsables: Responsable[];
}

export interface PatientResponse {
    id: string;
    name: string;
    cause: string;
    url: string | null;
}

export interface PatientResponseDetail {
    id: string | null;
    name: string;
    birthDate: string;
    sex: PatientSex;
    cause: string;
    startTreatment: string;
    url: string | null;
    responsables: Responsable[];
}

export const createEmptyPatientRequest = (): PatientRequest => ({
    id: null,
    name: '',
    birthDate: null,
    sex: undefined,
    cause: '',
    startTreatment: null,
    responsables: []
});
