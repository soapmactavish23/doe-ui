'use client';

import React, { useEffect, useRef, useState } from 'react';
import { FileUpload, FileUploadSelectEvent } from 'primereact/fileupload';
import { Steps } from 'primereact/steps';
import { ProgressBar } from 'primereact/progressbar';
import { Button } from 'primereact/button';
import { Message } from 'primereact/message';
import { Toast } from 'primereact/toast';
import { MenuItem } from 'primereact/menuitem';

import PatientForm from '../presentation/form/PatientForm';

import { getFirebaseToken } from '@/firebase';

import { IdentificationStatus } from './domain/identification';
import { identificationRepository } from './infrastructure/identification.repository';
import { identificationStorage } from './application/identification.storage';

import { onMessageListener } from '@/firebase';

export default function IdentificationPage() {
    const fileUploadRef = useRef<FileUpload>(null);
    const toast = useRef<Toast>(null);

    const [file, setFile] = useState<File | null>(null);
    const [identificationId, setIdentificationId] = useState<string | null>(null);
    const [status, setStatus] = useState<IdentificationStatus | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const identificationIdRef = useRef<string | null>(null);
    const notificationInProgress = useRef(false);

    const isFailed = status === IdentificationStatus.FAILED;
    const isCompleted = status === IdentificationStatus.COMPLETED;
    const isProcessing = status === IdentificationStatus.PROCESSING;

    const isWaiting = status === IdentificationStatus.PENDING || status === IdentificationStatus.PROCESSING;

    const activeIndex = isFailed || isCompleted ? 2 : isProcessing ? 1 : 0;

    const progress = isCompleted ? 100 : 0;

    const steps: MenuItem[] = [{ label: 'Pendente' }, { label: 'Progresso' }, { label: isFailed ? 'Falha' : 'Completo' }];

    const handleSelect = (event: FileUploadSelectEvent) => {
        const selectedFile = event.files[0];

        if (!selectedFile) return;

        setFile(selectedFile);
        setError(null);
    };

    const handleUpload = async () => {
        if (!file || loading) return;

        try {
            setLoading(true);
            setError(null);

            const pushToken = await getFirebaseToken();

            if (!pushToken || !pushToken.trim()) {
                const message = 'Não foi possível ativar as notificações Firebase. ' + 'O documento não foi enviado. Verifique as permissões ' + 'e a configuração do Firebase.';

                setError(message);

                toast.current?.show({
                    severity: 'error',
                    summary: 'Notificações indisponíveis',
                    detail: message,
                    life: 6000
                });

                return;
            }

            const response = await identificationRepository.create({
                file,
                pushToken
            });

            identificationStorage.saveIdentificationId(response.id);

            identificationIdRef.current = response.id;
            notificationInProgress.current = false;

            setIdentificationId(response.id);
            setStatus(response.status);

            setFile(null);
            fileUploadRef.current?.clear();

            toast.current?.show({
                severity: 'info',
                summary: 'Documento enviado',
                detail: 'Aguardando resposta do processamento.',
                life: 3000
            });
        } catch (err) {
            console.error('Erro ao iniciar identificação:', err);

            setError('Não foi possível enviar o documento.');

            toast.current?.show({
                severity: 'error',
                summary: 'Erro',
                detail: 'Falha ao enviar o documento.',
                life: 4000
            });
        } finally {
            setLoading(false);
        }
    };

    const handleReset = () => {
        identificationStorage.clearIdentification();

        identificationIdRef.current = null;
        notificationInProgress.current = false;

        setFile(null);
        setIdentificationId(null);
        setStatus(null);
        setError(null);

        fileUploadRef.current?.clear();
    };

    useEffect(() => {
        const savedId = identificationStorage.getIdentificationId();

        if (!savedId) return;

        identificationIdRef.current = savedId;
        setIdentificationId(savedId);

        let cancelled = false;

        const restoreIdentification = async () => {
            try {
                const response = await identificationRepository.findById(savedId);

                if (!cancelled && identificationIdRef.current === savedId) {
                    setStatus(response.status);

                    if (response.status === IdentificationStatus.FAILED) {
                        setError('O processamento da identificação falhou.');
                    }
                }
            } catch (err) {
                if (!cancelled) {
                    console.error('Erro ao recuperar identificação:', err);
                    setError('Não foi possível recuperar a identificação anterior.');
                }
            }
        };

        void restoreIdentification();

        return () => {
            cancelled = true;
        };
    }, []);

    useEffect(() => {
        let cancelled = false;
        let unsubscribe: (() => void) | undefined;

        const handleNotification = async (payload: any) => {
            console.log('FCM recebido no frontend:', {
                identificationId: payload.data?.identificationId,
                status: payload.data?.status,
                currentId: identificationIdRef.current
            });

            const currentId = identificationIdRef.current;

            const receivedId = payload.data?.identificationId;

            if (!currentId || receivedId !== currentId) {
                return;
            }

            if (notificationInProgress.current) {
                ('');
                return;
            }

            notificationInProgress.current = true;

            try {
                // Uma única consulta após a notificação Firebase.
                const response = await identificationRepository.findById(currentId);

                if (cancelled || identificationIdRef.current !== currentId) {
                    return;
                }

                setStatus(response.status);

                if (response.status === IdentificationStatus.COMPLETED) {
                    setError(null);

                    toast.current?.show({
                        severity: 'success',
                        summary: 'Identificação concluída',
                        detail: 'O documento foi processado com sucesso.',
                        life: 4000
                    });
                }

                if (response.status === IdentificationStatus.FAILED) {
                    setError('O processamento da identificação falhou.');

                    toast.current?.show({
                        severity: 'error',
                        summary: 'Falha na identificação',
                        detail: 'Não foi possível processar o documento.',
                        life: 5000
                    });
                }
            } catch (err) {
                if (cancelled) return;

                console.error('Erro ao consultar identificação:', err);

                setError('A notificação foi recebida, mas não foi possível consultar o resultado.');
            } finally {
                notificationInProgress.current = false;
            }
        };

        onMessageListener(handleNotification)
            .then((unsubscribeFn) => {
                if (cancelled) {
                    unsubscribeFn?.();
                } else {
                    unsubscribe = unsubscribeFn;
                }
            })
            .catch((err) => {
                if (!cancelled) {
                    console.error('Erro ao registrar listener Firebase:', err);
                    setError('Não foi possível ativar as notificações Firebase.');
                }
            });

        return () => {
            cancelled = true;
            unsubscribe?.();
        };
    }, []);

    return (
        <div className="card">
            <Toast ref={toast} />

            <h4 className="mb-4">Mapear por Inteligência Artificial</h4>

            <div className="flex flex-column align-items-center gap-3 mb-4">
                <i className="pi pi-file-pdf text-primary" style={{ fontSize: '3rem' }} />

                <FileUpload ref={fileUploadRef} mode="basic" name="file" accept="application/pdf,.pdf" maxFileSize={10000000} chooseLabel="Enviar arquivo" customUpload onSelect={handleSelect} disabled={loading} className="w-auto" />

                {file && (
                    <div className="flex align-items-center gap-2">
                        <i className="pi pi-file-pdf text-red-500" />

                        <span>{file.name}</span>

                        <Button icon="pi pi-times" rounded text severity="danger" onClick={handleReset} tooltip="Remover arquivo" />
                    </div>
                )}

                <Button label="Iniciar mapeamento" icon="pi pi-sparkles" severity="info" loading={loading} disabled={!file} onClick={handleUpload} />
                {identificationId && !isCompleted && !isFailed && !error && <Message severity="info" text="Documento enviado com sucesso. Aguardando resposta do processamento por inteligência artificial..." />}
                {error && <Message severity="error" text={error} className="w-full" />}
            </div>

            {!file && !identificationId && <Message severity="info" text="Selecione um documento PDF para iniciar o mapeamento." />}

            <ProgressBar value={isWaiting ? undefined : progress} mode={isWaiting ? 'indeterminate' : 'determinate'} className="mb-4" style={{ height: '12px' }} />

            <Steps model={steps} activeIndex={activeIndex} readOnly className="mb-3" />

            {isCompleted && <PatientForm />}
        </div>
    );
}
