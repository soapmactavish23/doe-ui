import { User } from '@/app/(main)/pages/users/types/user';
import { userService } from '@/app/(main)/pages/users/services/user_service_impl';
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

const profileSchema = z.object({
    name: z.string()
});

type ProfileSchema = z.infer<typeof profileSchema>;

export function CardProfile() {
    const toast = useRef<Toast>(null);
    const [user, setUser] = useState<User>();
    const [isSending, setIsSending] = useState<boolean>(false);

    const {
        register,
        handleSubmit,
        setValue,
        formState: { isSubmitting }
    } = useForm<ProfileSchema>({
        resolver: zodResolver(profileSchema)
    });

    const onSubmit = async (data: ProfileSchema) => {
        setIsSending(true);
        if (user?.id !== null) {
            userService
                .editProfile({
                    id: user?.id!,
                    name: user?.name!
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
            setValue('name', userData.name);
            setUser(userData);
        })();
    }, [setValue]);

    return (
        <>
            <Toast ref={toast} />
            <Fieldset legend="Editar Perfil">
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="p-fluid">
                        <h5>Nome</h5>
                        <span className="p-input-icon-left">
                            <i className="pi pi-user" />
                            <InputText type="text" placeholder="Digite o nome do usuário" maxLength={50} required {...register('name')} />
                        </span>
                    </div>
                    <hr />
                    <Button severity="success" label="Salvar" icon="pi pi-save" type="submit" loading={isSubmitting || isSending} />
                </form>
            </Fieldset>
        </>
    );
}
