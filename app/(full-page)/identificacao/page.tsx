'use client';

import { useEffect, useRef, useState } from 'react';
import { useQuery } from '@tanstack/react-query';

import Section1 from './components/section1/Section1';
import Section2 from './components/section2/Section2';
import Section3 from './components/section3/Section3';

import { OccurrenceListResponse, OccurrenceResponse } from '@/app/api/models/occurrence';
import { occurrenceService } from '@/app/api/services/occurrence/occurrence_service_impl';
import { QueryKey } from '@/app/lib/react-query';

import { onMessageListener } from '@/firebase';

import './styles.scss';
import { Toast } from 'primereact/toast';

const getOrCreateDeviceId = () => {
    const storageKey = 'radar_peconhento_device_id';
    const currentDeviceId = localStorage.getItem(storageKey);

    if (currentDeviceId) {
        return currentDeviceId;
    }

    const newDeviceId = crypto.randomUUID();
    localStorage.setItem(storageKey, newDeviceId);

    return newDeviceId;
};

export default function IdentificationPage() {
    const toast = useRef<Toast>(null);
    const [selectedIdentification, setSelectedIdentification] = useState<OccurrenceResponse | null>(null);

    const { data: identifications = [], refetch } = useQuery<OccurrenceListResponse[]>({
        queryKey: [QueryKey.LOAD_BY_DEVICE_ID],
        queryFn: async () => occurrenceService.loadByDeviceId(getOrCreateDeviceId()),
        enabled: typeof window !== 'undefined'
    });

    useEffect(() => {
        let unsubscribe: (() => void) | undefined;

        onMessageListener((payload) => {
            console.log('Notificação Firebase recebida:', payload);

            toast.current?.show({
                severity: 'success',
                summary: 'Identificação Concluída',
                detail: 'Identificação concluída com sucesso!',
                life: 3000
            });

            refetch();
        }).then((unsubscribeFn) => {
            unsubscribe = unsubscribeFn;
        });

        return () => {
            unsubscribe?.();
        };
    }, [refetch]);

    return (
        <>
            <Toast ref={toast} />
            <main className="identification-page">
                <div className="identification-page__container">
                    <div className="mb-3">
                        <Section1 />
                    </div>

                    {identifications.length > 0 && (
                        <div className="grid">
                            <div className="col-12 lg:col-8">{selectedIdentification && <Section2 identification={selectedIdentification} />}</div>

                            <div className="col-12 lg:col-4">
                                <Section3 identifications={identifications} onSelectIdentification={setSelectedIdentification} />
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </>
    );
}
