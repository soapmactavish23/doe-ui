import { z } from 'zod';

export const passwordSchema = z
    .object({
        password: z.string().min(6, 'A senha atual deve ter no mínimo 6 caracteres').max(150, 'A senha atual deve ter no máximo 150 caracteres'),

        newPassword: z.string().min(6, 'A nova senha deve ter no mínimo 6 caracteres').max(150, 'A nova senha deve ter no máximo 150 caracteres'),

        confirmPassword: z.string().min(6, 'A confirmação deve ter no mínimo 6 caracteres').max(150, 'A confirmação deve ter no máximo 150 caracteres')
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
        message: 'As senhas não correspondem',
        path: ['confirmPassword']
    })
    .refine((data) => data.password !== data.newPassword, {
        message: 'A nova senha deve ser diferente da senha atual',
        path: ['newPassword']
    });

export type PasswordForm = z.infer<typeof passwordSchema>;
