'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

import { FileUpload, FileUploadSelectEvent } from 'primereact/fileupload';
import { Steps } from 'primereact/steps';
import { ProgressBar } from 'primereact/progressbar';
import { Button } from 'primereact/button';
import { Message } from 'primereact/message';
import { Toast } from 'primereact/toast';
import { MenuItem } from 'primereact/menuitem';

import { IdentificationStatus } from './domain/identification';
import { identificationService } from './application/identification.service';
import { identificationNotification } from './application/identification.notification';

export default function IdentificationPage() {
    const router = useRouter();

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
    const redirectingRef = useRef(false);

    const isFailed = status === IdentificationStatus.FAILED;
    const isCompleted = status === IdentificationStatus.COMPLETED;
    const isProcessing = status === IdentificationStatus.PROCESSING;

    const isWaiting = status === IdentificationStatus.PENDING || status === IdentificationStatus.PROCESSING;

    const activeIndex = isFailed || isCompleted ? 2 : identificationId ? 1 : 0;

    const progress = isCompleted ? 100 : 0;

    const steps: MenuItem[] = [{ label: 'Pendente' }, { label: 'Progresso' }, { label: isFailed ? 'Falha' : 'Completo' }];

    const updateStatus = useCallback((nextStatus: IdentificationStatus, showToast = true) => {
        const previousStatus = statusRef.current;

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
                    detail: 'Redirecionando para o cadastro.',
                    life: 3000
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
            if (redirectingRef.current) return;

            try {
                const response = await identificationService.findById(id);

                if (identificationIdRef.current !== id) return;

                if (response.status === IdentificationStatus.COMPLETED) {
                    if (!response.result) {
                        setError('A identificação foi concluída, mas não retornou dados.');
                        return;
                    }

                    if (redirectingRef.current) return;

                    redirectingRef.current = true;

                    updateStatus(IdentificationStatus.COMPLETED, false);

                    identificationService.clear();

                    router.replace(`/pages/patients/form-patient?identificationId=${encodeURIComponent(id)}`);

                    return;
                }

                updateStatus(response.status);
            } catch (err) {
                console.error('[DOE] Erro ao consultar identificação:', err);

                setError('Não foi possível recuperar o resultado.');
            }
        },
        [router, updateStatus]
    );

    useEffect(() => {
        const savedId = identificationService.getSavedIdentificationId();

        if (!savedId) return;

        identificationIdRef.current = savedId;
        setIdentificationId(savedId);

        void refreshIdentification(savedId);
    }, [refreshIdentification]);

    useEffect(() => {
        let cancelled = false;
        let unsubscribe: (() => void) | undefined;

        identificationNotification
            .subscribe(async (notification) => {
                if (cancelled || redirectingRef.current) return;

                const currentId = identificationIdRef.current;

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

            redirectingRef.current = false;
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
            } else if (response.status === IdentificationStatus.COMPLETED) {
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
        redirectingRef.current = false;
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

            {!identificationId && (
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
                </div>
            )}

            {identificationId && isWaiting && !error && <Message severity="info" text="Documento enviado. Aguardando o processamento por inteligência artificial..." className="w-full mb-4" />}

            {isCompleted && <Message severity="success" text="Identificação concluída. Abrindo o formulário..." className="w-full mb-4" />}

            {error && <Message severity="error" text={error} className="w-full mb-4" />}

            {!file && !identificationId && <Message severity="info" text="Selecione um documento PDF para iniciar o mapeamento." className="w-full mb-4" />}

            <ProgressBar value={isWaiting ? undefined : progress} mode={isWaiting ? 'indeterminate' : 'determinate'} className="mb-4" style={{ height: '12px' }} />

            <Steps model={steps} activeIndex={activeIndex} readOnly className="mb-3" />

            <hr />

            {!identificationId && (
                <div className="flex justify-content-between align-items-center w-full">
                    <Button label="Voltar" icon="pi pi-arrow-left" outlined onClick={() => router.back()} />

                    <Button label="Iniciar mapeamento" icon="pi pi-play" severity="info" loading={loading} disabled={!file || loading} onClick={handleUpload} />
                </div>
            )}

            {isFailed && (
                <div className="flex justify-content-end">
                    <Button label="Tentar novamente" icon="pi pi-refresh" severity="info" onClick={handleReset} />
                </div>
            )}
        </div>
    );
}
