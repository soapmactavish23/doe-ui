import { z } from 'zod';

export const addressSchema = z.object({
    zipCode: z.string().trim().min(1, 'CEP é obrigatório'),

    street: z.string().trim().min(1, 'Rua é obrigatória'),

    complement: z.string().trim().optional().nullable(),

    district: z.string().trim().min(1, 'Bairro é obrigatório'),

    city: z.string().trim().min(1, 'Cidade é obrigatória'),

    state: z
        .string()
        .trim()
        .min(2, 'Informe a UF')
        .max(2, 'Informe apenas a UF')
        .transform((value) => value.toUpperCase())
});
