import { z } from 'zod';
import { addressSchema } from '../address/address_schema';
import { ResponsableType } from './responsable_type';

export const responsableSchema = z.object({
    id: z.string().nullable().optional(),

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
        error: (issue) => (issue.input === undefined || issue.input === null ? 'Tipo é obrigatório' : 'Tipo de responsável inválido')
    }),

    address: addressSchema
});
