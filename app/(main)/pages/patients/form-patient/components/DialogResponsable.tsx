import { Dialog } from 'primereact/dialog';
import { Responsable } from '../../types/responsable/responsable';
import { Button } from 'primereact/button';
import z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { Fieldset } from 'primereact/fieldset';
import { InputText } from 'primereact/inputtext';
import { responsableSchema } from '../../types/responsable/responsable_schema';

interface DialogProps {
    visibleDialog: boolean;
    obj: Responsable;
    onClose?: () => void;
}

type FormDialog = z.infer<typeof responsableSchema>;

export default function DialogResponsable({ visibleDialog, obj, onClose }: DialogProps) {
    const {
        register,
        handleSubmit,
        setValue,
        control,
        reset,
        formState: { errors, isSubmitted, isSubmitting }
    } = useForm<FormDialog>({
        //TypeError: Cannot use 'in' operator to search for '_def' in undefined
        resolver: zodResolver(responsableSchema),
        defaultValues: { name: obj.name }
    });

    const [isSending, setIsSending] = useState<boolean>(false);

    const handleCancel = () => {
        reset();
        if (onClose) onClose();
    };

    const handleSave = (data: FormDialog) => {
        console.log(data);
    };

    const footer = (
        <>
            <Button label="Cancelar" icon="pi pi-times" onClick={handleCancel} className="p-button-text" />
            <Button type="submit" label="Salvar" icon="pi pi-check" form="groupForm" loading={isSubmitting || isSending} />
        </>
    );

    return (
        <form id="form-responsable" onSubmit={handleSubmit(handleSave)}>
            <Dialog visible={visibleDialog} style={{ width: '80rem' }} header="Formulário de Responsáveis" modal className="p-fluid" footer={footer} onHide={handleCancel}>
                <Fieldset legend="Dados Pessoais" className="mb-4">
                    <div className="grid">
                        <div className="col-12 md:col-4">
                            <label htmlFor="name">Nome</label>
                            <InputText placeholder="Digite o seu nome" id="name" {...register('name')} />
                        </div>
                    </div>
                </Fieldset>
                <Fieldset legend="Endereço"></Fieldset>
            </Dialog>
        </form>
    );
}
