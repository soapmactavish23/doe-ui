/* eslint-disable @next/next/no-img-element */
'use client';
import { useRouter } from 'next/navigation';
import React from 'react';
import { Button } from 'primereact/button';

export interface CardFullScreenProps {
    title: string;
    description: string;
    url: string;
}

export default function CardFullScreen(props: CardFullScreenProps) {
    const router = useRouter();

    return (
        <div className="surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden">
            <div className="flex flex-column align-items-center justify-content-center">
                <img src="logo.png" alt="Sakai logo" className="mb-5 w-6rem flex-shrink-0" />
                <div
                    style={{
                        borderRadius: '56px',
                        padding: '0.3rem',
                        background: 'linear-gradient(180deg, rgba(255, 0, 0, 0.628) 100%, rgba(33, 150, 243, 0) 100%)'
                    }}
                >
                    <div className="w-full surface-card py-8 px-5 sm:px-8 flex flex-column align-items-center" style={{ borderRadius: '53px' }}>
                        <div className="flex justify-content-center align-items-center bg-red-500 border-circle" style={{ height: '3.2rem', width: '3.2rem' }}>
                            <i className="pi pi-fw pi-exclamation-circle text-2xl text-white"></i>
                        </div>
                        <h1 className="text-900 font-bold text-5xl mb-2">{props.title}</h1>
                        <div className="text-600 mb-5">{props.description}</div>
                        <Button icon="pi pi-arrow-left" label="Voltar" text onClick={() => router.push(props.url)} />
                    </div>
                </div>
            </div>
        </div>
    );
}
