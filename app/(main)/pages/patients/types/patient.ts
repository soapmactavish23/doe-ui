import { Pageable } from '@/app/api/core/pageable';
import { Responsable } from './responsable';
import z from 'zod';

export interface PatientRequest {
    id: string | null;
    name: string;
    birthDate: Date | null;
    sex: 'MALE' | 'FEMALE' | null;
    cause: string;
    startTreatment: Date | null;
    responsables: Responsable[];
}

export const patientRequestSchema = z.object({
    name: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),

    birthDate: z
        .date({
            required_error: 'A data de nascimento é obrigatória',
            invalid_type_error: 'Informe uma data de nascimento válida'
        })
        .nullable()
        .refine((value) => value !== null, {
            message: 'A data de nascimento é obrigatória'
        }),

    sex: z.enum(['MALE', 'FEMALE'], {
        required_error: 'O sexo é obrigatório',
        invalid_type_error: 'Selecione um sexo válido'
    }),

    cause: z.string().min(3, 'A causa deve ter no mínimo 3 caracteres'),

    startTreatment: z
        .date({
            required_error: 'A data de início do tratamento é obrigatória',
            invalid_type_error: 'Informe uma data válida'
        })
        .nullable()
        .refine((value) => value !== null, {
            message: 'A data de início do tratamento é obrigatória'
        }),

    responsables: z.array(z.custom<Responsable>()).min(1, 'Informe pelo menos um responsável')
});

export interface PatientResponse {
    id: string;
    name: string;
    cause: string;
    url: string;
}

/*
 * As datas chegam da API como string JSON.
 * Elas serão convertidas para Date no formulário.
 */
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

export interface PatientParam {
    name: string;
    pageable: Pageable;
}

export const newPatientRequest: PatientRequest = {
    id: null,
    name: '',
    birthDate: null,
    sex: null,
    cause: '',
    startTreatment: null,
    responsables: []
};
