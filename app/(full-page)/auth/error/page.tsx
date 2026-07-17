/* eslint-disable @next/next/no-img-element */
'use client';

import CardFullScreen from '../components/card_full_screen';

const ErrorPage = () => {
    return <CardFullScreen title="Erro Interno" description="Um erro inesperado ocorreu, contacte o administrador" url="/" />;
};

export default ErrorPage;
