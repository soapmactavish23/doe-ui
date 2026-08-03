import { z } from 'zod';

export const profileSchema = z.object({
    name: z.string().trim().min(3, 'Nome deve ter no mínimo 3 caracteres').max(50, 'Nome deve ter no máximo 50 caracteres')
});

export type ProfileForm = z.infer<typeof profileSchema>;
