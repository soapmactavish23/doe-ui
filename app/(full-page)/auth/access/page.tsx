/* eslint-disable @next/next/no-img-element */
'use client';

import CardFullScreen from '../components/CardFullScreen';

const AccessDeniedPage = () => {
    return <CardFullScreen title="Acesso negado" description="Você não tem permissões suficientes para acessar" url="/auth/login" />;
};

export default AccessDeniedPage;
