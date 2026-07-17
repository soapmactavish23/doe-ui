import { Category, newCategory } from '@/app/api/models/category';
import { categoryService } from '@/app/api/services/category/category_service_impl';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { classNames } from 'primereact/utils';
import React, { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Toast } from 'primereact/toast';
import { FileUpload, FileUploadSelectEvent } from 'primereact/fileupload';
import { Message } from '@/app/components/Message';
interface DialogProps {
    visibleDialog: boolean;
    obj: Category;
    onClose?: () => void;
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
        resolver: zodResolver(schema)
    });

    const [fileSelected, setFileSelected] = useState<File | null>(null);
    const [base64, setBase64] = useState<String>(obj.url ?? '');

    useEffect(() => {
        setValue('name', obj.name);
    }, [obj, setValue]);

    const toast = useRef<Toast>(null);

    async function onCreate() {
        categoryService
            .create(obj)
            .then(() => {
                toast.current?.show({
                    severity: 'success',
                    summary: Message.successMsg,
                    detail: Message.successSave
                });
                handleCancel();
            })
            .catch((err) => {
                console.error(err);
                toast.current?.show({
                    severity: 'error',
                    summary: Message.errorMsg,
                    detail: Message.errorSave
                });
            });
    }

    function onUpdate() {
        categoryService
            .update(obj)
            .then(() => {
                toast.current!.show({
                    severity: 'success',
                    summary: Message.successMsg,
                    detail: Message.successSave
                });
                handleCancel();
            })
            .catch((err) => {
                console.error(err);
                toast.current?.show({
                    severity: 'error',
                    summary: Message.errorMsg,
                    detail: Message.errorSave
                });
            });
    }

    function onUpload() {
        categoryService
            .upload(obj.id!, fileSelected!)
            .then(() => {
                toast.current!.show({
                    severity: 'success',
                    summary: Message.successMsg,
                    detail: Message.successUpload
                });
            })
            .catch((err) => {
                console.error(err);
                toast.current?.show({
                    severity: 'error',
                    summary: Message.errorMsg,
                    detail: Message.errorUpload
                });
            });
    }

    const handleSave = (data: FormDialog) => {
        obj.name = data.name;
        if (obj.id) {
            if (fileSelected) {
                onUpload();
            }
            onUpdate();
        } else {
            onCreate();
        }
    };

    const handleCancel = () => {
        reset();
        setFileSelected(null);
        setBase64(obj.url ?? '');
        if (onClose) onClose();
    };

    const handleOnSelect = (e: FileUploadSelectEvent) => {
        if (e.files[0] != null) {
            setFileSelected(e.files[0]);

            const fileReader = new FileReader();

            fileReader.onload = () => {
                setBase64(`${fileReader.result}`);
            };

            fileReader.readAsDataURL(e.files[0]);
        }
    };

    const footer = (
        <>
            <Button label="Cancelar" icon="pi pi-times" onClick={handleCancel} className="p-button-text" />
            <Button type="submit" label="Salvar" icon="pi pi-check" form="dialog-form" loading={isSubmitting} />
        </>
    );

    return (
        <>
            <Toast ref={toast} />
            <Dialog visible={visibleDialog} style={{ width: '40rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Formulário de categoria" modal className="p-fluid" footer={footer} onHide={handleCancel}>
                {obj.id != null && (
                    <div className="text-center">
                        {base64 !== '' && <img src={`${base64}`} alt="imagem-selecionada" width={400} height={400} className="img-fluid img-thumbnail" />}
                        <FileUpload mode="basic" name="demo[]" accept="image/*" maxFileSize={1000000} chooseLabel="Escolher uma imagem" onSelect={handleOnSelect} />
                    </div>
                )}

                <form id="dialog-form" onSubmit={handleSubmit(handleSave)}>
                    <div className="field">
                        <label htmlFor="name">Nome</label>
                        <InputText id="name" placeholder="Digite o nome da categoria" {...register('name')} className={classNames({ 'p-invalid': isSubmitted && errors.name })} autoFocus />
                        {errors.name && <small className="p-error">{errors.name.message}</small>}
                    </div>
                </form>
            </Dialog>
        </>
    );
}
