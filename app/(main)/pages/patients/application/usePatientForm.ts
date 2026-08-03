'use client';

import { ChangeEvent, useCallback, useEffect, useState } from 'react';

import { useSearchParams, useRouter } from 'next/navigation';

import { useQuery } from '@tanstack/react-query';

import { QueryKey } from '@/app/lib/react-query';

import { PatientRequest, PatientResponseDetail } from '../domain/patient';

import { Responsable } from '../domain/responsable';

import { patientService } from './patient.service';

export function usePatientForm() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const patientId = searchParams.get('id');

    const [image, setImage] = useState<File | null>(null);

    const [imagePreview, setImagePreview] = useState<string | null>(null);

    const [responsables, setResponsables] = useState<Responsable[]>([]);

    const {
        data: patient,
        isLoading,
        isError
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

    useEffect(() => {
        if (!patient) {
            return;
        }

        setResponsables(patient.responsables ?? []);

        setImagePreview(patient.url ?? null);
    }, [patient]);

    useEffect(() => {
        return () => {
            if (imagePreview?.startsWith('blob:')) {
                URL.revokeObjectURL(imagePreview);
            }
        };
    }, [imagePreview]);

    const changeImage = useCallback((event: ChangeEvent<HTMLInputElement>) => {
        const selectedImage = event.target.files?.[0];

        if (!selectedImage) {
            return;
        }

        setImagePreview((current) => {
            if (current?.startsWith('blob:')) {
                URL.revokeObjectURL(current);
            }

            return URL.createObjectURL(selectedImage);
        });

        setImage(selectedImage);
    }, []);

    const save = async (request: PatientRequest): Promise<void> => {
        if (patientId) {
            await patientService.update(
                {
                    ...request,
                    id: patientId
                },
                image
            );
        } else {
            await patientService.create(
                {
                    ...request,
                    id: null
                },
                image
            );
        }

        router.push('/pages/patients');
    };

    const cancel = () => {
        router.push('/pages/patients');
    };

    return {
        patientId,
        patient,

        image,
        imagePreview,

        responsables,
        setResponsables,

        isLoading,
        isError,

        changeImage,
        save,
        cancel
    };
}
