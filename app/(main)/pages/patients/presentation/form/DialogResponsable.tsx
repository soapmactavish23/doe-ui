'use client';

import { useEffect, useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';

import { Controller, SubmitHandler, useForm } from 'react-hook-form';

import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import { Fieldset } from 'primereact/fieldset';
import { InputMask } from 'primereact/inputmask';
import { InputText } from 'primereact/inputtext';
import { classNames } from 'primereact/utils';

import { createEmptyResponsable, Responsable, ResponsableType } from '../../domain/responsable';

import { convertToResponsable, ResponsableFormInput, ResponsableFormOutput, responsableSchema } from './schemas/responsable.schema';
import { ViaCepResponse } from '../../domain/address';

interface DialogResponsableProps {
    visible: boolean;
    responsable: Responsable;
    onClose: () => void;
    onSave: (responsable: Responsable) => void;
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
        label: 'Responsável legal',
        value: ResponsableType.GUARDIAN
    },
    {
        label: 'Outro',
        value: ResponsableType.OTHER
    }
];

function createDefaultValues(responsable: Responsable): ResponsableFormInput {
    return {
        id: responsable.id,
        name: responsable.name ?? '',
        contact: responsable.contact ?? '',
        rg: responsable.rg ?? '',
        cpf: responsable.cpf ?? '',
        localWorker: responsable.localWorker ?? '',
        type: responsable.type ?? ResponsableType.OTHER,
        address: {
            zipCode: responsable.address?.zipCode ?? '',
            street: responsable.address?.street ?? '',
            complement: responsable.address?.complement ?? '',
            district: responsable.address?.district ?? '',
            city: responsable.address?.city ?? '',
            state: responsable.address?.state ?? '',
            number: responsable.address?.number ?? ''
        }
    };
}

export default function DialogResponsable({ visible, responsable, onClose, onSave }: DialogResponsableProps) {
    const {
        register,
        handleSubmit,
        control,
        reset,
        setValue,
        setError,
        clearErrors,
        formState: { errors, isSubmitted, isSubmitting }
    } = useForm<ResponsableFormInput, unknown, ResponsableFormOutput>({
        resolver: zodResolver(responsableSchema),
        defaultValues: createDefaultValues(responsable)
    });

    const [isSearchingZipCode, setIsSearchingZipCode] = useState(false);

    const clearAddressFields = () => {
        setValue('address.street', '');
        setValue('address.district', '');
        setValue('address.city', '');
        setValue('address.state', '');
    };

    const searchZipCode = async (zipCodeValue: string) => {
        const zipCode = zipCodeValue.replace(/\D/g, '');

        if (zipCode.length !== 8) {
            return;
        }

        try {
            setIsSearchingZipCode(true);
            clearErrors('address.zipCode');

            const response = await fetch(`https://viacep.com.br/ws/${zipCode}/json/`);

            if (!response.ok) {
                throw new Error('Não foi possível consultar o CEP.');
            }

            const address: ViaCepResponse = await response.json();

            if (address.erro) {
                clearAddressFields();

                setError('address.zipCode', {
                    type: 'manual',
                    message: 'CEP não encontrado.'
                });

                return;
            }

            setValue('address.street', address.logradouro ?? '', {
                shouldValidate: true,
                shouldDirty: true
            });

            setValue('address.district', address.bairro ?? '', {
                shouldValidate: true,
                shouldDirty: true
            });

            setValue('address.city', address.localidade ?? '', {
                shouldValidate: true,
                shouldDirty: true
            });

            setValue('address.state', address.uf ?? '', {
                shouldValidate: true,
                shouldDirty: true
            });

            window.setTimeout(() => {
                document.getElementById('address.number')?.focus();
            }, 0);
        } catch {
            setError('address.zipCode', {
                type: 'manual',
                message: 'Não foi possível consultar o CEP.'
            });
        } finally {
            setIsSearchingZipCode(false);
        }
    };

    useEffect(() => {
        if (!visible) {
            return;
        }

        reset(createDefaultValues(responsable));
    }, [visible, responsable, reset]);

    const handleCancel = () => {
        reset(createDefaultValues(createEmptyResponsable()));

        onClose();
    };

    const handleSave: SubmitHandler<ResponsableFormOutput> = (form) => {
        onSave({
            ...convertToResponsable(form),
            id: responsable.id ?? form.id ?? null
        });
    };

    const footer = (
        <div className="flex justify-content-end gap-2">
            <Button type="button" label="Cancelar" icon="pi pi-times" severity="secondary" outlined disabled={isSubmitting} onClick={handleCancel} />

            <Button type="submit" label="Enviar" icon="pi pi-check" form="responsable-form" loading={isSubmitting} />
        </div>
    );

    return (
        <Dialog
            visible={visible}
            header={responsable.id ? 'Editar Responsável' : 'Cadastrar Responsável'}
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
            <form id="responsable-form" onSubmit={handleSubmit(handleSave)}>
                <Fieldset legend="Dados Pessoais" className="mb-4">
                    <div className="grid">
                        <div className="col-12 md:col-4 field">
                            <label htmlFor="responsable-name">Nome</label>

                            <InputText
                                id="responsable-name"
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
                                        value={field.value ?? ''}
                                        mask="(99) 99999-9999"
                                        placeholder="(xx) xxxxx-xxxx"
                                        autoClear={false}
                                        onChange={(event) => field.onChange(event.value ?? '')}
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
                                        value={field.value ?? ''}
                                        mask="999.999.999-99"
                                        placeholder="Digite o CPF"
                                        autoClear={false}
                                        onChange={(event) => field.onChange(event.value ?? '')}
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
                                        value={field.value}
                                        options={responsableTypeOptions}
                                        optionLabel="label"
                                        optionValue="value"
                                        placeholder="Selecione o tipo de vínculo"
                                        onChange={(event) => field.onChange(event.value)}
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
                                    <div className="p-inputgroup">
                                        <InputMask
                                            id={field.name}
                                            value={field.value ?? ''}
                                            mask="99999-999"
                                            placeholder="Digite o CEP"
                                            autoClear={false}
                                            disabled={isSearchingZipCode}
                                            onChange={(event) => {
                                                const value = event.value ?? '';

                                                field.onChange(value);
                                                clearErrors('address.zipCode');

                                                const numericZipCode = value.replace(/\D/g, '');

                                                if (numericZipCode.length === 8) {
                                                    void searchZipCode(value);
                                                }
                                            }}
                                            onBlur={(event) => {
                                                field.onBlur();
                                                void searchZipCode(event.target.value);
                                            }}
                                            className={classNames({
                                                'p-invalid': errors.address?.zipCode
                                            })}
                                        />

                                        <Button
                                            type="button"
                                            icon={isSearchingZipCode ? 'pi pi-spin pi-spinner' : 'pi pi-search'}
                                            loading={isSearchingZipCode}
                                            disabled={isSearchingZipCode}
                                            aria-label="Consultar CEP"
                                            onClick={() => void searchZipCode(field.value ?? '')}
                                        />
                                    </div>
                                )}
                            />

                            {errors.address?.zipCode?.message && <small className="p-error">{errors.address.zipCode.message}</small>}
                        </div>

                        <div className="col-12 md:col-7 field">
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

                        <div className="col-12 md:col-2 field">
                            <label htmlFor="address.number">Número</label>

                            <InputText
                                id="address.number"
                                placeholder="Digite o número"
                                {...register('address.number')}
                                className={classNames({
                                    'p-invalid': isSubmitted && errors.address?.number
                                })}
                            />

                            {errors.address?.number?.message && <small className="p-error">{errors.address.number.message}</small>}
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

                            <InputText id="address.complement" placeholder="Digite o complemento" {...register('address.complement')} />
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
