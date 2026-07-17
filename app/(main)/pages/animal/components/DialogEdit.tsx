import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { classNames } from 'primereact/utils';
import React, { useEffect, useRef, useState } from 'react';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import { z } from 'zod';
import { Toast } from 'primereact/toast';
import { FileUpload, FileUploadSelectEvent } from 'primereact/fileupload';
import { Message } from '@/app/components/Message';
import { Animal } from '@/app/api/models/animal';
import { animalService } from '@/app/api/services/animal/animal_service_impl';
import { Category } from '@/app/api/models/category';
import { categoryService } from '@/app/api/services/category/category_service_impl';
import { Dropdown } from 'primereact/dropdown';
import { InputTextarea } from 'primereact/inputtextarea';
import { convertDanger, DangerList, newAccident } from '@/app/api/models/accident';
import { useQuery } from '@tanstack/react-query';
import { QueryKey } from '@/app/lib/react-query';
import { Fieldset } from 'primereact/fieldset';
import ButtonController from './ButtonController';
import { TreatmentTypes } from '@/app/api/models/tratment';
import { uuid } from 'zod/v4/core/regexes';

interface DialogProps {
    visibleDialog: boolean;
    obj: Animal;
    onClose?: () => void;
}

const schema = z.object({
    name: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres.'),
    description: z.string().nonempty('Descrição não deve estar em branco.'),
    scientificName: z.string().min(3, 'Nome ciêntifico deve ter no mínimo 3 caracteres.'),
    category: z.object({
        id: z.number({ required_error: 'Categoria é obrigatória.' }),
        name: z.string().nonempty('Categoria é obrigatória.')
    }),
    accidents: z
        .array(
            z.object({
                id: z.number().optional(),
                danger: z.string().min(1, 'Perigo é obrigatório.'),
                symptoms: z.string().min(1, 'Sintomas são obrigatórios.'),
                laboratoryExams: z.string().optional()
            })
        )
        .optional()
});

type FormDialog = z.infer<typeof schema>;

export function DialogEdit({ visibleDialog, obj, onClose }: DialogProps) {
    const {
        register,
        handleSubmit,
        reset,
        control,
        formState: { errors, isSubmitted, isSubmitting }
    } = useForm<FormDialog>({
        resolver: zodResolver(schema),
        defaultValues: {
            name: obj.name ?? '',
            description: obj.description ?? '',
            scientificName: obj.scientificName ?? '',
            category: obj.category as any
        }
    });

    const [fileSelected, setFileSelected] = useState<File | null>(null);
    const [base64, setBase64] = useState<String>(obj.url ?? '');
    const [accidents, setAccidents] = useState(obj.accidents ?? []);

    const { data: categories } = useQuery<Category[]>({
        queryKey: [QueryKey.CATEGORY_FIND_ALL],
        queryFn: async () => {
            return await categoryService.findAll();
        },
        enabled: true
    });

    const toast = useRef<Toast>(null);

    useEffect(() => {
        reset({
            name: obj.name ?? '',
            description: obj.description ?? '',
            scientificName: obj.scientificName ?? '',
            category: obj.category as any
        });
        setAccidents(obj.accidents ?? []);
        setBase64(obj.url ?? '');
    }, [obj, reset]);

    async function handleOnCreate() {
        animalService
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

    function handleOnUpdate() {
        animalService
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

    function handleOnUpload() {
        animalService
            .upload({ id: obj.id!, file: fileSelected! })
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
        obj.description = data.description;
        obj.scientificName = data.scientificName;
        obj.category = {
            id: data.category.id,
            name: data.category.name,
            url: ''
        };
        obj.accidents = accidents;
        if (obj.id) {
            if (fileSelected) {
                handleOnUpload();
            }
            handleOnUpdate();
        } else {
            handleOnCreate();
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

    function updateAccident(index: number, patch: Partial<any>) {
        setAccidents((prev) => prev.map((a, i) => (i === index ? { ...a, ...patch } : a)));
        obj.accidents = accidents;
    }

    return (
        <>
            <Toast ref={toast} />
            <Dialog
                visible={visibleDialog}
                style={{ width: '80rem' }}
                header="Formulário de animais"
                modal
                className="p-fluid"
                footer={
                    <>
                        <Button label="Cancelar" icon="pi pi-times" onClick={handleCancel} className="p-button-text" />
                        <Button type="submit" label="Salvar" icon="pi pi-check" form="dialog-form" loading={isSubmitting} />
                    </>
                }
                onHide={handleCancel}
            >
                {obj.id != null && (
                    <div className="text-center">
                        {base64 !== '' && <img src={`${base64}`} alt="imagem-selecionada" width={400} height={400} className="img-fluid img-thumbnail" />}
                        <FileUpload mode="basic" name="demo[]" accept="image/*" maxFileSize={1000000} chooseLabel="Escolher uma imagem" onSelect={handleOnSelect} className="mb-5" />
                    </div>
                )}

                <form id="dialog-form" onSubmit={handleSubmit(handleSave)}>
                    <div className="grid p-fluid">
                        <div className="col-12 md:col-4">
                            <div className="field">
                                <label htmlFor="name">Nome</label>
                                <InputText id="name" placeholder="Digite o nome do animal" {...register('name')} className={classNames({ 'p-invalid': isSubmitted && errors.name })} autoFocus />
                                {errors.name && <small className="p-error">{errors.name.message}</small>}
                            </div>
                        </div>
                        <div className="col-12 md:col-4">
                            <div className="field">
                                <label htmlFor="scientificName">Nome ciêntifico</label>
                                <InputText id="scientificName" placeholder="Digite o nome do animal" {...register('scientificName')} className={classNames({ 'p-invalid': isSubmitted && errors.scientificName })} />
                                {errors.name && <small className="p-error">{errors.scientificName!.message}</small>}
                            </div>
                        </div>
                        <div className="col-12 md:col-4">
                            <div className="field">
                                <label htmlFor="category">Categoria</label>
                                <Controller
                                    name="category"
                                    control={control}
                                    render={({ field }) => (
                                        <Dropdown
                                            id="group"
                                            options={categories}
                                            placeholder="Selecione um grupo"
                                            optionLabel="name"
                                            filter
                                            value={field.value}
                                            onChange={(e) => field.onChange(e.value)}
                                            className={classNames({ 'p-invalid': isSubmitted && errors.category })}
                                        />
                                    )}
                                />
                                {errors.category && <small className="p-error">{errors.category!.message}</small>}
                            </div>
                        </div>
                        <div className="col-12">
                            <div className="field">
                                <label htmlFor="description">Descrição</label>
                                <InputTextarea placeholder="Digite a descrição do animal" {...register('description')} rows={3} className={classNames({ 'p-invalid': isSubmitted && errors.description })} />
                                {errors.description && <small className="p-error">{errors.description!.message}</small>}
                            </div>
                        </div>
                        <Fieldset legend="Acidentes" className="col-12">
                            {accidents.map((accident, index) => (
                                <div key={accident.id ?? index} className="grid p-fluid">
                                    {/* Perigo */}
                                    <div className="col-12">
                                        <div className="field">
                                            <label>Perigo</label>
                                            <Dropdown
                                                placeholder="Selecione o perigo"
                                                options={DangerList}
                                                optionLabel="description"
                                                optionValue="id"
                                                value={convertDanger(accident.danger)}
                                                onChange={(e) => updateAccident(index, { danger: `${e.value}` })}
                                            />
                                        </div>
                                    </div>

                                    {/* Sintomas */}
                                    <div className="col-12">
                                        <div className="field">
                                            <label>Sintomas</label>
                                            <InputTextarea placeholder="Digite a descrição dos sintomas" value={accident.symptoms ?? ''} onChange={(e) => updateAccident(index, { symptoms: e.target.value })} rows={4} />
                                        </div>
                                    </div>

                                    {/* Exames laboratoriais */}
                                    <div className="col-12">
                                        <div className="field">
                                            <label>Exames laboratoriais</label>
                                            <InputTextarea placeholder="Digite a descrição do exame laboratorial" value={accident.exams ?? ''} onChange={(e) => updateAccident(index, { exams: e.target.value })} rows={3} />
                                        </div>
                                    </div>

                                    <hr className="col-12" />
                                    <div className="col-12">
                                        <Fieldset legend="Tratamentos">
                                            {accident.treatments.map((treatment, tIndex) => {
                                                return (
                                                    <>
                                                        <div key={`${accident.id ?? index}-${tIndex}`} className="grid p-fluid">
                                                            <div className="col-12">
                                                                <div className="field">
                                                                    <label>Tipo de tratamento</label>
                                                                    <Dropdown
                                                                        placeholder="Selecione o tipo de tratamento"
                                                                        options={TreatmentTypes}
                                                                        optionLabel="description"
                                                                        optionValue="id"
                                                                        value={treatment.type}
                                                                        onChange={(e) => {
                                                                            const nextTreatments = (accident.treatments ?? []).map((t, i) => (i === tIndex ? { ...t, type: e.value } : t));
                                                                            updateAccident(index, { treatments: nextTreatments });
                                                                        }}
                                                                    />
                                                                </div>
                                                                <div className="col-12">
                                                                    <div className="field">
                                                                        <label>Descrição</label>
                                                                        <InputTextarea
                                                                            placeholder="Digite a descrição dos tratamentos"
                                                                            value={treatment.description}
                                                                            onChange={(e) => {
                                                                                const nextTreatments = (accident.treatments ?? []).map((t, i) => (i === tIndex ? { ...t, description: e.target.value } : t));
                                                                                updateAccident(index, { treatments: nextTreatments });
                                                                            }}
                                                                            rows={3}
                                                                        />
                                                                    </div>
                                                                </div>
                                                                <div className="col-12">
                                                                    <div className="field">
                                                                        <label>Observação</label>
                                                                        <InputTextarea
                                                                            placeholder="Digite uma observação (OPCIONAL)"
                                                                            value={treatment.obs}
                                                                            onChange={(e) => {
                                                                                const nextTreatments = (accident.treatments ?? []).map((t, i) => (i === tIndex ? { ...t, obs: e.target.value } : t));
                                                                                updateAccident(index, { treatments: nextTreatments });
                                                                            }}
                                                                            rows={3}
                                                                        />
                                                                    </div>
                                                                </div>
                                                                <hr className="col-12" />
                                                            </div>
                                                        </div>
                                                    </>
                                                );
                                            })}

                                            <ButtonController
                                                labelAdd="Adicionar Tratamento"
                                                labelRemove="Remover Tratamento"
                                                onAdd={() => {
                                                    accident.treatments.push({
                                                        description: '',
                                                        obs: '',
                                                        type: ''
                                                    });
                                                    updateAccident(index, accident);
                                                }}
                                                onRemove={() => {
                                                    accident.treatments.pop();
                                                    updateAccident(index, accident);
                                                }}
                                            ></ButtonController>
                                        </Fieldset>
                                    </div>
                                </div>
                            ))}
                            <hr />
                            <ButtonController
                                labelAdd="Adicionar Acidente"
                                labelRemove="Remover Acidente"
                                onAdd={() => {
                                    setAccidents((prev) => [...prev, newAccident]);
                                }}
                                onRemove={() => {
                                    setAccidents((prev) => prev.slice(0, -1));
                                }}
                            ></ButtonController>
                        </Fieldset>
                    </div>
                </form>
            </Dialog>
        </>
    );
}
