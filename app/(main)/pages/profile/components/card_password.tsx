import { User } from '@/app/api/models/user';
import { userService } from '@/app/api/services/user/user_service_impl';
import { Message } from '@/app/components/Message';
import { userContext } from '@/app/context/user_context';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from 'primereact/button';
import { Fieldset } from 'primereact/fieldset';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const passwordSchema = z.object({
    password: z.string(),
    confirmPassword: z.string(),
    newPassword: z.string()
});

type PasswordSchema = z.infer<typeof passwordSchema>;

export default function CardPassword() {
    const toast = useRef<Toast>(null);
    const [user, setUser] = useState<User>();
    const [isSending, setIsSending] = useState<boolean>(false);

    const {
        register,
        handleSubmit,
        setValue,
        formState: { isSubmitting }
    } = useForm<PasswordSchema>({
        resolver: zodResolver(passwordSchema)
    });

    const onSubmit = async (data: PasswordSchema) => {
        console.log('aqui');
        setIsSending(true);
        if (user?.id !== null) {
            userService
                .changePassword({
                    code: user?.code!,
                    password: data.password,
                    newPassword: data.newPassword,
                    confirmPassword: data.confirmPassword
                })
                .then(() => {
                    setIsSending(false);
                    toast.current?.show({
                        severity: 'success',
                        summary: Message.successMsg,
                        detail: Message.successSave
                    });
                })
                .catch((err) => {
                    console.error(`Erro: ${err}`);
                    setIsSending(false);
                    toast.current?.show({
                        severity: 'error',
                        summary: Message.errorMsg,
                        detail: Message.errorSave
                    });
                });
        } else {
            setIsSending(false);
            toast.current?.show({
                severity: 'error',
                summary: Message.errorMsg,
                detail: Message.expiredSession
            });
        }
    };

    useEffect(() => {
        (async () => {
            const userData = await userContext.getUserLogged();
            setUser(userData);
        })();
    }, [setValue]);

    return (
        <>
            <Toast ref={toast} />
            <Fieldset legend="Alterar Senha">
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="grid p-fluid">
                        <div className="col-12 md:col-4">
                            <h5>Senha Atual</h5>
                            <span className="p-input-icon-left">
                                <i className="pi pi-lock" />
                                <InputText type="password" placeholder="Digite a senha atual" maxLength={150} minLength={6} {...register('password')} required />
                            </span>
                        </div>
                        <div className="col-12 md:col-4">
                            <h5>Nova Senha</h5>
                            <span className="p-input-icon-left">
                                <i className="pi pi-lock" />
                                <InputText type="password" placeholder="Digite a nova senha" maxLength={150} minLength={6} required {...register('newPassword')} />
                            </span>
                        </div>
                        <div className="col-12 md:col-4">
                            <h5>Confirme a senha</h5>
                            <span className="p-input-icon-left">
                                <i className="pi pi-lock" />
                                <InputText type="password" placeholder="Confirmar senha" maxLength={150} minLength={6} required {...register('confirmPassword')} />
                            </span>
                        </div>
                    </div>
                    <hr />
                    <Button severity="success" label="Salvar" icon="pi pi-save" type="submit" loading={isSubmitting || isSending} />
                </form>
            </Fieldset>
        </>
    );
}
