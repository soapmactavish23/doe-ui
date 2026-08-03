'use client';

import { useRef } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { SubmitHandler, useForm } from 'react-hook-form';

import { Button } from 'primereact/button';
import { Fieldset } from 'primereact/fieldset';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import { classNames } from 'primereact/utils';

import { Message } from '@/app/components/Message';

import { usePassword } from '../application/usePassword';

import { PasswordForm, passwordSchema } from './password.schema';

interface CardPasswordProps {
    userId: string;
}

export default function CardPassword({ userId }: CardPasswordProps) {
    const toast = useRef<Toast>(null);

    const { saving, changePassword } = usePassword();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitted, isSubmitting }
    } = useForm<PasswordForm>({
        resolver: zodResolver(passwordSchema),
        defaultValues: {
            password: '',
            newPassword: '',
            confirmPassword: ''
        }
    });

    const onSubmit: SubmitHandler<PasswordForm> = async (data) => {
        if (!userId) {
            toast.current?.show({
                severity: 'error',
                summary: Message.errorMsg,
                detail: Message.expiredSession
            });

            return;
        }

        try {
            await changePassword({
                code: userId,
                password: data.password,
                newPassword: data.newPassword,
                confirmPassword: data.confirmPassword
            });

            reset();

            toast.current?.show({
                severity: 'success',
                summary: Message.successMsg,
                detail: Message.successSave
            });
        } catch (error) {
            console.error('Erro ao alterar senha:', error);

            toast.current?.show({
                severity: 'error',
                summary: Message.errorMsg,
                detail: Message.errorSave
            });
        }
    };

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

                                <InputText
                                    type="password"
                                    placeholder="Digite a senha atual"
                                    maxLength={150}
                                    {...register('password')}
                                    className={classNames({
                                        'p-invalid': isSubmitted && errors.password
                                    })}
                                />
                            </span>

                            {errors.password?.message && <small className="p-error block mt-1">{errors.password.message}</small>}
                        </div>

                        <div className="col-12 md:col-4">
                            <h5>Nova Senha</h5>

                            <span className="p-input-icon-left">
                                <i className="pi pi-lock" />

                                <InputText
                                    type="password"
                                    placeholder="Digite a nova senha"
                                    maxLength={150}
                                    {...register('newPassword')}
                                    className={classNames({
                                        'p-invalid': isSubmitted && errors.newPassword
                                    })}
                                />
                            </span>

                            {errors.newPassword?.message && <small className="p-error block mt-1">{errors.newPassword.message}</small>}
                        </div>

                        <div className="col-12 md:col-4">
                            <h5>Confirme a senha</h5>

                            <span className="p-input-icon-left">
                                <i className="pi pi-lock" />

                                <InputText
                                    type="password"
                                    placeholder="Confirmar senha"
                                    maxLength={150}
                                    {...register('confirmPassword')}
                                    className={classNames({
                                        'p-invalid': isSubmitted && errors.confirmPassword
                                    })}
                                />
                            </span>

                            {errors.confirmPassword?.message && <small className="p-error block mt-1">{errors.confirmPassword.message}</small>}
                        </div>
                    </div>

                    <hr />

                    <Button severity="success" label="Salvar" icon="pi pi-save" type="submit" loading={isSubmitting || saving} />
                </form>
            </Fieldset>
        </>
    );
}
