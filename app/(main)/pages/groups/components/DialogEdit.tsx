import { Group, newGroup } from '@/app/(main)/pages/groups/types/group';
import { groupService } from '@/app/(main)/pages/groups/services/group_service_impl';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import { classNames } from 'primereact/utils';
import React, { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

interface DialogProps {
    visibleDialog: boolean;
    obj: Group;
    onClose?: () => void;
    onSave?: (data: Group) => void;
}

const schema = z.object({
    name: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres')
});

type FormDialog = z.infer<typeof schema>;

export function DialogEdit({ visibleDialog, obj, onClose }: DialogProps) {
    const {
        register,
        handleSubmit,
        setValue,
        reset,
        formState: { errors, isSubmitted, isSubmitting }
    } = useForm<FormDialog>({
        resolver: zodResolver(schema),
        defaultValues: { name: obj.name }
    });

    const [isSending, setIsSending] = useState<boolean>(false);

    useEffect(() => {
        setValue('name', obj.name);
    }, [obj, setValue]);

    const toast = useRef<Toast>(null);

    async function onCreate() {
        groupService
            .create(obj)
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
        groupService
            .update(obj)
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

    const handleSave = (data: FormDialog) => {
        obj.name = data.name;
        setIsSending(true);
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

    const footer = (
        <>
            <Button label="Cancelar" icon="pi pi-times" onClick={handleCancel} className="p-button-text" />
            <Button type="submit" label="Salvar" icon="pi pi-check" form="groupForm" loading={isSubmitting || isSending} />
        </>
    );

    return (
        <>
            <Toast ref={toast} />
            <Dialog visible={visibleDialog} style={{ width: '40rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Formulário de Grupo" modal className="p-fluid" footer={footer} onHide={handleCancel}>
                <form id="groupForm" onSubmit={handleSubmit(handleSave)}>
                    <div className="field">
                        <label htmlFor="name">Nome</label>
                        <InputText id="name" placeholder="Digite o nome do grupo" {...register('name')} className={classNames({ 'p-invalid': isSubmitted && errors.name })} autoFocus />
                        {errors.name && <small className="p-error">{errors.name.message}</small>}
                    </div>
                </form>
            </Dialog>
        </>
    );
}
