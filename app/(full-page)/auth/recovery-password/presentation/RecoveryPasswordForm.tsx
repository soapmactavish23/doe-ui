/* eslint-disable @next/next/no-img-element */
'use client';

import { useContext, useRef } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { SubmitHandler, useForm } from 'react-hook-form';

import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import { classNames } from 'primereact/utils';

import { LayoutContext } from '@/layout/context/layoutcontext';
import LoadingContent from '@/layout/LoadingContent/LoadingContent';

import imgLogo from '@/public/logo.png';

import { useRecoveryPassword } from '../application/useRecoveryPassword';

import { RecoveryPasswordFormData, recoveryPasswordSchema } from './recovery-password.schema';

export default function RecoveryPasswordForm() {
    const { layoutConfig } = useContext(LayoutContext);

    const toast = useRef<Toast>(null);

    const { isNavigating, recoverPassword, goToLogin } = useRecoveryPassword();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting }
    } = useForm<RecoveryPasswordFormData>({
        resolver: zodResolver(recoveryPasswordSchema),
        defaultValues: {
            email: ''
        }
    });

    const loading = isSubmitting || isNavigating;

    const containerClassName = classNames('surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden', {
        'p-input-filled': layoutConfig.inputStyle === 'filled'
    });

    const onSubmit: SubmitHandler<RecoveryPasswordFormData> = async (data) => {
        try {
            await recoverPassword({
                email: data.email
            });

            reset();

            toast.current?.show({
                severity: 'success',
                summary: 'Nova senha enviada',
                detail: 'Nova senha enviada com sucesso, verifique seu e-mail.'
            });
        } catch (error) {
            console.error('Erro ao recuperar senha:', error);

            toast.current?.show({
                severity: 'error',
                summary: 'Erro!',
                detail: 'Erro ao recuperar senha, tente novamente!'
            });
        }
    };

    return (
        <>
            <Toast ref={toast} />

            <LoadingContent visible={loading} />

            <div className={containerClassName}>
                <div className="flex flex-column align-items-center justify-content-center">
                    <div
                        style={{
                            borderRadius: '56px',
                            padding: '0.3rem',
                            background: 'linear-gradient(180deg, var(--yellow-400) 100%, rgba(33, 150, 243, 0) 100%)'
                        }}
                    >
                        <div
                            className="w-full surface-card py-8 px-5 sm:px-8"
                            style={{
                                borderRadius: '53px'
                            }}
                        >
                            <div className="text-center mb-5">
                                <img src={imgLogo.src} alt="Logo da Fundação DOE" height="100" className="mb-3" />

                                <div className="text-900 text-3xl font-medium mb-3">DOE</div>

                                <span className="text-600 font-medium">Recuperar senha</span>
                            </div>

                            <form onSubmit={handleSubmit(onSubmit)}>
                                <label htmlFor="email" className="block text-900 text-xl font-medium mb-2">
                                    E-mail
                                </label>

                                <InputText
                                    id="email"
                                    type="email"
                                    placeholder="Digite seu e-mail"
                                    className={classNames('w-full md:w-30rem text-xl', {
                                        'p-invalid': errors.email
                                    })}
                                    style={{
                                        padding: '1rem'
                                    }}
                                    disabled={loading}
                                    aria-invalid={errors.email ? 'true' : 'false'}
                                    {...register('email')}
                                />

                                <div className="h-2rem mt-1 mb-2">{errors.email && <small className="p-error">{errors.email.message}</small>}</div>

                                <Button label="Recuperar Senha" type="submit" severity="warning" className="w-full p-3 text-xl mb-3" loading={loading} disabled={loading} />

                                <Button label="Voltar" outlined type="button" severity="warning" className="w-full p-3 text-xl" icon="pi pi-arrow-left" disabled={loading} onClick={goToLogin} />
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
