'use client';

import { useEffect } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { SubmitHandler, useForm } from 'react-hook-form';

import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { classNames } from 'primereact/utils';

import { Group } from '../domain/group';
import { GroupForm, groupSchema } from './group.schema';

interface GroupDialogProps {
    visible: boolean;
    group: Group;
    loading?: boolean;
    onSave: (group: Group) => Promise<void>;
    onClose: () => void;
}

export default function GroupDialog({ visible, group, loading = false, onSave, onClose }: GroupDialogProps) {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitted }
    } = useForm<GroupForm>({
        resolver: zodResolver(groupSchema),
        defaultValues: {
            name: ''
        }
    });

    useEffect(() => {
        if (!visible) {
            return;
        }

        reset({
            name: group.name ?? ''
        });
    }, [visible, group, reset]);

    const handleClose = () => {
        reset({
            name: ''
        });

        onClose();
    };

    const handleSave: SubmitHandler<GroupForm> = async (form) => {
        await onSave({
            id: group.id,
            name: form.name
        });
    };

    const footer = (
        <div className="flex justify-content-end gap-2">
            <Button type="button" label="Cancelar" icon="pi pi-times" severity="secondary" outlined disabled={loading} onClick={handleClose} />

            <Button type="submit" label={group.id ? 'Atualizar' : 'Salvar'} icon="pi pi-check" form="group-form" loading={loading} />
        </div>
    );

    return (
        <Dialog
            visible={visible}
            header={group.id ? 'Editar Grupo' : 'Cadastrar Grupo'}
            modal
            draggable={false}
            dismissableMask={false}
            className="p-fluid"
            style={{
                width: '32rem',
                maxWidth: '95vw'
            }}
            footer={footer}
            onHide={handleClose}
        >
            <form id="group-form" onSubmit={handleSubmit(handleSave)}>
                <div className="field">
                    <label htmlFor="name">Nome</label>

                    <InputText
                        id="name"
                        placeholder="Digite o nome do grupo"
                        autoFocus
                        {...register('name')}
                        className={classNames({
                            'p-invalid': isSubmitted && errors.name
                        })}
                    />

                    {errors.name?.message && <small className="p-error">{errors.name.message}</small>}
                </div>
            </form>
        </Dialog>
    );
}
