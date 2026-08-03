import { z } from 'zod';

export const userSchema = z
    .object({
        id: z.string().nullable(),

        name: z.string().trim().min(3, 'Nome deve ter no mínimo 3 caracteres').max(150, 'Nome deve ter no máximo 150 caracteres'),

        email: z.string().trim().min(1, 'E-mail é obrigatório').email('E-mail inválido'),

        password: z.string().optional(),

        confirmPassword: z.string().optional(),

        group: z.object({
            id: z.string().min(1, 'Grupo é obrigatório'),

            name: z.string().min(1, 'Grupo é obrigatório')
        })
    })
    .superRefine((data, context) => {
        /*
         * Na criação, a senha é obrigatória.
         */
        if (!data.id) {
            if (!data.password || data.password.length < 6) {
                context.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: 'Senha deve ter no mínimo 6 caracteres',
                    path: ['password']
                });
            }

            if (!data.confirmPassword || data.confirmPassword.length < 6) {
                context.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: 'Confirmação deve ter no mínimo 6 caracteres',
                    path: ['confirmPassword']
                });
            }

            if (data.password !== data.confirmPassword) {
                context.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: 'As senhas não coincidem',
                    path: ['confirmPassword']
                });
            }
        }
    });

export type UserForm = z.infer<typeof userSchema>;
