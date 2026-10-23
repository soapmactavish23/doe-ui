import { onMessageListener } from '@/firebase';

export interface IdentificationNotification {
    identificationId: string;
    status: string;
}

type NotificationCallback = (notification: IdentificationNotification) => void;

export const identificationNotification = {
    async subscribe(callback: NotificationCallback): Promise<() => void> {
        let active = true;

        console.info('[DOE FCM] Registrando listeners de notificação');

        const dispatch = (identificationId: unknown, status: unknown) => {
            console.info('[DOE FCM] Evento recebido:', {
                identificationId,
                status,
                active
            });

            if (!active) return;

            if (typeof identificationId !== 'string' || typeof status !== 'string') {
                return;
            }

            callback({ identificationId, status });
        };

        const handleServiceWorkerMessage = (event: MessageEvent) => {
            if (event.data?.type !== 'DOE_IDENTIFICATION_STATUS') {
                return;
            }

            console.info('[DOE FCM] Mensagem recebida do Service Worker');

            dispatch(event.data.identificationId, event.data.status);
        };

        navigator.serviceWorker?.addEventListener('message', handleServiceWorkerMessage);

        try {
            const unsubscribeFirebase = await onMessageListener((payload: any) => {
                console.info('[DOE FCM] Mensagem recebida diretamente do Firebase');

                dispatch(payload.data?.identificationId, payload.data?.status);
            });

            console.info('[DOE FCM] Listeners registrados');

            return () => {
                active = false;
                unsubscribeFirebase?.();

                navigator.serviceWorker?.removeEventListener('message', handleServiceWorkerMessage);
            };
        } catch (error) {
            active = false;

            navigator.serviceWorker?.removeEventListener('message', handleServiceWorkerMessage);

            console.error('[DOE FCM] Falha ao registrar listeners:', error);

            throw error;
        }
    }
};
