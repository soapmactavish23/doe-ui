/* eslint-disable @next/next/no-img-element */
'use client';

import { useRouter } from 'next/navigation';
import React, { useContext, useRef, useState } from 'react';
import { Button } from 'primereact/button';
import { LayoutContext } from '../../../../layout/context/layoutcontext';
import { InputText } from 'primereact/inputtext';
import { classNames } from 'primereact/utils';
import { Toast } from 'primereact/toast';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { userService } from '@/app/api/services/user/user_service_impl';
import LoadingContent from '@/layout/LoadingContent';

const formLogin = z.object({
    email: z.string().email('Email inválido'),
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
        formState: { isSubmitting }
    } = useForm<FormLogin>({
        resolver: zodResolver(formLogin)
    });

    const containerClassName = classNames('surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden', {
        'p-input-filled': layoutConfig.inputStyle === 'filled'
    });

    const goTo = (path: string) => {
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
            router.push('/');
        } catch (err) {
            setIsNavigating(false);
            console.error('Erro:', err);

            toast.current?.show({
                severity: 'error',
                summary: 'Acesso negado',
                detail: 'Usuário ou senha incorretos!'
            });
        }
    };

    return (
        <>
            <Toast ref={toast} />

            {isNavigating && <LoadingContent />}

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
                                <div className="text-900 text-3xl font-medium mb-3">DOE</div>
                                <span className="text-600 font-medium">Logue para continuar</span>
                            </div>

                            <form onSubmit={handleSubmit(onSubmit)}>
                                <label htmlFor="email1" className="block text-900 text-xl font-medium mb-2">
                                    Email
                                </label>
                                <InputText id="email1" type="email" placeholder="Digite seu e-mail" className="w-full md:w-30rem mb-5 text-xl" style={{ padding: '1rem' }} disabled={isSubmitting || isNavigating} {...register('email')} />

                                <label htmlFor="password1" className="block text-900 font-medium text-xl mb-2">
                                    Senha
                                </label>
                                <InputText id="password1" type="password" placeholder="Digite sua senha" className="w-full md:w-30rem mb-5 text-xl" style={{ padding: '1rem' }} disabled={isSubmitting || isNavigating} {...register('password')} />

                                <div className="flex align-items-center justify-content-between mb-5 gap-5">
                                    <a className="font-medium no-underline ml-2 text-right cursor-pointer" style={{ color: 'var(--primary-color)' }} onClick={() => goTo('/auth/recovery-password')}>
                                        Recuperar senha?
                                    </a>
                                </div>

                                <Button label="Entrar" loading={isSubmitting || isNavigating} type="submit" severity="warning" className="w-full p-3 text-xl mb-3" disabled={isSubmitting || isNavigating} />
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default LoginPage;
