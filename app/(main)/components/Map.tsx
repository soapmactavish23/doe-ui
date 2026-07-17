// components/Map.tsx
'use client';

import dynamic from 'next/dynamic';
import { Fieldset } from 'primereact/fieldset';
import { Occurrence } from '@/app/api/models/occurrence';

const MapClient = dynamic(() => import('./MapClient'), { ssr: false });

interface MapProps {
    occurrences: Occurrence[];
}

export default function Map({ occurrences }: MapProps) {
    return (
        <div className="col-12">
            <Fieldset legend="Localização dos acidentes">
                <MapClient occurrences={occurrences} />
            </Fieldset>
        </div>
    );
}
