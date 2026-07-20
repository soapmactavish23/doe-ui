/* eslint-disable @next/next/no-img-element */
'use client';

import { Fieldset } from 'primereact/fieldset';
import { InputText } from 'primereact/inputtext';
import z from 'zod';
import { newPatientRequest, patientRequestSchema } from '../types/patient';
import { Controller, useForm } from 'react-hook-form';
import { classNames } from 'primereact/utils';
import imgUser from '@/public/user.png';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

type FormPatient = z.infer<typeof patientRequestSchema>;

export default function FormPatient() {
    const {
        register,
        handleSubmit,
        setValue,
        control,
        reset,
        formState: { errors, isSubmitted, isSubmitting }
    } = useForm<FormPatient>({});

    const [obj, setObj] = useState<FormPatient>();
    const router = useRouter();

    return (
        <div className="card">
            <Fieldset legend="Formulário de Paciente">
                <div className="flex flex-column align-items-center justify-content-center gap-3 mb-3">
                    <img src={imgUser.src} className="img-fluid" alt="Imagem do usuário" width={100} height={100} />

                    <Button type="button" label="Enviar foto" icon="pi pi-upload" />
                </div>
                <div className="grid p-fluid">
                    <div className="col-12 md:col-4 field">
                        <label htmlFor="name">Nome</label>
                        <InputText id="name" placeholder="Digite o nome do usuário" {...register('name')} className={classNames({ 'p-invalid': isSubmitted && errors.name })} />
                        {errors.name && <small className="p-error">{errors.name.message}</small>}
                    </div>
                    <div className="col-12 md:col-4 field">
                        <label htmlFor="birthDate">Data de Nascimento</label>
                        <InputText id="birthDate" type="date" {...register('birthDate')} className={classNames({ 'p-invalid': isSubmitted && errors.birthDate })} />
                        {errors.birthDate && <small className="p-error">{errors.birthDate.message}</small>}
                    </div>
                    <div className="col-12 md:col-4 field">
                        <label htmlFor="sex">Sexo</label>

                        <Controller
                            name="sex"
                            control={control}
                            render={({ field }) => (
                                <Dropdown
                                    id={field.name}
                                    value={field.value}
                                    onChange={(event) => field.onChange(event.value)}
                                    onBlur={field.onBlur}
                                    options={[
                                        { key: 'MALE', value: 'Masculino' },
                                        { key: 'FEMALE', value: 'Feminino' }
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

                        {errors.sex && <small className="p-error">{errors.sex.message}</small>}
                    </div>
                    <div className="col-12 md:col-4 field">
                        <label htmlFor="startTreatment">Início do Tratamento</label>
                        <InputText id="startTreatment" type="date" {...register('startTreatment')} className={classNames({ 'p-invalid': isSubmitted && errors.startTreatment })} />
                        {errors.startTreatment && <small className="p-error">{errors.startTreatment.message}</small>}
                    </div>
                    <div className="col-12 md:col-8 field">
                        <label htmlFor="cause">Doença</label>
                        <InputText id="cause" placeholder="Digite a causa do tratamento" {...register('cause')} className={classNames({ 'p-invalid': isSubmitted && errors.cause })} />
                        {errors.cause && <small className="p-error">{errors.cause.message}</small>}
                    </div>
                </div>
                <div className="card">
                    <Fieldset legend="Responsáveis">{/* TODO: FAZER A TABELA FUNCIONAR */}</Fieldset>
                </div>
                <hr />
                <div className="flex justify-content-between align-items-center mt-4">
                    <Button label="Mapear por IA" severity="info" />

                    <div className="flex gap-2">
                        <Button
                            label="Cancelar"
                            severity="danger"
                            outlined
                            onClick={() => {
                                router.push('/pages/patients');
                            }}
                        />

                        <Button label="Salvar" icon="pi pi-check" type="submit" />
                    </div>
                </div>
            </Fieldset>
        </div>
    );
}
