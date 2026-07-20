import { Responsable } from './responsable';

export interface Patient {
    id: string | null;
    name: string;
    birthDate: Date;
    sex: 'MALE' | 'FEMALE';
    cause: string;
    startTreatment: Date;
    responsables: Responsable[];
}

export let newPatient: Patient = {
    id: null,
    name: '',
    birthDate: new Date(),
    sex: 'MALE',
    cause: '',
    startTreatment: new Date(),
    responsables: []
};
