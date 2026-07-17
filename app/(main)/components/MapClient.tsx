// components/MapClient.tsx
'use client';
import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-geosearch/dist/geosearch.css';
import Moment from 'moment';
import { Occurrence } from '@/app/api/models/occurrence';
import iconUrl from '../../../assets/marcker_snack.png';

interface MapClientProps {
    occurrences: Occurrence[];
}

export default function MapClient({ occurrences }: MapClientProps) {
    const mapRef = useRef<any>(null);
    const mapContainerRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (!mapRef.current && mapContainerRef.current) {
            const map = L.map(mapContainerRef.current).setView([-3.4168426, -52.2159489], 6);
            mapRef.current = map;

            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; OpenStreetMap contributors'
            }).addTo(map);
        }

        const map = mapRef.current;
        if (!map) return;

        map.eachLayer((layer: any) => {
            if (layer instanceof L.Marker) {
                map.removeLayer(layer);
            }
        });

        const snakeIcon = new L.Icon({
            iconUrl: iconUrl.src,
            iconSize: [50, 50],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowSize: [41, 41]
        });

        occurrences.forEach((occurrence) => {
            const popupContent = `
                <h6>Ocorrência: #${occurrence.id}</h6>
                <p>Suposto Animal: <b>${occurrence.supposedAnimal.name}</b><br>
                Data: <b>${Moment(occurrence.date).utc().format('DD/MM/YYYY HH:mm:ss')}</b></p>
                <button class="popup-button" onclick="window.open('${occurrence.url}', '_blank')">Imagem do Animal</button>
            `;

            L.marker([occurrence.latitude, occurrence.longitude], {
                icon: snakeIcon
            })
                .addTo(map)
                .bindPopup(popupContent);
        });

        map.invalidateSize();
    }, [occurrences]);

    return <div ref={mapContainerRef} style={{ height: '500px', width: '100%' }} />;
}
