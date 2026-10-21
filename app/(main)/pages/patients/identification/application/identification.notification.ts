import { onMessageListener } from '@/firebase';

export interface IdentificationNotification {
    identificationId: string;
    status: string;
}

type NotificationCallback = (notification: IdentificationNotification) => void;

export const identificationNotification = {
    async subscribe(callback: NotificationCallback): Promise<() => void> {
        let active = true;

        const dispatch = (identificationId: unknown, status: unknown) => {
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

            dispatch(event.data.identificationId, event.data.status);
        };

        navigator.serviceWorker?.addEventListener('message', handleServiceWorkerMessage);

        try {
            const unsubscribeFirebase = await onMessageListener((payload: any) => {
                dispatch(payload.data?.identificationId, payload.data?.status);
            });

            return () => {
                active = false;

                unsubscribeFirebase?.();

                navigator.serviceWorker?.removeEventListener('message', handleServiceWorkerMessage);
            };
        } catch (error) {
            active = false;

            navigator.serviceWorker?.removeEventListener('message', handleServiceWorkerMessage);

            throw error;
        }
    }
};
