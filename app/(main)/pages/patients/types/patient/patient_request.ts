import { Responsable } from '../responsable/responsable';

export interface PatientRequest {
    id: string | null;
    name: string;
    birthDate: Date | null;
    sex: 'MALE' | 'FEMALE' | undefined;
    cause: string;
    startTreatment: Date | null;
    responsables: Responsable[];
}

export const newPatientRequest: PatientRequest = {
    id: null,
    name: '',
    birthDate: null,
    sex: undefined,
    cause: '',
    startTreatment: null,
    responsables: []
};
