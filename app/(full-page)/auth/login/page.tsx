/* eslint-disable @next/next/no-img-element */
'use client';

import { useRouter } from 'next/navigation';
import React, { useContext, useRef, useState } from 'react';

import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import { classNames } from 'primereact/utils';

import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { LayoutContext } from '../../../../layout/context/layoutcontext';
import { userService } from '@/app/(main)/pages/users/services/user_service_impl';
import LoadingContent from '@/layout/LoadingContent/LoadingContent';

import imgLogo from '@/public/logo.png';

const formLogin = z.object({
    email: z.string().min(1, 'E-mail obrigatório').email('E-mail inválido'),

    password: z.string().min(1, 'Senha obrigatória')
});

type FormLogin = z.infer<typeof formLogin>;

const LoginPage = () => {
    const { layoutConfig } = useContext(LayoutContext);

    const router = useRouter();
    const toast = useRef<Toast>(null);

    const [isNavigating, setIsNavigating] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting }
    } = useForm<FormLogin>({
        resolver: zodResolver(formLogin),
        defaultValues: {
            email: '',
            password: ''
        }
    });

    const loading = isSubmitting || isNavigating;

    const containerClassName = classNames('surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden', {
        'p-input-filled': layoutConfig.inputStyle === 'filled'
    });

    const goTo = (path: string) => {
        if (loading) {
            return;
        }

        setIsNavigating(true);
        router.push(path);
    };

    const onSubmit = async (data: FormLogin) => {
        try {
            setIsNavigating(true);

            const response = await userService.login({
                email: data.email,
                password: data.password
            });

            localStorage.setItem('access_token', response.access_token);

            localStorage.setItem('refresh_token', response.refresh_token);

            router.replace('/');
        } catch (err) {
            console.error('Erro ao realizar login:', err);

            setIsNavigating(false);

            toast.current?.show({
                severity: 'error',
                summary: 'Acesso negado',
                detail: 'Usuário ou senha incorretos!',
                life: 4000
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

                                <span className="text-600 font-medium">Entre para continuar</span>
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

                                <label htmlFor="password" className="block text-900 font-medium text-xl mb-2">
                                    Senha
                                </label>

                                <InputText
                                    id="password"
                                    type="password"
                                    placeholder="Digite sua senha"
                                    className={classNames('w-full md:w-30rem text-xl', {
                                        'p-invalid': errors.password
                                    })}
                                    style={{
                                        padding: '1rem'
                                    }}
                                    disabled={loading}
                                    aria-invalid={errors.password ? 'true' : 'false'}
                                    {...register('password')}
                                />

                                <div className="h-2rem mt-1 mb-2">{errors.password && <small className="p-error">{errors.password.message}</small>}</div>

                                <div className="flex align-items-center justify-content-end mb-5">
                                    <button
                                        type="button"
                                        className="font-medium border-none bg-transparent cursor-pointer p-0"
                                        style={{
                                            color: 'var(--primary-color)'
                                        }}
                                        disabled={loading}
                                        onClick={() => goTo('/auth/recovery-password')}
                                    >
                                        Recuperar senha?
                                    </button>
                                </div>

                                <Button label="Entrar" icon="pi pi-sign-in" type="submit" severity="warning" className="w-full p-3 text-xl mb-3" loading={loading} disabled={loading} />
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default LoginPage;
