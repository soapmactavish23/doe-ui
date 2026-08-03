'use client';

import { useEffect, useRef } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { SubmitHandler, useForm } from 'react-hook-form';

import { Button } from 'primereact/button';
import { Fieldset } from 'primereact/fieldset';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import { classNames } from 'primereact/utils';

import { Message } from '@/app/components/Message';

import { Profile } from '../domain/profile';
import { ProfileForm, profileSchema } from './profile.schema';

interface CardProfileProps {
    profile: Profile;
    loading?: boolean;
    saving?: boolean;
    onSave: (profile: Profile) => Promise<Profile>;
}

export function CardProfile({ profile, loading = false, saving = false, onSave }: CardProfileProps) {
    const toast = useRef<Toast>(null);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitted, isSubmitting }
    } = useForm<ProfileForm>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            name: ''
        }
    });

    useEffect(() => {
        reset({
            name: profile.name ?? ''
        });
    }, [profile, reset]);

    const onSubmit: SubmitHandler<ProfileForm> = async (data) => {
        if (!profile.id) {
            toast.current?.show({
                severity: 'error',
                summary: Message.errorMsg,
                detail: Message.expiredSession
            });

            return;
        }

        try {
            await onSave({
                id: profile.id,
                name: data.name
            });

            toast.current?.show({
                severity: 'success',
                summary: Message.successMsg,
                detail: Message.successSave
            });
        } catch (error) {
            console.error('Erro ao atualizar perfil:', error);

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

            <Fieldset legend="Editar Perfil">
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="p-fluid">
                        <h5>Nome</h5>

                        <span className="p-input-icon-left">
                            <i className="pi pi-user" />

                            <InputText
                                type="text"
                                placeholder="Digite o nome do usuário"
                                maxLength={50}
                                disabled={loading}
                                {...register('name')}
                                className={classNames({
                                    'p-invalid': isSubmitted && errors.name
                                })}
                            />
                        </span>

                        {errors.name?.message && <small className="p-error block mt-1">{errors.name.message}</small>}
                    </div>

                    <hr />

                    <Button severity="success" label="Salvar" icon="pi pi-save" type="submit" loading={isSubmitting || saving} disabled={loading} />
                </form>
            </Fieldset>
        </>
    );
}
