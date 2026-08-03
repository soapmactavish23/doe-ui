'use client';

import { useEffect, useRef } from 'react';

import { Controller, SubmitHandler, useForm } from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod';

import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import { classNames } from 'primereact/utils';

import { Message } from '@/app/components/Message';

import { Group } from '../../groups/domain/group';

import { User } from '../domain/user';

import { UserForm, userSchema } from './user.schema';

interface UserDialogProps {
    visible: boolean;
    user: User;
    groups: Group[];
    loading?: boolean;
    loadingGroups?: boolean;
    onSave: (user: User) => Promise<void>;
    onClose: () => void;
}

export default function UserDialog({ visible, user, groups, loading = false, loadingGroups = false, onSave, onClose }: UserDialogProps) {
    const toast = useRef<Toast>(null);

    const {
        register,
        handleSubmit,
        control,
        reset,
        formState: { errors, isSubmitted, isSubmitting }
    } = useForm<UserForm>({
        resolver: zodResolver(userSchema),

        defaultValues: {
            id: null,
            name: '',
            email: '',
            password: '',
            confirmPassword: '',
            group: {
                id: '',
                name: ''
            }
        }
    });

    useEffect(() => {
        if (!visible) {
            return;
        }

        reset({
            id: user.id,
            name: user.name ?? '',
            email: user.email ?? '',
            password: '',
            confirmPassword: '',

            group: {
                id: user.group?.id ?? '',
                name: user.group?.name ?? ''
            }
        });
    }, [visible, user, reset]);

    const handleCancel = () => {
        reset();
        onClose();
    };

    const handleSave: SubmitHandler<UserForm> = async (form) => {
        try {
            await onSave({
                id: user.id,
                name: form.name,
                email: form.email,

                password: user.id ? user.password : form.password ?? '',

                status: user.status ?? true,

                group: {
                    id: form.group.id,
                    name: form.group.name
                }
            });

            toast.current?.show({
                severity: 'success',
                summary: Message.successMsg,
                detail: Message.successSave
            });
        } catch (error) {
            console.error('Erro ao salvar usuário:', error);

            toast.current?.show({
                severity: 'error',
                summary: Message.errorMsg,
                detail: Message.errorSave
            });
        }
    };

    const footer = (
        <>
            <Button type="button" label="Cancelar" icon="pi pi-times" className="p-button-text" disabled={loading || isSubmitting} onClick={handleCancel} />

            <Button type="submit" label="Salvar" icon="pi pi-check" form="userForm" loading={loading || isSubmitting} />
        </>
    );

    return (
        <>
            <Toast ref={toast} />

            <Dialog
                visible={visible}
                style={{
                    width: '80rem'
                }}
                header="Formulário de Usuário"
                modal
                className="p-fluid"
                footer={footer}
                onHide={handleCancel}
            >
                <form id="userForm" onSubmit={handleSubmit(handleSave)}>
                    <div className="grid">
                        <div className="col-12 md:col-6 field">
                            <label htmlFor="name">Nome</label>

                            <InputText
                                id="name"
                                placeholder="Digite o nome do usuário"
                                autoFocus
                                {...register('name')}
                                className={classNames({
                                    'p-invalid': isSubmitted && errors.name
                                })}
                            />

                            {errors.name?.message && <small className="p-error">{errors.name.message}</small>}
                        </div>

                        <div className="col-12 md:col-6 field">
                            <label htmlFor="email">E-mail</label>

                            <InputText
                                id="email"
                                type="email"
                                placeholder="Digite o e-mail do usuário"
                                {...register('email')}
                                className={classNames({
                                    'p-invalid': isSubmitted && errors.email
                                })}
                            />

                            {errors.email?.message && <small className="p-error">{errors.email.message}</small>}
                        </div>

                        {!user.id && (
                            <>
                                <div className="col-12 md:col-6 field">
                                    <label htmlFor="password">Senha</label>

                                    <InputText
                                        id="password"
                                        type="password"
                                        placeholder="Digite a senha do usuário"
                                        {...register('password')}
                                        className={classNames({
                                            'p-invalid': isSubmitted && errors.password
                                        })}
                                    />

                                    {errors.password?.message && <small className="p-error">{errors.password.message}</small>}
                                </div>

                                <div className="col-12 md:col-6 field">
                                    <label htmlFor="confirmPassword">Confirmar Senha</label>

                                    <InputText
                                        id="confirmPassword"
                                        type="password"
                                        placeholder="Confirme a senha do usuário"
                                        {...register('confirmPassword')}
                                        className={classNames({
                                            'p-invalid': isSubmitted && errors.confirmPassword
                                        })}
                                    />

                                    {errors.confirmPassword?.message && <small className="p-error">{errors.confirmPassword.message}</small>}
                                </div>
                            </>
                        )}

                        <div className="col-12 field">
                            <label htmlFor="group">Grupo</label>

                            <Controller
                                name="group"
                                control={control}
                                render={({ field }) => (
                                    <Dropdown
                                        id="group"
                                        options={groups}
                                        placeholder="Selecione um grupo"
                                        optionLabel="name"
                                        filter
                                        loading={loadingGroups}
                                        value={field.value}
                                        onChange={(event) => {
                                            field.onChange(event.value);
                                        }}
                                        className={classNames({
                                            'p-invalid': isSubmitted && errors.group
                                        })}
                                    />
                                )}
                            />

                            {(errors.group?.id?.message || errors.group?.name?.message) && <small className="p-error">{errors.group?.id?.message ?? errors.group?.name?.message}</small>}
                        </div>
                    </div>
                </form>
            </Dialog>
        </>
    );
}
