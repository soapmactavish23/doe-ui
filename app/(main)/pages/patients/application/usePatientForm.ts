'use client';

import { ChangeEvent, useCallback, useEffect, useRef, useState } from 'react';

import { useRouter, useSearchParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { Toast } from 'primereact/toast';

import { QueryKey } from '@/app/lib/react-query';
import { Message } from '@/app/components/Message';

import { PatientRequest, PatientResponseDetail } from '../domain/patient';

import { Responsable } from '../domain/responsable';

import { patientService } from './patient.service';

import { identificationService } from '../identification/application/identification.service';
import { identificationMapper } from '../identification/application/identification.mapper';
import { IdentificationStatus } from '../identification/domain/identification';

export function usePatientForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const toast = useRef<Toast>(null);

    const patientId = searchParams.get('id');

    const identificationId = patientId ? null : searchParams.get('identificationId');

    const [image, setImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    const [responsables, setResponsables] = useState<Responsable[]>([]);

    const {
        data: patient,
        isLoading: isPatientLoading,
        isError: isPatientError
    } = useQuery<PatientResponseDetail>({
        queryKey: [QueryKey.PATIENT_FIND_BY_ID, patientId],
        queryFn: () => {
            if (!patientId) {
                throw new Error('ID do paciente não informado');
            }

            return patientService.findById(patientId);
        },
        enabled: Boolean(patientId)
    });

    const {
        data: identificationData,
        isLoading: isIdentificationLoading,
        isError: isIdentificationError
    } = useQuery<PatientRequest>({
        queryKey: ['PATIENT_IDENTIFICATION_RESULT', identificationId],
        queryFn: async () => {
            if (!identificationId) {
                throw new Error('ID da identificação não informado');
            }

            const response = await identificationService.findById(identificationId);

            if (response.status !== IdentificationStatus.COMPLETED || !response.result) {
                throw new Error('O resultado da identificação não está disponível.');
            }

            return identificationMapper.toPatientRequest(response.result);
        },
        enabled: Boolean(identificationId),
        retry: false,
        refetchOnWindowFocus: false
    });

    useEffect(() => {
        if (!patient) return;

        setResponsables(patient.responsables ?? []);
        setImagePreview(patient.url ?? null);
    }, [patient]);

    useEffect(() => {
        if (!identificationData) return;

        setResponsables(identificationData.responsables);
    }, [identificationData]);

    useEffect(() => {
        return () => {
            if (imagePreview?.startsWith('blob:')) {
                URL.revokeObjectURL(imagePreview);
            }
        };
    }, [imagePreview]);

    const changeImage = useCallback((event: ChangeEvent<HTMLInputElement>) => {
        const selectedImage = event.target.files?.[0];

        if (!selectedImage) return;

        setImagePreview((current) => {
            if (current?.startsWith('blob:')) {
                URL.revokeObjectURL(current);
            }

            return URL.createObjectURL(selectedImage);
        });

        setImage(selectedImage);
    }, []);

    const save = async (request: PatientRequest): Promise<boolean> => {
        try {
            if (patientId) {
                await patientService.update({ ...request, id: patientId }, image);
            } else {
                await patientService.create({ ...request, id: null }, image);
            }

            toast.current?.show({
                severity: 'success',
                summary: Message.successMsg,
                detail: Message.successSave,
                life: 3000
            });

            router.push('/pages/patients');

            return true;
        } catch (error) {
            console.error('Erro ao salvar paciente:', error);

            toast.current?.show({
                severity: 'error',
                summary: Message.errorMsg,
                detail: Message.errorSave,
                life: 5000
            });

            return false;
        }
    };

    const cancel = () => {
        router.push('/pages/patients');
    };

    return {
        patientId,
        identificationId,

        patient,
        identificationData,

        image,
        imagePreview,

        responsables,
        setResponsables,

        isLoading: isPatientLoading || isIdentificationLoading,

        isError: isPatientError || isIdentificationError,

        toast,
        changeImage,
        save,
        cancel
    };
}
