import { z } from 'zod';

export const recoveryPasswordSchema = z.object({
    email: z.string().trim().min(1, 'E-mail obrigatório').email('E-mail inválido')
});

export type RecoveryPasswordFormData = z.infer<typeof recoveryPasswordSchema>;
