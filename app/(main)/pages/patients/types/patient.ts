import { Responsable } from './responsable';

export interface PatientRequest {
    id: string | null;
    name: string;
    birthDate: Date;
    sex: 'MALE' | 'FEMALE';
    cause: string;
    startTreatment: Date;
    responsables: Responsable[];
}

export interface PatientResponse {
    id: string;
    name: string;
    cause: string;
    url: string;
}

export interface PatientResponseDetail {
    id: string | null;
    name: string;
    birthDate: Date;
    sex: 'MALE' | 'FEMALE';
    cause: string;
    startTreatment: Date;
    url: string | null;
    responsables: Responsable[];
}

export let newPatientRequest: PatientRequest = {
    id: null,
    name: '',
    birthDate: new Date(),
    sex: 'MALE',
    cause: '',
    startTreatment: new Date(),
    responsables: []
};
