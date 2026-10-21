'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { FileUpload, FileUploadSelectEvent } from 'primereact/fileupload';
import { Steps } from 'primereact/steps';
import { ProgressBar } from 'primereact/progressbar';
import { Button } from 'primereact/button';
import { Message } from 'primereact/message';
import { Toast } from 'primereact/toast';
import { MenuItem } from 'primereact/menuitem';

import PatientForm from '../presentation/form/PatientForm';

import { IdentificationStatus } from './domain/identification';
import { identificationService } from './application/identification.service';
import { identificationNotification } from './application/identification.notification';

export default function IdentificationPage() {
    const fileUploadRef = useRef<FileUpload>(null);
    const toast = useRef<Toast>(null);

    const [file, setFile] = useState<File | null>(null);
    const [identificationId, setIdentificationId] = useState<string | null>(null);
    const [status, setStatus] = useState<IdentificationStatus | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const identificationIdRef = useRef<string | null>(null);
    const statusRef = useRef<IdentificationStatus | null>(null);
    const pendingNotifications = useRef(new Set<string>());

    const isFailed = status === IdentificationStatus.FAILED;
    const isCompleted = status === IdentificationStatus.COMPLETED;
    const isProcessing = status === IdentificationStatus.PROCESSING;

    const isWaiting = status === IdentificationStatus.PENDING || status === IdentificationStatus.PROCESSING;

    const activeIndex = isFailed || isCompleted ? 2 : isProcessing ? 1 : 0;

    const progress = isCompleted ? 100 : 0;

    const steps: MenuItem[] = [{ label: 'Pendente' }, { label: 'Progresso' }, { label: isFailed ? 'Falha' : 'Completo' }];

    const updateStatus = useCallback((nextStatus: IdentificationStatus, showToast = true) => {
        const previousStatus = statusRef.current;

        // Não retroceder um processamento já finalizado.
        if (previousStatus === IdentificationStatus.COMPLETED || previousStatus === IdentificationStatus.FAILED) {
            return;
        }

        statusRef.current = nextStatus;
        setStatus(nextStatus);

        if (nextStatus === IdentificationStatus.COMPLETED) {
            setError(null);

            if (showToast) {
                toast.current?.show({
                    severity: 'success',
                    summary: 'Identificação concluída',
                    detail: 'O documento foi processado com sucesso.',
                    life: 4000
                });
            }
        }

        if (nextStatus === IdentificationStatus.FAILED) {
            setError('O processamento da identificação falhou.');

            if (showToast) {
                toast.current?.show({
                    severity: 'error',
                    summary: 'Falha na identificação',
                    detail: 'Não foi possível processar o documento.',
                    life: 5000
                });
            }
        }
    }, []);

    const refreshIdentification = useCallback(
        async (id: string) => {
            try {
                const response = await identificationService.findById(id);

                if (identificationIdRef.current !== id) return;

                console.log('[DOE] Status recebido:', response.status);

                updateStatus(response.status);
            } catch (err) {
                console.error('[DOE] Erro ao consultar identificação:', err);
                setError('Não foi possível recuperar o resultado.');
            }
        },
        [updateStatus]
    );

    // Recuperação ao carregar a página.
    useEffect(() => {
        const savedId = identificationService.getSavedIdentificationId();

        if (!savedId) return;

        identificationIdRef.current = savedId;
        setIdentificationId(savedId);

        void refreshIdentification(savedId);
    }, [refreshIdentification]);

    // Inscrição nos eventos do Firebase.
    useEffect(() => {
        let cancelled = false;
        let unsubscribe: (() => void) | undefined;

        identificationNotification
            .subscribe(async (notification) => {
                if (cancelled) return;

                const currentId = identificationIdRef.current;

                console.log('[DOE] Notificação:', notification);

                if (!currentId) {
                    pendingNotifications.current.add(notification.identificationId);
                    return;
                }

                if (notification.identificationId !== currentId) {
                    return;
                }

                await refreshIdentification(currentId);
            })
            .then((unsubscribeFn) => {
                if (cancelled) {
                    unsubscribeFn();
                } else {
                    unsubscribe = unsubscribeFn;
                }
            })
            .catch((err) => {
                if (!cancelled) {
                    console.error('[DOE] Erro ao registrar notificações:', err);
                }
            });

        return () => {
            cancelled = true;
            unsubscribe?.();
        };
    }, [refreshIdentification]);

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

            const response = await identificationService.create(file);

            identificationIdRef.current = response.id;
            statusRef.current = null;

            setIdentificationId(response.id);
            updateStatus(response.status, false);

            setFile(null);
            fileUploadRef.current?.clear();

            toast.current?.show({
                severity: 'info',
                summary: 'Documento enviado',
                detail: 'Aguardando processamento.',
                life: 3000
            });

            if (pendingNotifications.current.has(response.id)) {
                pendingNotifications.current.delete(response.id);
                void refreshIdentification(response.id);
            }
        } catch (err) {
            console.error('[DOE] Erro ao enviar documento:', err);

            setError(err instanceof Error ? err.message : 'Não foi possível enviar o documento.');
        } finally {
            setLoading(false);
        }
    };

    const handleReset = () => {
        identificationService.clear();

        identificationIdRef.current = null;
        statusRef.current = null;
        pendingNotifications.current.clear();

        setFile(null);
        setIdentificationId(null);
        setStatus(null);
        setError(null);

        fileUploadRef.current?.clear();
    };

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

                        <Button label="Remover" icon="pi pi-times" text severity="danger" onClick={handleReset} />
                    </div>
                )}

                <Button label="Iniciar mapeamento" icon="pi pi-sparkles" severity="info" loading={loading} disabled={!file || loading} onClick={handleUpload} />

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
