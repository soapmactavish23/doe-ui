'use client';

import { useEffect } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';

import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import { Fieldset } from 'primereact/fieldset';
import { InputMask } from 'primereact/inputmask';
import { InputText } from 'primereact/inputtext';
import { classNames } from 'primereact/utils';

import { defaultValuesResponsable, Responsable } from '../../types/responsable/responsable';

import { ResponsableType } from '../../types/responsable/responsable_type';

import { convertToEntityResponsable, FormDialogInputResponsable, FormDialogOutputResponsable, responsableSchema } from '../../types/responsable/responsable_schema';

interface DialogProps {
    visibleDialog: boolean;
    obj: Responsable;
    onClose?: () => void;
    onSave: (data: Responsable) => void;
}

interface ResponsableTypeOption {
    label: string;
    value: ResponsableType;
}

const responsableTypeOptions: ResponsableTypeOption[] = [
    {
        label: 'Mãe',
        value: ResponsableType.MOTHER
    },
    {
        label: 'Pai',
        value: ResponsableType.FATHER
    },
    {
        label: 'Outro',
        value: ResponsableType.OTHER
    }
];

export default function DialogResponsable({ visibleDialog, obj, onClose, onSave }: DialogProps) {
    const {
        register,
        handleSubmit,
        control,
        reset,
        formState: { errors, isSubmitted, isSubmitting }
    } = useForm<FormDialogInputResponsable, unknown, FormDialogOutputResponsable>({
        resolver: zodResolver(responsableSchema),
        defaultValues: defaultValuesResponsable(obj)
    });

    /*
     * Sempre que o diálogo abrir ou o objeto selecionado mudar,
     * o formulário recebe os dados atuais.
     */
    useEffect(() => {
        if (!visibleDialog) {
            return;
        }

        reset(defaultValuesResponsable(obj));
    }, [visibleDialog, obj, reset]);

    const handleCancel = () => {
        reset(defaultValuesResponsable(obj));
        onClose?.();
    };

    const handleSave: SubmitHandler<FormDialogOutputResponsable> = (formData) => {
        const responsable = convertToEntityResponsable(formData);

        /*
         * Preserva o ID quando estiver editando um responsável
         * que já existe no backend.
         */
        onSave({
            ...responsable,
            id: obj.id ?? responsable.id ?? null
        });
    };

    const footer = (
        <div className="flex justify-content-end gap-2">
            <Button type="button" label="Cancelar" icon="pi pi-times" severity="secondary" outlined disabled={isSubmitting} onClick={handleCancel} />

            <Button type="submit" label="Enviar" icon="pi pi-check" form="form-responsable" loading={isSubmitting} />
        </div>
    );

    return (
        <Dialog
            visible={visibleDialog}
            header={obj.id ? 'Editar Responsável' : 'Cadastrar Responsável'}
            modal
            draggable={false}
            dismissableMask={false}
            className="p-fluid"
            style={{
                width: '80rem',
                maxWidth: '95vw'
            }}
            breakpoints={{
                '1200px': '85vw',
                '960px': '90vw',
                '640px': '95vw'
            }}
            footer={footer}
            onHide={handleCancel}
        >
            <form id="form-responsable" onSubmit={handleSubmit(handleSave)}>
                <Fieldset legend="Dados Pessoais" className="mb-4">
                    <div className="grid">
                        <div className="col-12 md:col-4 field">
                            <label htmlFor="name">Nome</label>

                            <InputText
                                id="name"
                                placeholder="Digite o nome"
                                {...register('name')}
                                className={classNames({
                                    'p-invalid': isSubmitted && errors.name
                                })}
                            />

                            {errors.name?.message && <small className="p-error">{errors.name.message}</small>}
                        </div>

                        <div className="col-12 md:col-4 field">
                            <label htmlFor="contact">Contato</label>

                            <Controller
                                name="contact"
                                control={control}
                                render={({ field }) => (
                                    <InputMask
                                        id={field.name}
                                        name={field.name}
                                        value={field.value ?? ''}
                                        mask="(99) 99999-9999"
                                        placeholder="(xx) xxxxx-xxxx"
                                        autoClear={false}
                                        onChange={(event) => {
                                            field.onChange(event.value ?? '');
                                        }}
                                        onBlur={field.onBlur}
                                        className={classNames({
                                            'p-invalid': isSubmitted && errors.contact
                                        })}
                                    />
                                )}
                            />

                            {errors.contact?.message && <small className="p-error">{errors.contact.message}</small>}
                        </div>

                        <div className="col-12 md:col-4 field">
                            <label htmlFor="rg">RG</label>

                            <InputText
                                id="rg"
                                placeholder="Digite o RG"
                                {...register('rg')}
                                className={classNames({
                                    'p-invalid': isSubmitted && errors.rg
                                })}
                            />

                            {errors.rg?.message && <small className="p-error">{errors.rg.message}</small>}
                        </div>

                        <div className="col-12 md:col-4 field">
                            <label htmlFor="cpf">CPF</label>

                            <Controller
                                name="cpf"
                                control={control}
                                render={({ field }) => (
                                    <InputMask
                                        id={field.name}
                                        name={field.name}
                                        value={field.value ?? ''}
                                        mask="999.999.999-99"
                                        placeholder="Digite o CPF"
                                        autoClear={false}
                                        onChange={(event) => {
                                            field.onChange(event.value ?? '');
                                        }}
                                        onBlur={field.onBlur}
                                        className={classNames({
                                            'p-invalid': isSubmitted && errors.cpf
                                        })}
                                    />
                                )}
                            />

                            {errors.cpf?.message && <small className="p-error">{errors.cpf.message}</small>}
                        </div>

                        <div className="col-12 md:col-4 field">
                            <label htmlFor="localWorker">Local de trabalho</label>

                            <InputText
                                id="localWorker"
                                placeholder="Digite o local de trabalho"
                                {...register('localWorker')}
                                className={classNames({
                                    'p-invalid': isSubmitted && errors.localWorker
                                })}
                            />

                            {errors.localWorker?.message && <small className="p-error">{errors.localWorker.message}</small>}
                        </div>

                        <div className="col-12 md:col-4 field">
                            <label htmlFor="type">Tipo de vínculo</label>

                            <Controller
                                name="type"
                                control={control}
                                render={({ field }) => (
                                    <Dropdown
                                        id={field.name}
                                        name={field.name}
                                        value={field.value}
                                        options={responsableTypeOptions}
                                        optionLabel="label"
                                        optionValue="value"
                                        placeholder="Selecione o tipo de vínculo"
                                        onChange={(event) => {
                                            field.onChange(event.value);
                                        }}
                                        onBlur={field.onBlur}
                                        className={classNames({
                                            'p-invalid': isSubmitted && errors.type
                                        })}
                                    />
                                )}
                            />

                            {errors.type?.message && <small className="p-error">{errors.type.message}</small>}
                        </div>
                    </div>
                </Fieldset>

                <Fieldset legend="Endereço">
                    <div className="grid">
                        <div className="col-12 md:col-3 field">
                            <label htmlFor="address.zipCode">CEP</label>

                            <Controller
                                name="address.zipCode"
                                control={control}
                                render={({ field }) => (
                                    <InputMask
                                        id={field.name}
                                        name={field.name}
                                        value={field.value ?? ''}
                                        mask="99999-999"
                                        placeholder="Digite o CEP"
                                        autoClear={false}
                                        onChange={(event) => {
                                            field.onChange(event.value ?? '');
                                        }}
                                        onBlur={field.onBlur}
                                        className={classNames({
                                            'p-invalid': isSubmitted && errors.address?.zipCode
                                        })}
                                    />
                                )}
                            />

                            {errors.address?.zipCode?.message && <small className="p-error">{errors.address.zipCode.message}</small>}
                        </div>

                        <div className="col-12 md:col-9 field">
                            <label htmlFor="address.street">Endereço</label>

                            <InputText
                                id="address.street"
                                placeholder="Digite o endereço"
                                {...register('address.street')}
                                className={classNames({
                                    'p-invalid': isSubmitted && errors.address?.street
                                })}
                            />

                            {errors.address?.street?.message && <small className="p-error">{errors.address.street.message}</small>}
                        </div>

                        <div className="col-12 md:col-4 field">
                            <label htmlFor="address.district">Bairro</label>

                            <InputText
                                id="address.district"
                                placeholder="Digite o bairro"
                                {...register('address.district')}
                                className={classNames({
                                    'p-invalid': isSubmitted && errors.address?.district
                                })}
                            />

                            {errors.address?.district?.message && <small className="p-error">{errors.address.district.message}</small>}
                        </div>

                        <div className="col-12 md:col-8 field">
                            <label htmlFor="address.complement">Complemento</label>

                            <InputText
                                id="address.complement"
                                placeholder="Digite o complemento"
                                {...register('address.complement')}
                                className={classNames({
                                    'p-invalid': isSubmitted && errors.address?.complement
                                })}
                            />

                            {errors.address?.complement?.message && <small className="p-error">{errors.address.complement.message}</small>}
                        </div>

                        <div className="col-12 md:col-8 field">
                            <label htmlFor="address.city">Cidade</label>

                            <InputText
                                id="address.city"
                                placeholder="Digite a cidade"
                                {...register('address.city')}
                                className={classNames({
                                    'p-invalid': isSubmitted && errors.address?.city
                                })}
                            />

                            {errors.address?.city?.message && <small className="p-error">{errors.address.city.message}</small>}
                        </div>

                        <div className="col-12 md:col-4 field">
                            <label htmlFor="address.state">Estado</label>

                            <InputText
                                id="address.state"
                                placeholder="Digite a UF"
                                maxLength={2}
                                {...register('address.state')}
                                onInput={(event) => {
                                    event.currentTarget.value = event.currentTarget.value.toUpperCase();
                                }}
                                className={classNames({
                                    'p-invalid': isSubmitted && errors.address?.state
                                })}
                            />

                            {errors.address?.state?.message && <small className="p-error">{errors.address.state.message}</small>}
                        </div>
                    </div>
                </Fieldset>
            </form>
        </Dialog>
    );
}
