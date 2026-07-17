/* eslint-disable @next/next/no-img-element */
'use client';
import { Toast } from 'primereact/toast';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useContext, useRef } from 'react';
import { LayoutContext } from '@/layout/context/layoutcontext';
import { useRouter } from 'next/navigation';
import { classNames } from 'primereact/utils';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { userService } from '@/app/api/services/user/user_service_impl';

const formLogin = z.object({
    email: z.string()
});

type FormLogin = z.infer<typeof formLogin>;

export default function RecoveryPassword() {
    const { layoutConfig } = useContext(LayoutContext);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting }
    } = useForm<FormLogin>({
        resolver: zodResolver(formLogin)
    });

    const router = useRouter();
    const containerClassName = classNames('surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden', { 'p-input-filled': layoutConfig.inputStyle === 'filled' });

    const toast = useRef<Toast>(null);

    const onSubmit = async (data: FormLogin) => {
        try {
            await userService.recoveryPassword(data.email);
            toast.current!.show({
                severity: 'success',
                summary: 'Nova senha enviada',
                detail: 'Nova senha enviada com sucesso, verifique seu e-mail.'
            });
        } catch (err) {
            console.error('Erro:', err);
            toast.current!.show({
                severity: 'error',
                summary: 'Erro!',
                detail: 'Erro ao recuperar senha, tente novamente!'
            });
        }
    };

    return (
        <>
            <Toast ref={toast} />
            <div className={containerClassName}>
                <div className="flex flex-column align-items-center justify-content-center">
                    <div
                        style={{
                            borderRadius: '56px',
                            padding: '0.3rem',
                            background: 'linear-gradient(180deg, var(--yellow-400) 100%, rgba(33, 150, 243, 0) 100%)'
                        }}
                    >
                        <div className="w-full surface-card py-8 px-5 sm:px-8" style={{ borderRadius: '53px' }}>
                            <div className="text-center mb-5">
                                <img src="/demo/images/logo.png" alt="Image" height="100" className="mb-3" />
                                <div className="text-900 text-3xl font-medium mb-3">Radar Peçonhento</div>
                                <span className="text-600 font-medium">Recuperar senha</span>
                            </div>

                            <form onSubmit={handleSubmit(onSubmit)}>
                                <label htmlFor="email1" className="block text-900 text-xl font-medium mb-2">
                                    Email
                                </label>
                                <InputText id="email1" type="email" placeholder="Digite seu e-mail" className="w-full md:w-30rem mb-5 text-xl" style={{ padding: '1rem' }} {...register('email')} required />
                                <div></div>
                                <Button label="Recuperar Senha" loading={isSubmitting} type="submit" severity="warning" className="w-full p-3 text-xl mb-3"></Button>
                                <Button label="Voltar" outlined type="button" severity="warning" className="w-full p-3 text-xl" icon="pi pi-arrow-left" onClick={() => router.push('/auth/login')}></Button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
