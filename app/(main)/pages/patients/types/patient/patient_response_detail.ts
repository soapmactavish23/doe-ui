import { Responsable } from '../responsable/responsable';

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
