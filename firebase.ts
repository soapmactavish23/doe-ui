import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, isSupported, onMessage } from 'firebase/messaging';

const firebaseConfig = {
    apiKey: 'AIzaSyDLSZ4h9ozpG9Ic_qqL7uLOhGIdwc_9Xyo',
    authDomain: 'doe-project-103b1.firebaseapp.com',
    projectId: 'doe-project-103b1',
    storageBucket: 'doe-project-103b1.firebasestorage.app',
    messagingSenderId: '737195841349',
    appId: '1:737195841349:web:ee9b0a39c90cc90bdd102c',
    measurementId: 'G-5Y85MT9FX0'
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
            vapidKey: 'BFISrkQU-X46lDFw1VMGio3kB9Tr_Cag1linRHmDrVj22kuoQMAqbcLFCxZfgFJiD2r3StqOSSgBhZA0uUW2usM',
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
