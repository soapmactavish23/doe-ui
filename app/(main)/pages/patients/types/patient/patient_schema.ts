import { z } from 'zod';
import { Responsable } from '../responsable/responsable';

export const patientSchema = z.object({
    name: z.string().trim().min(3, 'Nome deve ter no mínimo 3 caracteres'),

    birthDate: z
        .date({
            error: (issue) => {
                if (issue.input === undefined || issue.input === null) {
                    return 'A data de nascimento é obrigatória';
                }

                return 'Informe uma data de nascimento válida';
            }
        })
        .nullable()
        .refine((value) => value !== null, {
            message: 'A data de nascimento é obrigatória'
        }),

    sex: z
        .enum(['MALE', 'FEMALE'], {
            error: (issue) => {
                if (issue.input === undefined || issue.input === null || issue.input === '') {
                    return 'O sexo é obrigatório';
                }

                return 'Selecione um sexo válido';
            }
        })
        .nullable()
        .refine((value) => value !== null, {
            message: 'O sexo é obrigatório'
        }),

    cause: z.string().trim().min(3, 'A causa deve ter no mínimo 3 caracteres'),

    startTreatment: z
        .date({
            error: (issue) => {
                if (issue.input === undefined || issue.input === null) {
                    return 'A data de início do tratamento é obrigatória';
                }

                return 'Informe uma data válida';
            }
        })
        .nullable()
        .refine((value) => value !== null, {
            message: 'A data de início do tratamento é obrigatória'
        }),

    responsables: z.array(z.custom<Responsable>()).min(1, 'Informe pelo menos um responsável')
});

export type PatientSchemaInput = z.input<typeof patientSchema>;
export type PatientSchemaOutput = z.output<typeof patientSchema>;
