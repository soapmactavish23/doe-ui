'use client';

import Image from 'next/image';
import imgLoading from '@/public/logo.png';

export default function LoadingContent() {
    return (
        <div id="route-loading" aria-live="polite" aria-busy="true" role="status">
            <div className="loading-content">
                <Image src={imgLoading} alt="Fundação DOE carregando" width={220} height={220} priority className="loading-logo" />

                <p className="loading-text">Carregando sorrisos...</p>

                <div className="loading-track" aria-hidden="true">
                    <div className="loading-bar" />
                </div>
            </div>

            <style jsx global>{`
                #route-loading {
                    position: fixed;
                    inset: 0;
                    z-index: 9999;

                    display: flex;
                    align-items: center;
                    justify-content: center;

                    /* Sem fundo e sem desfoque */
                    background: transparent;
                    pointer-events: all;
                }

                .loading-content {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    gap: 14px;
                }

                .loading-logo {
                    display: block;
                    width: 220px;
                    height: auto;
                    object-fit: contain;

                    animation: loading-pulse 1.5s ease-in-out infinite;
                }

                .loading-text {
                    margin: 0;

                    color: #f5b800;
                    font-size: 18px;
                    font-weight: 700;
                    font-family: Arial, Helvetica, sans-serif;
                    text-align: center;
                }

                .loading-track {
                    position: relative;

                    width: 180px;
                    height: 10px;

                    overflow: hidden;

                    border: 2px solid rgba(245, 184, 0, 0.25);
                    border-radius: 999px;

                    background: rgba(245, 184, 0, 0.12);
                }

                .loading-bar {
                    position: absolute;
                    top: 0;
                    bottom: 0;
                    left: -45%;

                    width: 45%;
                    border-radius: 999px;

                    background: linear-gradient(90deg, rgba(255, 214, 64, 0.25), #f5b800, #ffd640, rgba(255, 214, 64, 0.25));

                    animation: loading-slide 1.2s ease-in-out infinite;
                }

                @keyframes loading-slide {
                    0% {
                        left: -45%;
                    }

                    50% {
                        left: 55%;
                    }

                    100% {
                        left: 110%;
                    }
                }

                @keyframes loading-pulse {
                    0%,
                    100% {
                        transform: scale(1);
                    }

                    50% {
                        transform: scale(1.04);
                    }
                }

                @media (max-width: 480px) {
                    .loading-logo {
                        width: 180px;
                    }

                    .loading-text {
                        font-size: 16px;
                    }

                    .loading-track {
                        width: 150px;
                    }
                }

                @media (prefers-reduced-motion: reduce) {
                    .loading-logo,
                    .loading-bar {
                        animation: none;
                    }

                    .loading-bar {
                        left: 25%;
                        width: 50%;
                        background: #f5b800;
                    }
                }
            `}</style>
        </div>
    );
}
