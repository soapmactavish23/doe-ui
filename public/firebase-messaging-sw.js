
importScripts('https://www.gstatic.com/firebasejs/10.13.2/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.13.2/firebase-messaging-compat.js');

firebase.initializeApp({
    apiKey: 'AIzaSyDLSZ4h9ozpG9Ic_qqL7uLOhGIdwc_9Xyo',
    authDomain: 'doe-project-103b1.firebaseapp.com',
    projectId: 'doe-project-103b1',
    storageBucket: 'doe-project-103b1.firebasestorage.app',
    messagingSenderId: '737195841349',
    appId: '1:737195841349:web:ee9b0a39c90cc90bdd102c',
    measurementId: 'G-5Y85MT9FX0'
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(async (payload) => {
    const identificationId = payload.data?.identificationId;
    const status = payload.data?.status;

    console.log('[DOE SW] Notificação recebida:', {
        identificationId,
        status
    });

    if (!identificationId || !status) return;

    const clients = await self.clients.matchAll({
        type: 'window',
        includeUncontrolled: true
    });

    for (const client of clients) {
        client.postMessage({
            type: 'DOE_IDENTIFICATION_STATUS',
            identificationId,
            status
        });
    }

    const completed = status === 'COMPLETED';

    await self.registration.showNotification(
        completed
            ? 'Identificação concluída'
            : 'Falha na identificação',
        {
            body: completed
                ? 'O documento foi processado com sucesso.'
                : 'Não foi possível processar o documento.',
            icon: '/favicon.ico',
            tag: identificationId,
            data: {
                identificationId,
                status
            }
        }
    );
});
