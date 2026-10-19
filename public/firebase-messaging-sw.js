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

firebase.messaging();
