import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, isSupported, onMessage } from 'firebase/messaging';

const firebaseConfig = {
    apiKey: 'AIzaSyBXA9gLuHoSxoVwi1Gyd_Z9ODTuHv3-kIQ',
    authDomain: 'doe-88ba8.firebaseapp.com',
    projectId: 'doe-88ba8',
    storageBucket: 'doe-88ba8.firebasestorage.app',
    messagingSenderId: '650480503578',
    appId: '1:650480503578:web:23ad91390e7bf8e1c6baa3',
    measurementId: 'G-NQZKDG0QNB'
};

const app = initializeApp(firebaseConfig);

export async function getFirebaseToken() {
    try {
        const supported = await isSupported();

        if (!supported) return '';

        const permission = await Notification.requestPermission();

        if (permission !== 'granted') return '';

        const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');

        const messaging = getMessaging(app);

        const token = await getToken(messaging, {
            vapidKey: 'BJNf2IJM0jDjHH3-ykE55eHHscX7y9C8EDd9p-qJnQeV2FITDhP5qvijK_DQpAyf6JNwpHCMMkOViI-YSpMSOsg',
            serviceWorkerRegistration: registration
        });

        return token ?? '';
    } catch (error) {
        console.error('Erro ao gerar token Firebase:', error);
        return '';
    }
}

export const onMessageListener = async (callback: (payload: unknown) => void) => {
    const supported = await isSupported();

    if (!supported) {
        return;
    }

    const messaging = getMessaging(app);

    return onMessage(messaging, callback);
};
