import { z } from 'zod';

import { Responsable, ResponsableType } from '../../../domain/responsable';

import { addressSchema } from './address.schema';

export const responsableSchema = z.object({
    id: z.string().nullable().default(null),

    name: z.string().trim().min(1, 'Nome é obrigatório').max(150, 'Nome deve possuir no máximo 150 caracteres'),

    contact: z.string().trim().min(1, 'Contato é obrigatório').max(15, 'Contato deve possuir no máximo 15 caracteres'),

    rg: z.string().trim().min(1, 'RG é obrigatório').max(12, 'RG deve possuir no máximo 12 caracteres'),

    cpf: z
        .string()
        .trim()
        .min(1, 'CPF é obrigatório')
        .regex(/^\d{3}\.\d{3}\.\d{3}-\d{2}$|^\d{11}$/, 'CPF inválido'),

    localWorker: z.string().trim().min(1, 'Local de trabalho é obrigatório').max(150, 'Local de trabalho deve possuir no máximo 150 caracteres'),

    type: z.nativeEnum(ResponsableType, {
        error: (issue) => {
            if (issue.input === undefined || issue.input === null) {
                return 'Tipo é obrigatório';
            }

            return 'Tipo de responsável inválido';
        }
    }),

    address: addressSchema
});

export type ResponsableFormInput = z.input<typeof responsableSchema>;

export type ResponsableFormOutput = z.output<typeof responsableSchema>;

export function convertToResponsable(data: ResponsableFormOutput): Responsable {
    return {
        id: data.id ?? null,
        name: data.name,
        contact: data.contact,
        rg: data.rg,
        cpf: data.cpf,
        localWorker: data.localWorker,
        type: data.type,

        address: {
            zipCode: data.address.zipCode,
            street: data.address.street,
            complement: data.address.complement ?? '',
            district: data.address.district,
            city: data.address.city,
            state: data.address.state
        }
    };
}
