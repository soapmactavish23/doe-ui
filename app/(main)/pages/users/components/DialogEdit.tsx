import { Group } from '@/app/(main)/pages/groups/types/group';
import { User } from '@/app/(main)/pages/users/types/user';
import { groupService } from '@/app/(main)/pages/groups/services/group_service_impl';
import { userService } from '@/app/(main)/pages/users/services/user_service_impl';
import { QueryKey } from '@/app/lib/react-query';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery } from '@tanstack/react-query';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import { classNames } from 'primereact/utils';
import React, { useEffect, useRef, useState } from 'react';
import { z } from 'zod';
import { Controller, useForm } from 'react-hook-form';

interface DialogProps {
    visibleDialog: boolean;
    obj: User;
    onClose?: () => void;
    onSave?: (data: User) => void;
}

const createSchema = z
    .object({
        name: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
        password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
        confirmPassword: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
        email: z.string().email('E-mail inválido'),
        group: z.object({
            id: z.number({ required_error: 'Grupo é obrigatório.' }),
            name: z.string().nonempty('Grupo é obrigatório.')
        })
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: 'As senhas não coincidem',
        path: ['confirmPassword']
    });

const editSchema = z.object({
    name: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
    email: z.string().email('E-mail inválido'),
    group: z.object({
        id: z.number({ required_error: 'Grupo é obrigatório.' }),
        name: z.string().nonempty('Grupo é obrigatório.')
    })
});

type CreateFormDialog = z.infer<typeof createSchema>;
type EditFormDialog = z.infer<typeof editSchema>;

export function DialogEdit({ visibleDialog, obj, onClose }: DialogProps) {
    const {
        register,
        handleSubmit,
        setValue,
        control,
        reset,
        formState: { errors, isSubmitted, isSubmitting }
    } = useForm<CreateFormDialog | EditFormDialog>({
        resolver: zodResolver(obj.id ? editSchema : createSchema),
        defaultValues: { name: obj.name }
    });

    const [isSending, setIsSending] = useState<boolean>(false);

    useEffect(() => {
        setValue('name', obj.name);
        setValue('email', obj.email);
        setValue('group.id', obj.group.id!);
        setValue('group.name', obj.group.name);
    }, [obj, setValue]);

    const toast = useRef<Toast>(null);

    async function onCreate() {
        setIsSending(true);
        userService.create!(obj)
            .then(() => {
                setIsSending(false);
                toast.current?.show({
                    severity: 'success',
                    summary: 'Sucesso!',
                    detail: 'Registro salvo com sucesso.'
                });
                handleCancel();
            })
            .catch((err) => {
                setIsSending(false);
                console.error(err);
                toast.current?.show({
                    severity: 'error',
                    summary: 'Erro!',
                    detail: 'Erro ao salvar o registro.'
                });
            });
    }

    function onUpdate() {
        setIsSending(true);
        userService.update!(obj)
            .then(() => {
                setIsSending(false);
                toast.current!.show({
                    severity: 'success',
                    summary: 'Sucesso!',
                    detail: 'Registro salvo com sucesso.'
                });
                handleCancel();
            })
            .catch((err) => {
                setIsSending(false);
                console.error(err);
                toast.current?.show({
                    severity: 'error',
                    summary: 'Erro!',
                    detail: 'Erro ao salvar o registro.'
                });
            });
    }

    const handleSave = (data: CreateFormDialog | EditFormDialog) => {
        obj.name = data.name;
        obj.email = data.email;
        obj.group = data.group;

        if (!obj.id && 'password' in data) {
            obj.password = data.password;
        }

        if (obj.id) {
            onUpdate();
        } else {
            onCreate();
        }
    };

    const handleCancel = () => {
        reset();
        if (onClose) onClose();
    };

    const { data: groups } = useQuery<Group[]>({
        queryKey: [QueryKey.GROUP_FIND_ALL],
        queryFn: async () => {
            return await groupService.findAll();
        }
    });

    const footer = (
        <>
            <Button label="Cancelar" icon="pi pi-times" onClick={handleCancel} className="p-button-text" />
            <Button type="submit" label="Salvar" icon="pi pi-check" form="groupForm" loading={isSubmitting || isSending} />
        </>
    );

    return (
        <>
            <Toast ref={toast} />
            <Dialog visible={visibleDialog} style={{ width: '80rem' }} header="Formulário de Usuário" modal className="p-fluid" footer={footer} onHide={handleCancel}>
                <form id="groupForm" onSubmit={handleSubmit(handleSave)}>
                    <div className="grid">
                        <div className="col-12 md:col-6 field">
                            <label htmlFor="name">Nome</label>
                            <InputText id="name" placeholder="Digite o nome do usuário" {...register('name')} className={classNames({ 'p-invalid': isSubmitted && errors.name })} autoFocus />
                            {errors.name && <small className="p-error">{errors.name.message}</small>}
                        </div>
                        <div className="col-12 md:col-6 field">
                            <label htmlFor="email">E-mail</label>
                            <InputText id="email" type="email" placeholder="Digite o e-mail do usuário" {...register('email')} className={classNames({ 'p-invalid': isSubmitted && errors.email })} />
                            {errors.email && <small className="p-error">{errors.email.message}</small>}
                        </div>

                        {obj.id === null && (
                            <>
                                <div className="col-12 md:col-6 field">
                                    <label htmlFor="password">Senha</label>
                                    <InputText
                                        id="password"
                                        type="password"
                                        placeholder="Digite a senha do usuário"
                                        {...register('password' as const)}
                                        className={classNames({
                                            'p-invalid': isSubmitted && 'password' in errors
                                        })}
                                    />
                                    {'password' in errors && errors.password && <small className="p-error">{errors.password.message}</small>}
                                </div>

                                <div className="col-12 md:col-6 field">
                                    <label htmlFor="confirm-password">Confirmar Senha</label>
                                    <InputText
                                        id="confirm-password"
                                        type="password"
                                        placeholder="Confirme a senha do usuário"
                                        {...register('confirmPassword' as const)}
                                        className={classNames({
                                            'p-invalid': isSubmitted && 'confirmPassword' in errors
                                        })}
                                    />
                                    {'confirmPassword' in errors && errors.confirmPassword && <small className="p-error">{errors.confirmPassword.message}</small>}
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
                                        value={field.value}
                                        onChange={(e) => field.onChange(e.value)}
                                        className={classNames({ 'p-invalid': isSubmitted && errors.group })}
                                    />
                                )}
                            />
                            {errors.group && <small className="p-error">{errors.group.message}</small>}
                        </div>
                    </div>
                </form>
            </Dialog>
        </>
    );
}
