/* eslint-disable @next/next/no-img-element */
'use client';

import CardFullScreen from '../auth/components/card_full_screen';

const NotFound = () => {
    return <CardFullScreen title="404 - Página não encontrada" description="A página não foi encontrata volte a página anterior" url="/" />;
};

export default NotFound;
