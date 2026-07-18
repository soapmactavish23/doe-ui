/* eslint-disable @next/next/no-img-element */
'use client';

import imgLogo from '@/public/logo.png';

export default function Home() {
    return (
        <>
            <div className="card">
                <div className="text-center mb-5">
                    <img src={imgLogo.src} alt="Image" height="100" className="mb-3" />
                    <div className="text-900 text-3xl font-medium mb-3">Doe</div>
                </div>
                <br />
            </div>
        </>
    );
}
