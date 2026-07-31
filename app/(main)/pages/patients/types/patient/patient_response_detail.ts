import { Responsable } from '../responsable/responsable';
import { PatientRequest } from './patient_request';

export interface PatientResponseDetail {
    id: string | null;
    name: string;
    birthDate: string;
    sex: 'MALE' | 'FEMALE';
    cause: string;
    startTreatment: string;
    url: string | null;
    responsables: Responsable[];
}
