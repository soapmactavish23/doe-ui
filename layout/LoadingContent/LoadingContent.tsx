'use client';

import Image from 'next/image';
import { Dialog } from 'primereact/dialog';

import imgLoading from '@/public/logo.png';

import './styles.scss';

interface LoadingContentProps {
    visible: boolean;
}

export default function LoadingContent({ visible }: LoadingContentProps) {
    return (
        <Dialog
            visible={visible}
            onHide={() => undefined}
            modal
            closable={false}
            dismissableMask={false}
            draggable={false}
            resizable={false}
            showHeader={false}
            blockScroll
            className="doe-loading-dialog"
            maskClassName="doe-loading-mask"
            contentClassName="doe-loading-content"
            aria-label="Carregando"
        >
            <Image src={imgLoading} alt="Fundação DOE" width={220} height={220} priority className="doe-loading-logo" />

            <span className="doe-loading-text">Carregando sorrisos...</span>

            <div className="doe-loading-track" aria-hidden="true">
                <div className="doe-loading-bar" />
            </div>
        </Dialog>
    );
}
