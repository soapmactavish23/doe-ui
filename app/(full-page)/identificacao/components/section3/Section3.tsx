'use client';

import { useRef, useState } from 'react';

import { Card } from 'primereact/card';
import { Tag } from 'primereact/tag';
import { Toast } from 'primereact/toast';
import { Paginator, PaginatorPageChangeEvent } from 'primereact/paginator';

import { OccurrenceListResponse, OccurrenceResponse } from '@/app/api/models/occurrence';
import { occurrenceService } from '@/app/api/services/occurrence/occurrence_service_impl';

import './styles.scss';

interface Section3Props {
    identifications: OccurrenceListResponse[];
    onSelectIdentification: (identification: any) => void;
}

const getStatusSeverity = (status: string): 'success' | 'info' | 'warning' | 'danger' | 'secondary' | 'contrast' | null | undefined => {
    if (status === 'Finalizado') {
        return 'success';
    }

    if (status === 'Em análise') {
        return 'info';
    }

    return 'danger';
};

const getStatusIcon = (status: string) => {
    if (status === 'Finalizado') {
        return 'pi pi-check-circle';
    }

    if (status === 'Em análise') {
        return 'pi pi-search';
    }

    return 'pi pi-times-circle';
};

export default function Section3({ identifications, onSelectIdentification }: Section3Props) {
    const toast = useRef<Toast>(null);

    const [first, setFirst] = useState(0);
    const rows = 5;

    const paginatedIdentifications = identifications.slice(first, first + rows);

    const handlePageChange = (event: PaginatorPageChangeEvent) => {
        setFirst(event.first);
    };

    const handleClickIdentification = (item: OccurrenceListResponse) => {
        occurrenceService
            .findDetail(item.id)
            .then((data: OccurrenceResponse) => {
                onSelectIdentification(data);
            })
            .catch((err) => {
                toast.current?.show({
                    severity: 'error',
                    summary: 'Erro',
                    detail: `${err}`,
                    life: 3000
                });
            });
    };

    return (
        <>
            <Toast ref={toast} />

            <Card className="identification-section3 border-round-2xl h-full">
                <div className="flex align-items-center justify-content-between mb-3">
                    <h3 className="m-0 text-xl font-bold text-900">Identificações recentes</h3>
                </div>

                <div className="flex flex-column">
                    {paginatedIdentifications.map((item) => (
                        <div
                            key={item.id}
                            role="button"
                            tabIndex={0}
                            className="identification-section3__item flex align-items-center gap-3 py-3 cursor-pointer"
                            onClick={() => handleClickIdentification(item)}
                            onKeyDown={(event) => {
                                if (event.key === 'Enter') {
                                    handleClickIdentification(item);
                                }
                            }}
                        >
                            <img src={item.image} alt={item.animalName} className="identification-section3__image border-round-lg" />

                            <div className="flex-1">
                                <strong className="block text-900 mb-1">{item.animalName}</strong>

                                <small className="text-500 font-italic">{new Date(item.date).toLocaleString('pt-BR')}</small>
                            </div>

                            <div className="flex flex-column align-items-end gap-2">
                                <Tag value={item.status} severity={getStatusSeverity(item.status)} rounded icon={getStatusIcon(item.status)} />
                            </div>
                        </div>
                    ))}

                    {identifications.length > rows && (
                        <Paginator
                            first={first}
                            rows={rows}
                            totalRecords={identifications.length}
                            onPageChange={handlePageChange}
                            template="FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
                            currentPageReportTemplate="{first} - {last} de {totalRecords}"
                            className="identification-section3__paginator mt-3"
                        />
                    )}
                </div>
            </Card>
        </>
    );
}
