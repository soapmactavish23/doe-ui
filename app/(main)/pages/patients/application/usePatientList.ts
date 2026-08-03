'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { useQuery } from '@tanstack/react-query';

import { DataTableFilterEvent, DataTableFilterMeta, DataTableFilterMetaData, DataTableOperatorFilterMetaData, DataTablePageEvent } from 'primereact/datatable';

import { LazyTableState } from '@/app/api/core/pageable';
import { QueryKey } from '@/app/lib/react-query';

import { PatientResponse } from '../domain/patient';

import { patientService } from './patient.service';

interface PatientFilter {
    value: string;
    matchMode: 'contains';
}

export type PatientFilters = DataTableFilterMeta & {
    name: {
        value: string;
        matchMode: 'contains';
    };
};

const initialLazyState: LazyTableState<PatientFilters> = {
    first: 0,
    rows: 10,
    page: 0,
    sortField: '',
    sortOrder: 0,
    filters: {
        name: {
            value: '',
            matchMode: 'contains'
        }
    }
};

export function usePatientList() {
    const router = useRouter();

    const [lazyState, setLazyState] = useState<LazyTableState<PatientFilters>>(initialLazyState);

    const [isRemoving, setIsRemoving] = useState(false);

    const { data, isLoading, refetch } = useQuery({
        queryKey: [QueryKey.PATIENT_FIND_ALL, lazyState.page, lazyState.rows, lazyState.filters.name.value],

        queryFn: () =>
            patientService.search({
                name: lazyState.filters.name.value,
                pageable: {
                    page: lazyState.page,
                    size: lazyState.rows
                }
            })
    });

    const openNew = () => {
        router.push('/pages/patients/form-patient');
    };

    const openEdit = (patient: PatientResponse) => {
        router.push(`/pages/patients/form-patient?id=${patient.id}`);
    };

    const remove = async (patient: PatientResponse): Promise<void> => {
        try {
            setIsRemoving(true);

            await patientService.remove(patient.id);

            await refetch();
        } finally {
            setIsRemoving(false);
        }
    };

    const handlePage = (event: DataTablePageEvent) => {
        setLazyState((current) => ({
            ...current,
            first: event.first,
            page: event.page ?? 0,
            rows: event.rows
        }));
    };

    const handleFilter = (event: DataTableFilterEvent) => {
        setLazyState((current) => ({
            ...current,
            first: 0,
            page: 0,
            filters: {
                name: {
                    value: getFilterValue(event.filters.name),
                    matchMode: 'contains'
                }
            }
        }));
    };

    return {
        patients: data?.content ?? [],
        totalElements: data?.totalElements ?? 0,
        lazyState,

        loading: isLoading || isRemoving,

        openNew,
        openEdit,
        remove,

        handlePage,
        handleFilter
    };
}

function getFilterValue(filter: DataTableFilterMetaData | DataTableOperatorFilterMetaData | undefined): string {
    if (!filter || !('value' in filter)) {
        return '';
    }

    return String(filter.value ?? '');
}
