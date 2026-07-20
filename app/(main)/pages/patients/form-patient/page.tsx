/* eslint-disable @next/next/no-img-element */
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery } from '@tanstack/react-query';
import { useParams, useRouter } from 'next/navigation';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { Fieldset } from 'primereact/fieldset';
import { InputText } from 'primereact/inputtext';
import { classNames } from 'primereact/utils';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { ChangeEvent, useEffect, useRef, useState } from 'react';
import z from 'zod';

import imgUser from '@/public/user.png';
import { QueryKey } from '@/app/lib/react-query';

import DataTableResponsables from './components/DataTableResponsables';
import { PatientRequest, PatientResponseDetail, patientRequestSchema } from '../types/patient';
import { patientService } from '../services/patient_service_impl';
import { Responsable } from '../types/responsable';

type FormPatientData = z.infer<typeof patientRequestSchema>;

export default function FormPatient() {
    const router = useRouter();
    const params = useParams();

    const fileInputRef = useRef<HTMLInputElement>(null);

    const idParam = params?.id;

    const patientId = Array.isArray(idParam) ? idParam[0] : idParam;

    const [image, setImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [responsables, setResponsables] = useState<Responsable[]>([]);

    const {
        register,
        handleSubmit,
        control,
        reset,
        setValue,
        formState: { errors, isSubmitted, isSubmitting }
    } = useForm<FormPatientData>({
        resolver: zodResolver(patientRequestSchema),
        defaultValues: {
            name: '',
            birthDate: null,
            sex: undefined,
            cause: '',
            startTreatment: null,
            responsables: []
        }
    });

    const {
        data: patient,
        isLoading,
        isError
    } = useQuery<PatientResponseDetail>({
        queryKey: [QueryKey.PATIENT_FIND_BY_ID, patientId],

        queryFn: async () => {
            if (!patientId) {
                throw new Error('ID do paciente não informado');
            }

            return patientService.findById(patientId);
        },

        enabled: Boolean(patientId)
    });

    useEffect(() => {
        if (!patient) {
            return;
        }

        const loadedResponsables = patient.responsables ?? [];

        setResponsables(loadedResponsables);
        setImagePreview(patient.url);

        reset({
            name: patient.name,
            birthDate: parseDate(patient.birthDate),
            sex: patient.sex,
            cause: patient.cause,
            startTreatment: parseDate(patient.startTreatment),
            responsables: loadedResponsables
        });
    }, [patient, reset]);

    useEffect(() => {
        setValue('responsables', responsables, {
            shouldDirty: responsables.length > 0,
            shouldValidate: isSubmitted
        });
    }, [responsables, setValue, isSubmitted]);

    useEffect(() => {
        return () => {
            if (imagePreview?.startsWith('blob:')) {
                URL.revokeObjectURL(imagePreview);
            }
        };
    }, [imagePreview]);

    const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
        const selectedImage = event.target.files?.[0];

        if (!selectedImage) {
            return;
        }

        if (imagePreview?.startsWith('blob:')) {
            URL.revokeObjectURL(imagePreview);
        }

        setImage(selectedImage);
        setImagePreview(URL.createObjectURL(selectedImage));
    };

    const onSubmit: SubmitHandler<FormPatientData> = async (form) => {
        const request: PatientRequest = {
            id: patientId ?? null,
            name: form.name,
            birthDate: form.birthDate,
            sex: form.sex,
            cause: form.cause,
            startTreatment: form.startTreatment,
            responsables: form.responsables
        };

        if (patientId) {
            await patientService.update(request, image);
        } else {
            await patientService.create(request, image);
        }

        router.push('/pages/patients');
    };

    const handleCancel = () => {
        router.push('/pages/patients');
    };

    if (isLoading) {
        return (
            <div className="card flex justify-content-center align-items-center">
                <i className="pi pi-spin pi-spinner text-4xl" />
            </div>
        );
    }

    if (isError) {
        return (
            <div className="card">
                <small className="p-error">Não foi possível carregar o paciente.</small>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit(() => {})}>
            <div className="card">
                <Fieldset legend={patientId ? 'Editar Paciente' : 'Cadastrar Paciente'}>
                    <div className="flex flex-column align-items-center justify-content-center gap-3 mb-4">
                        <img
                            src={imagePreview || imgUser.src}
                            className="img-fluid border-circle"
                            alt="Imagem do paciente"
                            width={100}
                            height={100}
                            style={{
                                width: '100px',
                                height: '100px',
                                objectFit: 'cover'
                            }}
                        />

                        <input ref={fileInputRef} id="patient-image" type="file" accept="image/png,image/jpeg,image/jpg,image/webp" hidden onChange={handleImageChange} />

                        <Button
                            type="button"
                            label="Enviar foto"
                            icon="pi pi-upload"
                            outlined
                            onClick={() => {
                                fileInputRef.current?.click();
                            }}
                        />
                    </div>

                    <div className="grid p-fluid">
                        <div className="col-12 md:col-4 field">
                            <label htmlFor="name">Nome</label>

                            <InputText
                                id="name"
                                placeholder="Digite o nome do paciente"
                                {...register('name')}
                                className={classNames({
                                    'p-invalid': isSubmitted && errors.name
                                })}
                            />

                            {errors.name?.message && <small className="p-error">{errors.name.message}</small>}
                        </div>

                        <div className="col-12 md:col-4 field">
                            <label htmlFor="birthDate">Data de Nascimento</label>

                            <InputText
                                id="birthDate"
                                type="date"
                                {...register('birthDate', {
                                    valueAsDate: true
                                })}
                                className={classNames({
                                    'p-invalid': isSubmitted && errors.birthDate
                                })}
                            />

                            {errors.birthDate?.message && <small className="p-error">{errors.birthDate.message}</small>}
                        </div>

                        <div className="col-12 md:col-4 field">
                            <label htmlFor="sex">Sexo</label>

                            <Controller
                                name="sex"
                                control={control}
                                render={({ field }) => (
                                    <Dropdown
                                        id={field.name}
                                        name={field.name}
                                        value={field.value}
                                        onChange={(event) => {
                                            field.onChange(event.value);
                                        }}
                                        onBlur={field.onBlur}
                                        options={[
                                            {
                                                key: 'MALE',
                                                value: 'Masculino'
                                            },
                                            {
                                                key: 'FEMALE',
                                                value: 'Feminino'
                                            }
                                        ]}
                                        optionLabel="value"
                                        optionValue="key"
                                        placeholder="Selecione o sexo"
                                        className={classNames({
                                            'p-invalid': isSubmitted && errors.sex
                                        })}
                                    />
                                )}
                            />

                            {errors.sex?.message && <small className="p-error">{errors.sex.message}</small>}
                        </div>

                        <div className="col-12 md:col-4 field">
                            <label htmlFor="startTreatment">Início do Tratamento</label>

                            <InputText
                                id="startTreatment"
                                type="date"
                                {...register('startTreatment', {
                                    valueAsDate: true
                                })}
                                className={classNames({
                                    'p-invalid': isSubmitted && errors.startTreatment
                                })}
                            />

                            {errors.startTreatment?.message && <small className="p-error">{errors.startTreatment.message}</small>}
                        </div>

                        <div className="col-12 md:col-8 field">
                            <label htmlFor="cause">Doença</label>

                            <InputText
                                id="cause"
                                placeholder="Digite a causa do tratamento"
                                {...register('cause')}
                                className={classNames({
                                    'p-invalid': isSubmitted && errors.cause
                                })}
                            />

                            {errors.cause?.message && <small className="p-error">{errors.cause.message}</small>}
                        </div>
                    </div>

                    <div className="card mt-3">
                        <DataTableResponsables list={responsables} />
                    </div>

                    {errors.responsables?.message && <small className="p-error block mb-3">{errors.responsables.message}</small>}

                    <hr />

                    <div className="flex justify-content-between align-items-center mt-4">
                        <Button type="button" label="Mapear por IA" icon="pi pi-sparkles" severity="info" />

                        <div className="flex gap-2">
                            <Button type="button" label="Cancelar" icon="pi pi-times" severity="danger" outlined disabled={isSubmitting} onClick={handleCancel} />

                            <Button type="submit" label={patientId ? 'Atualizar' : 'Salvar'} icon="pi pi-check" loading={isSubmitting} />
                        </div>
                    </div>
                </Fieldset>
            </div>
        </form>
    );
}

function parseDate(value: Date | string | null | undefined): Date | null {
    if (!value) {
        return null;
    }

    if (value instanceof Date) {
        return value;
    }

    const dateValue = value.substring(0, 10);

    return new Date(`${dateValue}T00:00:00`);
}
